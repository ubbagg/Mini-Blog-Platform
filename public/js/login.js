document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(`Submitting login for email: ${email}`);

        try{
            const response =await fetch('/api/users/login', {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({email, password})
            });
            console.log('Response recieved', response);
            if (response.ok) {
                const result = await response.json();
                console.log('User logged in:', result);
                window.location.href = 'home.html';
            } else {
                console.log('Response status not OK:', response.status);
                console.log('Attempting to read error text');
                const errorText = await response.text();
                console.error('Failed to log in:', response.status, errorText);
                alert('Failed to log in:' + errorText);
            }
        }catch (error){
            console.error('Error:',error);
            alert('An error occured');
        }
    });
});

//to get the user details run"node listUsers.js"