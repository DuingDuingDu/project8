const express = require('express');
const router = express.Router();
const db = require('../shared/db');

router.get('/', (req, res, next) => {
    db.query('SELECT * FROM finance', (err, results) => {
        if (err) return next(err);
        res.json(results);
    });
});

router.post('/', (req, res, next) => {
    const { type, amount } = req.body;
    db.query('INSERT INTO finance (type, amount) VALUES (?, ?)', [type, amount], (err, results) => {
        if (err) return next(err);
        res.status(201).json({ id: results.insertId, type, amount });
    });
});

module.exports = router;
