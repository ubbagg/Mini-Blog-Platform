document.addEventListener('DOMContentLoaded', async function() {
    const signInButton = document.getElementById('SignInBtn');
    const signOutButton = document.getElementById('SignOutBtn');
    const userNameElement = document.querySelector('.user-name');
    const overlay = document.getElementById('compose');
    const composeBtn = document.querySelector('.ComposeBtn');
    const composeBtn2 = document.querySelector('.PostBtn');
    const composeBtn3 = document.querySelector('.PostBtn2');
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
    composeBtn2.addEventListener('click', function(){
        overlay.style.display= 'flex';
    });
    composeBtn3.addEventListener('click', function(){
        overlay.style.display= 'flex';
    });
    closeOverlayBtn.addEventListener('click', function(){
        overlay.style.display= 'none';
        // Reset form when closing
        document.getElementById('newBlogForm').reset();
        editMode = false;
        editPostId = null;
        document.querySelector('.composeContainer1 h2').textContent = 'New Blog';
        document.getElementById('image').required = true;
    });
    

    newBlogForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';
    
        const formData = new FormData(this);
        // Rest of your existing code...
        
        try {
            // Existing fetch code...
        } catch (err) {
            // Existing error handling...
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Post Blog';
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
                if (!searchQuery) return true;
                
                const lowerCaseQuery = searchQuery.toLowerCase();
                const matchesUsername = blog.author && blog.author.username && 
                    blog.author.username.toLowerCase().includes(lowerCaseQuery);
                const matchesHeading = blog.heading && 
                    blog.heading.toLowerCase().includes(lowerCaseQuery);
                const matchesTags = blog.tags && Array.isArray(blog.tags) &&
                    blog.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
                const matchesContent = blog.content && 
                    blog.content.toLowerCase().includes(lowerCaseQuery);
                    
                return matchesUsername || matchesHeading || matchesTags || matchesContent;
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
                if (editButton) {
                    editButton.addEventListener('click', () => {
                        editMode = true;
                        editPostId = blog._id;
                        overlay.style.display = 'flex';
                        document.getElementById('heading').value = blog.heading || '';
                        document.getElementById('tags').value = blog.tags ? blog.tags.join(', ') : '';
                        document.getElementById('content').value = blog.content || '';
                        // Update form title to indicate edit mode
                        document.querySelector('.composeContainer1 h2').textContent = 'Edit Blog';
                        // No need to re-upload image if not changing
                        document.getElementById('image').required = false;
                    });
                }

                const deleteButton = blogBanner.querySelector('.deleteBtn');
                deleteButton.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
                        try {
                            const response = await fetch(`/api/posts/${blog._id}`, {
                                method: 'DELETE',
                            });
                            if (response.ok) {
                                loadRecentBlogs();
                            } else {
                                const errorData = await response.json();
                                alert('Failed to delete blog: ' + (errorData.error || response.statusText));
                            }
                        } catch (error) {
                            console.error('Error deleting blog:', error);
                            alert('An error occurred while deleting the blog post.');
                        }
                    }
                });

                    // Add click event listener to the heading to redirect to blog details page
                const headingElement = blogBanner.querySelector('.heading');
                headingElement.addEventListener('click', (event) => {
                    event.preventDefault();
                    window.location.href = `blog.html?id=${blog._id}`;
                });

                // // Add click event listener to redirect to blog details page
                // blogBanner.addEventListener('click', () => {
                //     window.location.href = `blog.html?id=${blog._id}`;
                // });

                recentBlogsDiv.appendChild(blogBanner);
            });
        } else {
            console.error('Failed to load blogs:', response.statusText);
        }
    }
});
