import pool from '../db/db.js'
//Add product
export const addProduct=async (req,res)=>{
    const {name,description,price,stock}=req.body
    try{
        const result=await pool.query('INSERT INTO products (name,description,price,stock) VALUES ($1,$2,$3,$4)',[name,description,price,stock])
        res.status(201).json(result.rows[0])
    }catch(error){
        return res.status(500).json({error:'Error adding product'})
    }
}
export const getProducts=async (req,res)=>{
    try{
        const result=await pool.query('SELECT * FROM products ORDER BY id')
        res.status(200).json(result.rows)
    }catch(error){
        return res.status(500).json({error:'Error fetching product'})
    }
}
export const getProductById=async (req,res)=>{
    const {id}=req.params
    try{
        const result=await pool.query('SELECT * FROM products where id=$1',[id])
        return result.rows.length===0?res.status(404).json({error:'Product not found'}):res.status(200).json(result.rows[0])
    }catch(error){
        return res.status(500).json({error:'Error fetching product'})
    }
}
export const updateProduct=async(req,res)=>{
    const {id}=req.params
    const{name,description,price,stock}=req.body
    try{
        const result=await pool.query('UPDATE products SET name=$1, description=$2, price=$3, stock=$4 where id=$5 RETURNING *',[name,description,price,stock,id])
        return result.rows.length===0?res.status(404).json({error:'Product not found'}):res.status(200).json(result.rows[0])
    }catch(error){
        res.status(500).json({error:'Error updating product'})
    }
}
export const deleteProduct=async(req,res)=>{
    const id=req.params.id
    try{
        const result=await pool.query('DELETE FROM products WHERE id=$1 RETURNING *',[id])
        return result.rows.length===0?res.status(404).json({error:'Product not found'}):res.status(200).json(result.rows[0])
    }catch(error){
        res.status(500).json({error:'Error deleting product'})
    }
}