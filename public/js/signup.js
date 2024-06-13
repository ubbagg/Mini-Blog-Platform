// const { error } = require("console");

document.addEventListener('DOMContentLoaded',function(){
    document.getElementById('signupForm').addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const formData = new FormData(this);
    
        try{
            const response = await fetch('/api/users/signup', {
            method: 'POST',
            body: formData
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log('User signed up:', result);
                window.location.href = 'login.html';
            } else {
                const errorText = await response.text();
                console.error('Failed to sign up:', response.statusText, errorText);
            }
        } catch (error){
            console.error('Error:',error);
        }
    });
});
