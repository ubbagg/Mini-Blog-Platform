document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const result = await response.json();
        console.log('User signed up:', result);
    } else {
        console.error('Failed to sign up:', response.statusText);
    }
});