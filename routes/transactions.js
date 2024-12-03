const express = require('express');
const router = express.Router();
const db = require('../shared/db');

// GET all transactions
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM transactions';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// POST a new transaction
router.post('/', (req, res) => {
  const { date, description, amount, type } = req.body;
  const sql = 'INSERT INTO transactions (date, description, amount, type) VALUES (?, ?, ?, ?)';
  db.query(sql, [date, description, amount, type], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

module.exports = router;
