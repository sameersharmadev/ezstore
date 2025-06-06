import pool from '../db/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
//Register user
export const registerUser=async(req,res)=>{
    const {email,password}=req.body
    try{
        const hashed=await bcrypt.hash(password,10)
        const result=await pool.query('INSERT INTO users (email,password) VALUES ($1,$2) RETURNING id,email',[email,hashed])
        res.status(201).json(result.rows[0]);
    }catch(err){
        res.status(500).json({ error: 'User registration failed' });
    }
}

//Login user
export const loginUser=async(req,res)=>{
    const {email,password}=req.body
    try{
        const result=await pool.query('SELECT * FROM users WHERE email=$1',[email])
        const user=result.rows[0]
        if(!user) res.send(401).json({error:'User not found'})
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(401).json({error:'Wrong password'})
        const token=jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:'1d',})
        res.json(token)
    }catch(err){
        res.status(500).json({error:'Login failed'})
    }
}

//Getme function
export const getMe = (req, res) => {
    res.json({ user: req.user });
};
  