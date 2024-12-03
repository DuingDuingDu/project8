document.addEventListener('DOMContentLoaded', function() {
    maskSSN(); // 마스킹 함수 호출

    let isUsernameChecked = false; // 아이디 중복검사 여부를 추적하는 변수

    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();

        if (!isUsernameChecked) {
            alert('아이디 중복검사를 해주세요.');
            return; // 중복검사를 하지 않은 경우 회원가입을 진행하지 않음
        }

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const phoneNumber = document.getElementById('phone_number').value;
        const company = document.getElementById('company').value;
        const ssnFrontElement = document.getElementById('ssn-front');
        const ssnBackElement = document.getElementById('ssn-back');

        let ssn = '';

        if (ssnFrontElement && ssnBackElement) {
            const ssnFront = ssnFrontElement.value;
            const ssnBack = ssnBackElement.value.replace(/\*/g, ''); // *를 실제 값으로 변환해야 함

            // 주민등록번호 앞자리와 뒷자리가 모두 존재할 때만 결합
            if (ssnFront && ssnBack) {
                ssn = ssnFront + '-' + ssnBack;
            } else {
                console.error('주민등록번호 앞자리 또는 뒷자리가 없습니다.');
            }
        } else {
            console.error('주민등록번호 입력 필드가 존재하지 않습니다.');
        }

        const gender = document.getElementById('gender').value;
        const address = document.getElementById('address').value;

        const signupData = { 
            username, 
            email, 
            password, 
            name, 
            phone_number: phoneNumber, 
            company, 
            ssn, 
            gender, 
            address 
        };

        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.href = '/login'; // 회원가입 후 로그인 페이지로 이동
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        });
    });

    // 아이디 중복 검사 기능
    document.getElementById('check-username-button').addEventListener('click', function() {
        const username = document.getElementById('username').value;
        if (!username) {
            alert('아이디를 입력해주세요.');
            return;
        }

        fetch(`/api/check-username?username=${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.available) {
                alert('사용 가능한 아이디입니다.');
                isUsernameChecked = true;
            } else {
                alert('이미 사용 중인 아이디입니다.');
                isUsernameChecked = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('아이디 중복 검사 중 오류가 발생했습니다.');
            isUsernameChecked = false;
        });
    });
});

// 주민등록번호 뒷자리 마스킹 처리 함수
function maskSSN() {
    const ssnBackInput = document.getElementById('ssn-back');
    if (ssnBackInput) {
        ssnBackInput.addEventListener('input', function() {
            const value = ssnBackInput.value;
            ssnBackInput.value = value.replace(/\d/g, '*'); // 숫자를 '*'로 대체
        });
    } else {
        console.error('주민등록번호 뒷자리 입력 필드를 찾을 수 없습니다.');
    }
}
