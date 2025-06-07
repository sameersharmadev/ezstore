import pool from '../db/db.js'
export const createOrder=async(req,res)=>{
    const userId=req.user.id
    try{
        const cartRes=await pool.query('SELECT ci.product_id, ci.quantity, p.price, p.stock FROM cart_items ci JOIN products p ON ci.product_id=p.id WHERE ci.user_id=$1',[userId])
        const cartItems = cartRes.rows;
        if (cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });
        for(let item of cartItems){
            if(item.quantity>item.stock){
                return res.status(400).json({error:'Insufficient stock'})
            }
        }
        const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
        const orderRes=await pool.query('INSERT INTO  orders (user_id,total_price) VALUES ($1, $2) RETURNING *',[userId,total])
        const order=orderRes.rows[0];
        for(let item of cartItems){
            await pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',[order.id, item.product_id, item.quantity, item.price])
            await pool.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`,[item.quantity, item.product_id])
        }
        await pool.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId])
        res.status(201).json({ message: 'Order placed', order })
    }catch(error){
        console.error('Error placing order:', error);
        res.status(500).json({error:'Failed to place an order'})
    }
}
export const getUserOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const ordersRes = await pool.query(`SELECT id, total_price, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,[userId]);
        const orders = ordersRes.rows;
        if (orders.length === 0) {
            return res.status(200).json({ message: 'No orders found', orders: [] });
        }
        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const itemsRes = await pool.query(`SELECT oi.product_id, p.name, p.description, oi.quantity, oi.price, (oi.quantity * oi.price) AS total_item_price FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1`,[order.id]);
                return {...order,items: itemsRes.rows,};
            })
        );
        res.status(200).json(ordersWithItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
};
