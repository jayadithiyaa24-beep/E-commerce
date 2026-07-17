import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Get all products with filtering, searching, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt', 
      order = 'desc', 
      page = 1, 
      limit = 10 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    let whereClause: any = {};
    if (search) {
      whereClause.name = { contains: String(search), mode: 'insensitive' };
    }
    if (category) {
      whereClause.category = { slug: String(category) };
    }
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = Number(minPrice);
      if (maxPrice) whereClause.price.lte = Number(maxPrice);
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: { images: true, category: true, variants: true },
        orderBy: { [String(sortBy)]: String(order) },
        skip,
        take
      }),
      prisma.product.count({ where: whereClause })
    ]);

    res.json({
      status: 'success',
      data: products,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Get product details by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        variants: true
      }
    });

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    res.json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

export default router;
