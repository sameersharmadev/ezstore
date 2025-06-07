import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken'
export const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.authorization
    const token=authHeader&&authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token' })
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return res.status(403).json({error:'Invalid token'})
        req.user=user;
        next();
    })
}
export const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};