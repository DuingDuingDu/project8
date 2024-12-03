const express = require('express');
const router = express.Router();
const db = require('../shared/db');

router.get('/login', (req, res) => {
    res.render('login'); // login.ejs 파일을 렌더링합니다.
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM employees WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database query error.' });
        }

        if (results.length > 0) {
            const user = results[0];
            req.session.user = user;
            return res.json({ success: true, message: 'Login successful.', redirectUrl: '/' });
        } else {
            return res.status(401).json({ success: false, message: '아이디 혹은 비밀번호가 틀렸습니다.' });
        }
    });
});

module.exports = router;
