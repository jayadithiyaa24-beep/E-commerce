import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ status: 'success', data: categories });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

export default router;
