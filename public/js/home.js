document.addEventListener('DOMContentLoaded', function() {
    const composeBtn = document.querySelector('.ComposeBtn');
    const overlay = document.getElementById('compose');
    const closeOverlayBtn = document.getElementById('closeOverlay');

    composeBtn.addEventListener('click', function(){
        overlay.style.display= 'flex';
    });

    closeOverlayBtn.addEventListener('click', function(){
        overlay.style.display= 'none';
    });
});

document.getElementById('signUp').addEventListener('click', async function () {
    const user = {
        fullname: document.getElementById('fullname').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        mobileno: document.getElementById('mobileno').value,
        dateofbirth: document.getElementById('dateofbirth').value,
        password: document.getElementById('password').value,
        profilepic: document.getElementById('profilepic').value // Handle file upload separately
    };

    const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    if (response.ok) {
        const result = await response.json();
        console.log('User signed up:', result);
    } else {
        console.error('Failed to sign up:', response.statusText);
    }
});