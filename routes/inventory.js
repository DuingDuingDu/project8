const express = require('express');
const router = express.Router();
const db = require('../shared/db');

router.get('/', (req, res, next) => {
    db.query('SELECT * FROM inventory', (err, results) => {
        if (err) return next(err);
        res.json(results);
    });
});

router.post('/', (req, res, next) => {
    const { item, quantity } = req.body;
    db.query('INSERT INTO inventory (item, quantity) VALUES (?, ?)', [item, quantity], (err, results) => {
        if (err) return next(err);
        res.status(201).json({ id: results.insertId, item, quantity });
    });
});

module.exports = router;
