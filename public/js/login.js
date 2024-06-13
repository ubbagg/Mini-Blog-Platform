document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try{
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({email, password})
        });

        if (response.ok) {
            const result = await response.json();
            console.log('User logged in:', result);
            window.location.href = 'home.html';
        } else {
            console.error('Failed to log in', response.statusText);
        }
    }catch (error){
        console.error('Error:',error);
    }
});