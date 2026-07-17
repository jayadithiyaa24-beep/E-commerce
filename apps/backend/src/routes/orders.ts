import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Create an order (Checkout)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { items, address } = req.body; 

  if (!items || items.length === 0) {
    return res.status(400).json({ status: 'error', message: 'Cart is empty' });
  }

  try {
    // Transactional checkout: Deduct inventory and create order
    const result = await prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        // Deduct stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } }
        });

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        });
      }

      // Create Address
      const newAddress = await tx.address.create({
        data: {
          street: address.street,
          city: address.city,
          state: address.state,
          zip: address.zip,
          country: address.country
        }
      });

      // Create Order
      const order = await tx.order.create({
        data: {
          userId,
          addressId: newAddress.id,
          total,
          status: 'PAID', // Simulated successful payment
          items: {
            create: orderItemsData
          }
        },
        include: { items: true, address: true }
      });

      return order;
    });

    res.json({ status: 'success', data: result, message: 'Order placed successfully via mock payment gateway' });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message || 'Checkout failed' });
  }
});

// Get User's Orders
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: { items: { include: { product: true } }, address: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ status: 'success', data: orders });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

export default router;
