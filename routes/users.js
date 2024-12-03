const express = require('express');
const router = express.Router();
const db = require('../shared/db');

// GET all users
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// POST a new user
// POST a new user
router.post('/', (req, res) => {
  const { username, email, password, name, phone_number, company, ssn, gender, address } = req.body;
  const sql = 'INSERT INTO users (username, email, password, name, phone_number, company, ssn, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [username, email, password, name, phone_number, company, ssn, gender, address], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});


module.exports = router;
