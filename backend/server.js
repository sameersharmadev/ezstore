import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth.js';
import productsRouter from './routes/products.js';
import cartRoutes from './routes/cart.js'
dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get("/",(req,res)=>{
    res.status(200).send("working")
})
app.use('/api/products', productsRouter);
app.use('/cart', cartRoutes);

app.listen(4000);