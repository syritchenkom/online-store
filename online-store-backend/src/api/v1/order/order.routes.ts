import { Router } from 'express';
import orderController from './order.controller';
import authMiddleware from '../../../middleware/auth.middleware';

const router = Router();

// POST /api/v1/orders - Create a new order from the user's basket
router.post('/', authMiddleware, orderController.create);

export default router;