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
                const profilepicElem = document.querySelector('.profilepic');
                const usernameElem = document.querySelector('.username');
                const descriptionElem = document.querySelector('.description');
                const dateElem = document.querySelector('.date');
                const headingElem = document.querySelector('.heading');
                const contentElem = document.querySelector('.content');
                const tagsElem = document.querySelector('.tags');

                if (profilepicElem) profilepicElem.src = blog.image || 'default-profile-pic.jpg';
                if (usernameElem) usernameElem.innerText = blog.author.username || 'Unknown Author';
                if (descriptionElem) descriptionElem.innerText = blog.content ? blog.content.substring(0, 100) + '...' : '';
                if (dateElem) dateElem.innerText = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '';
                if (headingElem) headingElem.innerText = blog.heading || '';
                if (contentElem) contentElem.innerText = blog.content || '';
                if (tagsElem) tagsElem.innerText = blog.tags ? blog.tags.join(', ') : '';
            } else {
                console.error('Failed to load blog:', response.statusText);
            }
        } catch (error) {
            console.error('Error loading blog:', error);
        }
    }

    loadBlog();
});
