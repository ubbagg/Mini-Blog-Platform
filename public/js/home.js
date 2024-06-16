document.addEventListener('DOMContentLoaded', async function() {
    const signInButton = document.getElementById('SignInBtn');
    const signOutButton = document.getElementById('SignOutBtn');
    const userNameElement = document.querySelector('.user-name');

    try {
        const response = await fetch('/user');
        if (response.ok) {
            const data = await response.json();
            if(userNameElement){
                userNameElement.innerText = data.username;
            }
            if(signInButton){
                signInButton.style.display='none';
            }
            if(signOutButton){
                signOutButton.style.display='inline-block';
            }
            // signInButton.style.display = 'none';
            // signOutButton.style.display='inline-block';
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
        console.error('Error fetching user data:', error);
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

    const composeBtn = document.querySelector('.ComposeBtn');
    const overlay = document.getElementById('compose');
    const closeOverlayBtn = document.getElementById('closeOverlay');
    const newBlogForm = document.getElementById('newBlogForm');
    let editMode = false;
    let editPostId = null;

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

        // console.log("Form data entries:");
        // for(const[key,value]of formData.entries()){
        //     console.log(key, value)
        // }
        
        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Blog posted:', result);
                // Close overlay and reload recent blogs
                overlay.style.display = 'none';
                // window.location.href = 'blog.html'
                loadRecentBlogs(); // Assuming this function loads recent blogs dynamically
            } else {
                const errorText = await response.text();
                console.error('Failed to post blog:', response.status, errorText);
            }
        } catch (err) {
            console.error('Error posting blog:', err);
        }
    });

    loadRecentBlogs();
});

// document.getElementById('newBlogForm').addEventListener('submit', async function(event) {
//     event.preventDefault();

//     const formData = new FormData(this);


//     console.log("form data entries:");
//     for(const [key, value] of formData.entries()){
//         console.log(key, value);
//     }

//     const response = await fetch('/api/posts', {
//         method: 'POST',
//         body: formData,
//         credentials: 'include'
//     });

//     if (response.ok) {
//         const result = await response.json();
//         console.log('Blog posted:', result);
//         window.location.href='blog.html';
//     } else {
//         console.error('Failed to post blog:', response.statusText);
//     }
// });

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
            if (blog.author) {
                if (blog.author.profilepic) {
                    blogBanner.querySelector('.profilepic').src = blog.author.profilepic;
                } else {
                    blogBanner.querySelector('.profilepic').src = 'default-profile-pic.jpg'; // Fallback image
                }
                blogBanner.querySelector('.username').innerText = blog.author.username || 'Unknown Author';
            } else {
                blogBanner.querySelector('.profilepic').src = 'default-profile-pic.jpg'; // Fallback image
                blogBanner.querySelector('.username').innerText = 'Unknown Author';
            }
            
            blogBanner.querySelector('.description').innerText = blog.content.substring(0, 100) + '...';
            blogBanner.querySelector('.date').innerText = new Date(blog.createdAt).toLocaleDateString();
            blogBanner.querySelector('.heading').innerText = blog.heading;
            blogBanner.querySelector('.content').innerText = blog.content;
            blogBanner.querySelector('.tags').innerText = blog.tags.join(', ');

            const editButton = document.createElement('button');
                editButton.innerText = 'Edit';
                editButton.addEventListener('click', () => {
                    editMode = true;
                    editPostId = blog._id;
                    overlay.style.display = 'flex';
                    document.getElementById('heading').value = blog.heading;
                    document.getElementById('tags').value = blog.tags.join(', ');
                    document.getElementById('content').value = blog.content;
                });

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
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

                blogBanner.appendChild(editButton);
                blogBanner.appendChild(deleteButton);
                recentBlogsDiv.appendChild(blogBanner);
        });
    } else {
        console.error('Failed to load blogs:', response.statusText);
    }
};