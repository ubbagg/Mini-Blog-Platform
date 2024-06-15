document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    async function loadBlog() {
        if (!postId) {
            console.error('No post ID provided');
            return;
        }

        try {
            const response = await fetch(`/api/posts/${postId}`);
            if (response.ok) {
                const blog = await response.json();
                document.querySelector('.profilepic').src = blog.image;
                document.querySelector('.username').innerText = blog.author.username;
                document.querySelector('.description').innerText = blog.content.substring(0, 100) + '...';
                document.querySelector('.date').innerText = new Date(blog.createdAt).toLocaleDateString();
                document.querySelector('.heading').innerText = blog.heading;
                document.querySelector('.content').innerText = blog.content;
                document.querySelector('.tags').innerText = blog.tags.join(', ');
            } else {
                console.error('Failed to load blog:', response.statusText);
            }
        } catch (error) {
            console.error('Error loading blog:', error);
        }
    }

    loadBlog();
});