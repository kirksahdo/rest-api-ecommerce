const express = require('express');
const router = express.Router();

const mysql = require('../database/mysql');

router.get('/', (req, res) => {
    mysql.getConnection((err, conn) => {
        if(err) return res.status(500).send({ error: err });
        conn.query(
            'SELECT * from orders',
            [],
            (err, results, fields) => {
                if(err) return res.status(500).send({ error: err.sqlMessage });
                return res.status(200).json(results);
            }
        );
    });
});

router.post('/', (req, res)=>{
    mysql.getConnection((err, conn) => {
        if(err) return res.status(500).send({ error: err });
        const { quantity, product_id } = req.body;
        conn.query(
            'INSERT INTO orders (quantity, product_id) VALUES (?, ?)',
            [quantity, product_id],
            (err, results, fields) => {
                if(err) return res.status(500).send({ error: err.sqlMessage });
                return res.status(201).json({
                    message: 'Successfull',
                    product_id: results.insertId
                })
            }
        );
    });
});

router.put('/:order_id', (req, res) => {
    mysql.getConnection((err, conn) => {
        if(err) return res.status(500).send({ error: err });
        const { order_id } = req.params;
        const { quantity, product_id } = req.body;
        conn.query(
            'UPDATE orders SET quantity = ?, product_id = ? WHERE order_id = ?',
            [quantity, product_id, order_id],
            (err, result, fields)=>{
                if(err) return res.status(500).send({ error: err.sqlMessage });
                return res.status(201).json({
                    message: 'Successfull',
                    product_id
                })
            })
    })
});

module.exports = router;