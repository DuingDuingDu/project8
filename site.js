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
const secretKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
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
// 기존 코드에 추가
app.use('/', router);  // 또는 app.use('/api', router);로 설정하면 /api 경로로 요청이 가능


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

/*
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
*/

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

    // `orderId`를 여기서 생성합니다.
    const { service } = req.query;
    const orderId = `order-${Date.now()}`;

    if (!service) {
        return res.status(400).send('Invalid payment data.');
    }

    let amount;
    let orderName;

    switch (service) {
        case "55000":
            amount = 55000;
            orderName = "Basic Monthly";
            break;
        case "110000":
            amount = 110000;
            orderName = "Standard Monthly";
            break;
        case "440000":
            amount = 440000;
            orderName = "Business Monthly";
            break;
        case "770000":
            amount = 770000;
            orderName = "Premium Monthly";
            break;
        case "285000":
            amount = 285000;
            orderName = "Basic 6 Months Prepaid";
            break;
        case "550000":
            amount = 550000;
            orderName = "Standard 6 Months Prepaid";
            break;
        case "2200000":
            amount = 2200000;
            orderName = "Business 6 Months Prepaid";
            break;
        case "3850000":
            amount = 3850000;
            orderName = "Premium 6 Months Prepaid";
            break;
        case "550000_12":
            amount = 550000;
            orderName = "Basic 12 Months Prepaid";
            break;
        case "1100000_12":
            amount = 1100000;
            orderName = "Standard 12 Months Prepaid";
            break;
        case "4400000_12":
            amount = 4400000;
            orderName = "Business 12 Months Prepaid";
            break;
        case "7700000_12":
            amount = 7700000;
            orderName = "Premium 12 Months Prepaid";
            break;
        default:
            return res.status(400).send('Invalid service selection.');
    }

    console.log("Amount:", amount);
    console.log("Order ID:", orderId);
    console.log("Order Name:", orderName);

    // 결제 페이지로 데이터를 전달
    res.render('user/payment', { amount, orderId, orderName });
});

app.get('/order/success', (req, res) => {

    //console.log('Received siteUrl:', siteUrl);

    const orderId = Array.isArray(req.query.orderId) ? req.query.orderId[0] : req.query.orderId;
    const amount = Array.isArray(req.query.amount) ? req.query.amount[0] : req.query.amount;
    const {orderName, siteUrl } = req.query;

    // 현재 로그인한 사용자의 정보를 세션에서 가져옵니다.
    const userName = req.session.user ? req.session.user.name : null;
    const userUsername = req.session.user ? req.session.user.username : null;  // username 추가

    if (!userName || !userUsername) {
        console.error('User name or username not found in session.');
        return res.status(500).send('User name or username not found in session.');
    }

    const query = `
        INSERT INTO orders (order_id, user_name, username, service_name, amount, site_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    console.log('Executing query:', query, [orderId, userName, userUsername, orderName, amount, siteUrl]);

    db.query(query, [orderId, userName, userUsername, orderName, amount, siteUrl], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error while inserting order.');
        }

        console.log('Order saved successfully.');
        res.render('user/success', { orderId });
    });
});





app.get('/order/fail', (req, res) => {
    const orderId = req.query.orderId;
    res.render('user/fail', { orderId });
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
router.get('/api/check-username', (req, res) => {
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
    const serviceCode = service.trim();

    console.log('Redirecting to /payment with service:', serviceCode, 'and orderId:', orderId);

    // 서비스 코드를 쿼리스트링에 포함시켜 리디렉션
    res.redirect(`/payment?orderId=${orderId}&service=${encodeURIComponent(serviceCode)}`);
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
            successUrl: `http://localhost:8098/order/success?orderId=${orderId}`,  // orderId 포함
            failUrl: `http://localhost:8098/order/fail?orderId=${orderId}`
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
