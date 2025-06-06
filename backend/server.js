import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth.js';
import productsRouter from './routes/products.js';

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get("/",(req,res)=>{
    res.status(200).send("working")
})
app.use('/api/products', productsRouter);

app.listen(4000);