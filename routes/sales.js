const express = require('express');
const router = express.Router();
const db = require('../shared/db');

// GET all sales
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM sales';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// POST a new sale
router.post('/', (req, res) => {
  const { customer_name, product, quantity, price, date } = req.body;
  const sql = 'INSERT INTO sales (customer_name, product, quantity, price, date) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [customer_name, product, quantity, price, date], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

module.exports = router;
