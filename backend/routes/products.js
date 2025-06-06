import { addProduct, getProducts, getProductById, updateProduct, deleteProduct} from '../controllers/productsController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
import express from 'express';
const router=express.Router();
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, addProduct);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);
export default router;
