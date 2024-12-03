const express = require('express');
const path = require('path');
process.env.NODE_ENV = 'site';
const db = require('../shared/db');
const crypto = require('crypto');
const session = require('express-session');
const router = express.Router();
const axios = require('axios');

const app = express();
const port = process.env.PORT || 8098; // 포트 번호를 8098로 설정
const secretKey = 'test_sk_kYG57Eba3G6oGAx2oBxk8pWDOxmA';
const encodedKey = Buffer.from(secretKey + ':').toString('base64');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'mollu',
    resave: false,
    saveUninitialized: false
}));

// 모든 요청에 대해 세션 유저를 설정
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// 정적 파일 서비스 설정
app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// 기본 라우팅
app.get('/', (req, res) => {
    res.render('user/main');
});

app.get('/contact', (req, res) => {
    res.render('user/contact');
});

app.get('/explain', (req, res) => {
    res.render('user/explain');
});

app.get('/service', (req, res) => {
    res.render('user/service');
});

app.get('/support', (req, res) => {
    res.render('user/support');
});

app.get('/login', (req, res) => {
    res.render('user/login'); // login.ejs를 렌더링
});

app.get('/signup', (req, res) => {
    res.render('user/signup'); // signup.ejs를 렌더링
});

app.get('/apply-service', (req, res) => {
    if (!req.session.user) {
        // 비로그인 상태일 때는 로그인 페이지로 리디렉션
        return res.redirect('/login');
    } else {
        // 로그인 상태일 때 결제 관련 정보를 query로 전달
        const orderId = 'unique-order-id'; // 실제 주문 ID를 생성
        const amount = 10000; // 실제 결제 금액
        const orderName = '유지보수 서비스'; // 결제 내역 이름
        return res.redirect(`/payment?orderId=${orderId}&amount=${amount}&orderName=${encodeURIComponent(orderName)}`);
    }
});


app.get('/success', (req, res) => {
    res.render('user/success');  // 성공 페이지 렌더링
});

app.get('/fail', (req, res) => {
    res.render('user/fail');  // 실패 페이지 렌더링
});

app.get('/payment', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');  // 로그인이 필요하면 로그인 페이지로 리디렉션
    }

    const service = req.query.service ? req.query.service.trim() : '';
    let amount;
    let orderName;
    console.log("Selected service:", req.query.service);

    switch (service) {
        case "55000":
            console.log("Matched: 55000");
            amount = 55000;
            orderName = "절약형";
            break;
        case "110000":
            console.log("Matched: 110000");
            amount = 
           
110000;
            orderName = "일반형";
            break;
        case "440000":
            console.log("Matched: 440000");
            amount = 440000;
            orderName = "비즈니스형";
            break;
        case "770000":
            console.log("Matched: 770000");
            amount = 770000;
            orderName = "프리미엄형";
            break;
        case "285000":
            console.log("Matched: 285000");
            amount = 285000;
            orderName = "절약형 6개월 선납";
            break;
        case "550000":
            console.log("Matched: 550000");
            amount = 550000;
            orderName = "일반형 6개월 선납";
            break;
        case "2200000":
            console.log("Matched: 2200000");
            amount = 
        
2200000;
            orderName = "비즈니스형 6개월 선납";
            break;
        case "3850000":
            console.log("Matched: 3850000");
            amount = 3850000;
            orderName = "프리미엄형 6개월 선납";
            break;
        case "550000_12":
            console.log("Matched: 550000_12");
            amount = 550000;
            orderName = "절약형 12개월 선납";
            break;
        case "1100000_12":
            console.log("Matched: 110000_12");
            amount = 1100000;
            orderName = "일반형 12개월 선납";
            break;
        case "4400000_12":
            console.log("Matched: 4400000_12");
            amount = 4400000;
            orderName = "비즈니스형 12개월 선납";
            break;
        case "7700000_12":
            console.log("Matched: 7700000_12");
            amount = 7700000;
            orderName = "프리미엄형 12개월 선납";
            break;
        default:
            console.log("No match found, invalid service.");
            return res.status(400).send('Invalid service selection.');
    }

    const orderId = 'unique-order-id-' + Date.now();

    console.log("Amount:", amount);
    console.log("Order ID:", orderId);
    console.log("Order Name:", orderName);

    res.render('user/payment', { amount, orderId, orderName });
});




app.post('/api/signup', (req, res) => {
    const { username, password, email, name, phone_number, company, ssn_front, ssn_back, gender, address } = req.body;

    try {
        // 비밀번호 암호화 (SHA-256)
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // 주민등록번호 합치기
        const ssn = `${ssn_front}-${ssn_back}`;

        // 데이터베이스에 사용자 정보 저장
        const query = 'INSERT INTO users (username, password, email, name, phone_number, company, ssn, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [username, hashedPassword, email, name, phone_number, company, ssn, gender, address], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error.' });
            }

            res.json({ success: true, message: '회원가입이 완료되었습니다.' });
        });
    } catch (err) {
        console.error('Encryption error:', err);
        res.status(500).json({ success: false, message: '비밀번호 암호화에 실패했습니다.' });
    }
});

// 아이디 중복 검사
router.get('/check-username', (req, res) => {
    const username = req.query.username;
    console.log('Received username for checking:', username);

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database query error.' });
        }

        console.log('Query Results:', results); // 이 부분에서 실제 결과를 확인

        if (results.length > 0) {
            return res.json({ available: false, message: '이미 사용중인 아이디 입니다.' });
        } else {
            return res.json({ available: true, message: '사용 가능한 아이디 입니다.' });
        }
        
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('세션 삭제 중 오류 발생:', err);
            return res.status(500).json({ success: false, message: '로그아웃에 실패했습니다.' });
        }
        res.clearCookie('connect.sid'); // 세션 쿠키 삭제
        return res.json({ success: true });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // 입력된 비밀번호를 해시화합니다.
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, hashedPassword], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database query error.' });
        }

        if (results.length > 0) {
            const user = results[0];
            req.session.user = user;
            return res.json({ success: true, redirectUrl: '/' });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }
    });
});

app.post('/payment', (req, res) => {
    const { service } = req.body;

    if (!service) {
        return res.status(400).send('서비스를 선택해주세요.');
    }

    const orderId = `order-${Date.now()}`;
    const orderName = '유지보수 서비스 결제';
    const amount = service;

    res.redirect(`/payment?orderId=${orderId}&amount=${amount}&orderName=${encodeURIComponent(orderName)}`);
});

app.post('/api/payment', async (req, res) => {
    const { amount, orderId, orderName } = req.body;

    // 금액을 숫자로 변환합니다.
    const numericAmount = parseInt(amount, 10);

    console.log('Payment request data:', { amount: numericAmount, orderId, orderName });

    try {
        const response = await axios.post('https://api.tosspayments.com/v1/payments', {
            amount: numericAmount,  // 변환된 숫자형 금액을 사용합니다.
            orderId: orderId,
            orderName: orderName,
            successUrl: 'http://localhost:8098/success',
            failUrl: 'http://localhost:8098/fail'
        }, {
            headers: {
                'Authorization': `Basic ${encodedKey}`,  // 적절한 API 키 사용
                'Content-Type': 'application/json'
            }
        });

        console.log('Payment response:', response.data);

        if (response.data.paymentUrl) {
            // 결제 URL로 리디렉션합니다.
            return res.redirect(response.data.paymentUrl);
        } else {
            // 결제 URL을 가져오지 못한 경우 오류 처리
            return res.status(500).json({ success: false, message: '결제 URL을 가져오지 못했습니다.' });
        }
    } catch (error) {
        // 결제 요청 중 오류가 발생한 경우
        console.error('Payment request error:', error.message);
        console.error('Error details:', error.response?.data);
        return res.status(500).json({ success: false, message: '결제 요청에 실패했습니다.' });
    }
});


// 서버 시작
app.listen(port, () => {
    console.log(`User site is running on http://localhost:${port}`);
});
