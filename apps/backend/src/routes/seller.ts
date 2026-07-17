import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Only allow SELLER and ADMIN to access these routes
router.use(authenticate);
router.use(authorize(['SELLER', 'ADMIN']));

// Get seller's products
router.get('/products', async (req: AuthRequest, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { sellerId: req.user!.id },
      include: { category: true, variants: true, images: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ status: 'success', data: products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Create a new product for this seller
router.post('/products', async (req: AuthRequest, res) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId,
        sellerId: req.user!.id
      }
    });

    res.status(201).json({ status: 'success', data: product });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;
