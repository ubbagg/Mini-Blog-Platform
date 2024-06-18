document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(`Submitting login for email: ${email}`);

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to log in: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('User logged in:', result);
            window.location.href = 'home.html';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while logging in');
        }
    });
});
