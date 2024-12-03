const express = require('express');
const router = express.Router();
const db = require('../shared/db');

// 관리자 페이지 라우트
router.get('/', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/');
    }
    res.render('admin', { user: req.session.user });
});

router.get('/users', (req, res) => {
    const query = 'SELECT username, email, name, phone_number, company, ssn, gender, address FROM users';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database query error.' });
        }
        
        res.json({ success: true, users: results });
    });
});

module.exports = router;
