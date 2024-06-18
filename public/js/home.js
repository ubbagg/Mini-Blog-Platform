document.addEventListener('DOMContentLoaded', async function() {
    const signInButton = document.getElementById('SignInBtn');
    const signOutButton = document.getElementById('SignOutBtn');
    const userNameElement = document.querySelector('.user-name');
    const overlay = document.getElementById('compose');
    const composeBtn = document.querySelector('.ComposeBtn');
    const closeOverlayBtn = document.getElementById('closeOverlay');
    const newBlogForm = document.getElementById('newBlogForm');
    const searchInput = document.querySelector('.search');
    let editMode = false;
    let editPostId = null;

    try {
        const response = await fetch('/user');
        if (response.ok) {
            const data = await response.json();
            if(userNameElement){
                userNameElement.innerText = "Hi " + data.username;
            }
            if(signInButton){
                signInButton.style.display='none';
            }
            if(signOutButton){
                signOutButton.style.display='inline-block';
            }
        } else {
            if (userNameElement){
                userNameElement.style.display = 'none';
            }
            if (signInButton) {
                signInButton.style.display = 'inline-block';
            }
            if (signOutButton) {
                signOutButton.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error fetching user-name:', error);
    }

    if (signOutButton) {
        signOutButton.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/users/logout', { method: 'POST' });
                if (response.ok) {
                    window.location.href = 'login.html';
                } else {
                    const errorText = await response.text();
                    console.error('Failed to log out:', response.status, errorText);
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }
        });
    }

    composeBtn.addEventListener('click', function(){
        overlay.style.display= 'flex';
    });

    closeOverlayBtn.addEventListener('click', function(){
        overlay.style.display= 'none';
    });

    newBlogForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const url = editMode ? `/api/posts/${editPostId}` : '/api/posts';
        const method = editMode ? 'PUT' : 'POST';
        
        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Blog posted:', result);
                overlay.style.display = 'none';
                loadRecentBlogs();
            } else {
                const errorText = await response.text();
                console.error('Failed to post blog:', response.status, errorText);
            }
        } catch (err) {
            console.error('Error posting blog:', err);
        }
    });

    searchInput.addEventListener('input', function() {
        loadRecentBlogs(this.value);
    });

    loadRecentBlogs();

    async function loadRecentBlogs(searchQuery = '') {
        const response = await fetch('/api/posts');
        if (response.ok) {
            const blogs = await response.json();
            const blogBannerTemplate = document.getElementById('blogBannerTemplate');
            const recentBlogsDiv = document.querySelector('.recentBlogs');

            // Clear existing blogs
            recentBlogsDiv.innerHTML = '<div class="blog-search"><p>Recent Blogs</p><input type="search" class="search" placeholder="Search"></div>';

            // Filter blogs based on search query
            const filteredBlogs = blogs.filter(blog => {
                const lowerCaseQuery = searchQuery.toLowerCase();
                const matchesUsername = blog.author && blog.author.username && blog.author.username.toLowerCase().includes(lowerCaseQuery);
                const matchesHeading = blog.heading.toLowerCase().includes(lowerCaseQuery);
                const matchesTags = blog.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
                return matchesUsername || matchesHeading || matchesTags;
            });

            filteredBlogs.forEach(blog => {
                const blogBanner = blogBannerTemplate.cloneNode(true);
                blogBanner.style.display = 'block';
                if (blog.author) {
                    if (blog.author.profilepic) {
                        blogBanner.querySelector('.profilepic').src = blog.author.profilepic;
                    } else {
                        blogBanner.querySelector('.profilepic').src = 'default-profile-pic.jpg';
                    }
                    blogBanner.querySelector('.username').innerText = blog.author.username || 'Unknown Author';
                } else {
                    blogBanner.querySelector('.profilepic').src = 'default-profile-pic.jpg';
                    blogBanner.querySelector('.username').innerText = 'Unknown Author';
                }
                if (blog.image) {
                    blogBanner.querySelector('.blogpic').src = blog.image;
                } else {
                    blogBanner.querySelector('.blogpic').style.display = 'none';
                }
                
                blogBanner.querySelector('.description').innerText = blog.content.substring(0, 100) + '...';
                blogBanner.querySelector('.date').innerText = new Date(blog.createdAt).toLocaleDateString();
                blogBanner.querySelector('.heading').innerText = blog.heading;
                blogBanner.querySelector('.content').innerText = blog.content;
                blogBanner.querySelector('.tags').innerText = blog.tags.join(', ');

                const editButton = blogBanner.querySelector('.editBtn');
                editButton.addEventListener('click', () => {
                    editMode = true;
                    editPostId = blog._id;
                    overlay.style.display = 'flex';
                    document.getElementById('heading').value = blog.heading;
                    document.getElementById('tags').value = blog.tags.join(', ');
                    document.getElementById('content').value = blog.content;
                });

                const deleteButton = blogBanner.querySelector('.deleteBtn');
                deleteButton.addEventListener('click', async () => {
                    const response = await fetch(`/api/posts/${blog._id}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        loadRecentBlogs();
                    } else {
                        console.error('Failed to delete blog:', response.statusText);
                    }
                });
                recentBlogsDiv.appendChild(blogBanner);
            });
        } else {
            console.error('Failed to load blogs:', response.statusText);
        }
    }
});