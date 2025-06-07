import express from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/',verifyToken,getUserOrders)
router.post('/create', verifyToken, createOrder);

export default router;
