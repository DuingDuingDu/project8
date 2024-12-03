document.addEventListener('DOMContentLoaded', function () {
    // 로그아웃 버튼 처리 (signup.html에는 필요 없음)
    const logoutButton = document.getElementById('logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            fetch('/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/auth/login';
                } else {
                    alert('Logout failed!');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    // jQuery 코드가 필요하면 여기에 추가하세요
    $('.menu-item').on('click', function () {
        $('.menu-item').removeClass('active');
        $(this).addClass('active');
        var sectionToShow = $(this).data('section');
        $('section[data-section]').hide();
        $('section[data-section="' + sectionToShow + '"]').show();
    });

    // 주소 검색 API 사용
    const searchAddressButton = document.getElementById('search-address');
    if (searchAddressButton) {
        searchAddressButton.addEventListener('click', function () {
            new daum.Postcode({
                oncomplete: function(data) {
                    document.getElementById('sample4_postcode').value = data.zonecode;
                }
            }).open();
        });
    }
});

// id 중복검사
function checkUsernameAvailability() {
    const username = document.getElementById('username').value;

    fetch(`/api/check-username?username=${username}`)
        .then(response => response.json())
        .then(data => {
            console.log('Response from server:', data); // 서버로부터 받은 응답을 확인

            if (data.success) {
                alert('사용 가능한 아이디 입니다.');
            } else {
                alert('이미 사용중인 아이디 입니다.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

