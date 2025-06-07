import express from 'express';
import { addToCart, getCartItems, updateCartQuantity, deleteCartItem, clearCart } from '../controllers/cartController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post('/add', verifyToken, addToCart);
router.get('/', verifyToken, getCartItems);
router.put('/update', verifyToken, updateCartQuantity);
router.delete('/delete', verifyToken, deleteCartItem);
router.delete('/clear', verifyToken, clearCart);

export default router;
