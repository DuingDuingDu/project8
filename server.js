const express = require('express');
const path = require('path');
const session = require('express-session');
process.env.NODE_ENV = 'admin';
const db = require('../shared/db');

require('dotenv').config({ path: path.join(__dirname, '../shared/admin.env') });

const app = express();
const port = process.env.PORT || 8099; // 포트 번호를 8099로 설정



// 세션 설정
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 뷰 엔진 설정
app.set('views', path.join(__dirname, '../views/admin')); // views 경로 설정
app.set('view engine', 'ejs');

// 라우트 설정
app.use('/auth', require(path.join(__dirname, '../routes/admin-auth')));
app.use('/api/users', require('../routes/users'));
app.use('/admin', require('../routes/admin')); // 관리자 라우트 추가

app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    const user = req.session.user;
    if (user.role === 'admin') {
        res.render('admin', { user });  // admin.ejs 렌더링
    } else {
        res.render('index', { user });  // index.ejs 렌더링
    }
});



// 정적 파일 서비스 설정 (라우트 설정 아래에 위치)
app.use(express.static(path.join(__dirname, '../public')));


app.get('/api/logout', (req, res) => {
    //console.log('Logout route hit');
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Failed to logout');
        }
        res.redirect('/auth/login'); // 로그아웃 후 로그인 페이지로 리디렉션
    });
});

app.get('/info', (req, res) => {
    // 여기에 info 관련 로직 추가
    res.json({ message: 'Info route response' });
});


app.get('/orders', (req, res) => {
    const query = 'SELECT * FROM orders';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Database error');
        }
        console.log('Orders retrieved:', results); // Log the orders
        res.render('admin', { orders: results });
    });
});

//api로 orders를 전달
app.get('/api/orders', (req, res) => {
    const query = 'SELECT * FROM orders';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json(results);  // 주문 내역을 JSON으로 응답
    });
});











// 회원 정보 API 엔드포인트
app.get('/api/users', (req, res) => {
    const query = 'SELECT username, email, name, phone_number, company, ssn, gender, address, role, password FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database query error' });
        }
        res.json(results); // Return the users' data as JSON
    });
});


// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
