function displaySSN(ssn, role) {
    if (role === 'admin') {
        return ssn || 'N/A';
    } else {
        return '***-*******'; // employee인 경우 주민등록번호를 마스킹 처리
    }
}

function displayPassword(password, role) {
    if (role === 'admin') {
        return password || 'N/A';
    } else {
        return '********'; // employee인 경우 비밀번호를 숨김 처리
    }
}

// 로그아웃 처리
function handleLogout() {
    fetch('/api/logout', {
        method: 'GET',
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/auth/login';
        } else {
            alert('Failed to logout');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An unexpected error occurred.');
    });
}

// 주문 정보 가져오기
function fetchOrderInfo() {
    fetch('/api/orders')
    .then(response => response.json())
    .then(orders => {
        const tbody = document.querySelector('section[data-section="section3"] tbody');
        tbody.innerHTML = '';  // 기존 테이블 내용을 초기화

        // 서버에서 받아온 주문 데이터를 테이블에 삽입
        orders.forEach(order => {
            const row = `
                <tr>
                    <td>${order.order_id}</td>
                    <td>${order.user_name + "(" + order.username + ")"}</td>
                    <td>${order.service_name}</td>
                    <td>${order.amount}</td>
                    <td>${order.site_url}</td>
                    <td>${new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    })
    .catch(err => console.error('Error fetching orders:', err));
}


// 회원 정보 가져오기
function fetchUserInfo() {
    fetch('/api/users')
    .then(response => response.json())
    .then(users => {
        const tbody = document.querySelector('section[data-section="section4"] tbody');
        tbody.innerHTML = '';  // 기존 테이블 내용을 초기화

        // 서버에서 받아온 회원 데이터를 테이블에 삽입
        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.name}</td>
                    <td>${user.phone_number || 'N/A'}</td>
                    <td>${user.company || 'N/A'}</td>
                    <td>${user.ssn || '***-*******'}</td>
                    <td>${user.gender}</td>
                    <td>${user.address || 'N/A'}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    })
    .catch(err => console.error('Error fetching users:', err));
}


// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('section.content');
    
    // 모든 섹션을 숨기는 함수
    function hideAllSections() {
        sections.forEach(section => {
            section.style.display = 'none';
        });
    }

    // 섹션에 맞는 데이터를 불러오는 함수
    function loadSectionData(sectionId) {
        if (sectionId === 'section3') {
            fetchOrderInfo(); // 판매관리 정보 가져오기
        } else if (sectionId === 'section4') {
            fetchUserInfo(); // 회원관리 정보 가져오기
        }
    }

    // 메뉴 아이템 클릭 시 해당 섹션만 표시 및 데이터 로드
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // 링크 기본 동작 방지
            const sectionId = this.getAttribute('data-section');
            
            // 모든 섹션 숨기기
            hideAllSections();
            
            // 선택된 섹션만 표시
            const activeSection = document.querySelector(`section[data-section="${sectionId}"]`);
            if (activeSection) {
                activeSection.style.display = 'block';
            }

            // 섹션에 맞는 데이터 불러오기
            loadSectionData(sectionId);
        });
    });

    // 기본적으로 첫 번째 섹션만 표시
    hideAllSections();
    sections[0].style.display = 'block';
});
