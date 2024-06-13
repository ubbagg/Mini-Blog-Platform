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
    loadRecentBlogs();
});

document.getElementById('newBlogForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const result = await response.json();
        console.log('Blog posted:', result);
        // Close overlay and reload recent blogs
        document.getElementById('compose').style.display = 'none';
        loadRecentBlogs();
    } else {
        console.error('Failed to post blog:', response.statusText);
    }
});

async function loadRecentBlogs() {
    const response = await fetch('/api/posts');
    if (response.ok) {
        const blogs = await response.json();
        const blogBannerTemplate = document.getElementById('blogBannerTemplate');
        const recentBlogsDiv = document.querySelector('.recentBlogs');

        // Clear existing blogs
        recentBlogsDiv.innerHTML = '<h2>Recent Blogs</h2><input type="search" placeholder="search">';

        blogs.forEach(blog => {
            const blogBanner = blogBannerTemplate.cloneNode(true);
            blogBanner.style.display = 'block';
            blogBanner.querySelector('.profilepic').src = blog.author.profilepic;
            blogBanner.querySelector('.username').innerText = blog.author.username;
            blogBanner.querySelector('.description').innerText = blog.content.substring(0, 100) + '...';
            blogBanner.querySelector('.date').innerText = new Date(blog.createdAt).toLocaleDateString();
            blogBanner.querySelector('.heading').innerText = blog.heading;
            blogBanner.querySelector('.content').innerText = blog.content;
            blogBanner.querySelector('.tags').innerText = blog.tags.join(', ');

            recentBlogsDiv.appendChild(blogBanner);
        });
    } else {
        console.error('Failed to load blogs:', response.statusText);
    }
}