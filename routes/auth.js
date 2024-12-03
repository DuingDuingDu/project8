const express = require('express');
const router = express.Router();
const db = require('../shared/db');

// 로그인 페이지 라우트
router.get('/login', (req, res) => {
    res.render('login'); // 사용자 로그인 페이지
});

// 사용자 로그인 처리 라우트
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE `username` = ? AND `password` = ? AND `role` = ?';
    db.query(query, [username, password, 'user'], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.json({ success: false, message: 'Database query error.' });
        }

        if (results.length > 0) {
            const user = results[0];
            req.session.user = user;
            res.json({ success: true, message: 'Login successful.', redirectUrl: '/user-dashboard' }); // 사용자 대시보드로 리디렉션
        } else {
            res.json({ success: false, message: 'Invalid username or password.' });
        }
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('로그아웃 중 에러가 발생했습니다.');
        }
        res.clearCookie('connect.sid');
        res.send({ success: true });
    });
});

module.exports = router;
