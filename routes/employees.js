const express = require('express');
const router = express.Router();
const db = require('../shared/db');

// GET all employees
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM employees';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// POST a new employee
router.post('/', (req, res) => {
  const { name, position, department, hire_date, salary } = req.body;
  const sql = 'INSERT INTO employees (name, position, department, hire_date, salary) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, position, department, hire_date, salary], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

module.exports = router;
