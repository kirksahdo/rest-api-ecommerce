const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql');

router.get('/', (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err) { return res.status(500).send({error: err}) }
        conn.query(
            'SELECT * from products',
            [],
            (err, results, fields) => {
                conn.release();
                if(err) { return res.status(500).send({error: err}) }
                const response = {
                    quantity: results.length,
                    products: results.map(prod => ({
                        product_id: prod.product_id,
                        name: prod.name,
                        price: prod.price,
                        request: {
                            type: 'GET',
                            desc: 'Return all products',
                            url: `http://locahost:3000/products/${prod.product_id}`
                        }
                    }))
                }
                return res.status(201).json(response);
            }
        );
    })
});

router.get('/:product_id', (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err) { return res.status(500).send({error: err}) }
        conn.query(
            'SELECT * from products WHERE products.product_id = ?',
            [req.params.product_id],
            (err, results, fields) => {
                conn.release();
                if(err) { return res.status(500).send({error: err}) }
                if(results.length == 0) {
                    return res.status(204).send({
                        error: 'Product not found'
                    });
                }
                return res.status(200).json(results[0]);
            }
        );
    })
});

router.post('/', (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err) { return res.status(500).send({error: err}) }
        conn.query(
            'INSERT INTO products (name,price) VALUES (?,?)',
            [req.body.name, req.body.price],
            (err, result, field) => {
                conn.release();  
                if(err) { return res.status(500).send({error: err}) }
                return res.status(201).send({
                    message: 'Successfull!',
                    product_id: result.insertId
                })
            }
        );
    })
});


router.put('/:product_id', (req, res) => {
    mysql.getConnection((err, conn) => {
        if(err) { return res.status(500).send({error: err}) }
        const { name, price } = req.body;
        const { product_id } = req.params;
        conn.query(
            'UPDATE products SET name = ?, price = ? WHERE product_id = ?',
            [name, price, product_id],
            (err, results, fields) => {
                conn.release();
                if(err) { return res.status(500).send({error: err}) }
                return res.status(202).send({
                    message: 'Successfull!',
                })
            }
        );
    });
});

router.delete('/:product_id', (req, res) => {
    mysql.getConnection((err, conn) => {
        if(err) { return res.status(500).send({error: err}) }
        const { product_id } = req.params;
        conn.query(
            'DELETE FROM products WHERE product_id = ?',
            [product_id],
            (err, results, fields) => {
                conn.release();
                if(err) { return res.status(500).send({error: err}) }
                return res.status(202).send({
                    message: 'Successfull delete!',
                })
            }
        );
    });
});

module.exports = router;