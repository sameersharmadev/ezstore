import pool from '../db/db.js'
export const addToCart=async(req,res)=>{
    const userId=req.user.id
    const {product_id,quantity}=req.body
    if(!product_id||!quantity||quantity<=0) return res.status(400).json({error:'Invalid product id or quantity'})
    try{
        const existingItems=await pool.query('SELECT * FROM cart_items WHERE user_id=$1 AND product_id=$2',[userId,product_id])
        if(existingItems.rows.length>0){
            const updated=await pool.query('UPDATE cart_items SET quantity=quantity+$1 WHERE id=$2',[quantity,existingItems.rows[0].id])
            return res.status(200).json(updated.rows[0])
        }
        else{
            const result=await pool.query('INSERT INTO cart_items (user_id,product_id,quantity) VALUES ($1, $2, $3) RETURNING *',[userId,product_id,quantity])
            return res.status(201).json(result.rows[0])
        }
    }catch(error){
        res.status(500).json({error:'Error adding item'})
    }
}
export const getCartItems = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query(
            `SELECT ci.id AS cart_item_id, ci.quantity, p.id AS product_id, p.name, p.description, p.price, p.stock, (ci.quantity * p.price) AS total_price,pi.image_url AS primary_image
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = true
            WHERE ci.user_id = $1`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Error fetching cart items' });
    }
};
export const updateCartQuantity = async (req, res) => {
    const userId = req.user.id;
    const { cart_item_id, quantity } = req.body;
    if (!cart_item_id || typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid cart item ID or quantity' });
    }

    try {
        const existingItem = await pool.query(
            'SELECT * FROM cart_items WHERE id=$1 AND user_id=$2',
            [cart_item_id, userId]
        );
        if (existingItem.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        const product_id = existingItem.rows[0].product_id;
        const product = await pool.query(
            'SELECT stock FROM products WHERE id = $1',
            [product_id]
        );
        if (product.rows.length === 0 || product.rows[0].stock < quantity) {
            return res.status(400).json({ error: 'Product not available or insufficient stock' });
        }
        const updated = await pool.query(
            'UPDATE cart_items SET quantity=$1 WHERE id=$2 RETURNING *',
            [quantity, cart_item_id]
        );
        res.status(200).json(updated.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating quantity in cart' });
    }
};

export const deleteCartItem=async(req,res)=>{
    const userId=req.user.id
    const{cart_item_id}=req.body
    try{
        const result=await pool.query('DELETE from cart_items WHERE user_id=$1 AND id=$2 RETURNING *',[userId,cart_item_id])
        if(result.rows.length===0) return res.status(404).json({error:'Cart item not found'})
        res.status(200).json(result.rows[0])
    }catch(error){
        res.status(500).json({error:'Error deleting cart item'})
    }
}
export const clearCart=async (req,res)=>{
    const userId=req.user.id
    try{
        const result=await pool.query('DELETE FROM cart_items WHERE user_id=$1 RETURNING *',[userId])
        res.status(200).json(result.rows)
    }catch(error){
        res.status(500).json({error:'Error clearing cart'})
    }
}
