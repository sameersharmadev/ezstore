import { addProduct, getProducts, getProductById, updateProduct, deleteProduct} from '../controllers/productsController.js'
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js'
import express from 'express';
const router=express.Router();
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, verifyAdmin, addProduct);
router.put('/:id', verifyToken, verifyAdmin, updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, deleteProduct);
export default router;
