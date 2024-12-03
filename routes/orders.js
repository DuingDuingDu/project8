const express = require('express');
const router = express.Router();
const db = require('../shared/db');

router.get('/', (req, res, next) => {
    db.query('SELECT * FROM orders', (err, results) => {
        if (err) return next(err);
        res.json(results);
    });
});

router.post('/', (req, res, next) => {
    const { customer, total } = req.body;
    db.query('INSERT INTO orders (customer, total) VALUES (?, ?)', [customer, total], (err, results) => {
        if (err) return next(err);
        res.status(201).json({ id: results.insertId, customer, total });
    });
});

module.exports = router;
