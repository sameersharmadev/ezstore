import pool from '../db/db.js';

// Add product
export const addProduct = async (req, res) => {
    const { name, description, price, stock, thumbnail_url, gender, category } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO products (name, description, price, stock, thumbnail_url, gender, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, description, price, stock, thumbnail_url, gender, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ error: 'Error adding product' });
    }
};

// Add additional image
export const addProductImage = async (req, res) => {
    const { product_id, image_url, is_primary = false } = req.body;

    if (!product_id || !image_url) {
        return res.status(400).json({ error: 'Missing product_id or image_url' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, $3) RETURNING *',
            [product_id, image_url, is_primary]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error inserting image:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get all products
export const getProducts = async (req, res) => {
    const { category, gender } = req.query;
  
    try {
      let baseQuery = 'SELECT * FROM products';
      const conditions = [];
      const values = [];
  
      if (category) {
        values.push(category);
        conditions.push(`category = $${values.length}`);
      }
      if (gender) {
        values.push(gender);
        conditions.push(`gender = $${values.length}`);
      }
  
      if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
      }
  
      baseQuery += ' ORDER BY created_at DESC';
  
      const result = await pool.query(baseQuery, values);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Error fetching products' });
    }
  };
  

// Get product by ID with images
export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const imagesResult = await pool.query('SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC', [id]);

        res.status(200).json({
            ...productResult.rows[0],
            images: imagesResult.rows
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ error: 'Error fetching product' });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, thumbnail_url, gender, category } = req.body;
    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, thumbnail_url = $5, gender = $6, category = $7 WHERE id = $8 RETURNING *',
            [name, description, price, stock, thumbnail_url, gender, category, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
};
