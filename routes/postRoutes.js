const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const upload = require('../config/multer');

// New post
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.session.userID) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        if (!req.body.heading || !req.body.tags || !req.body.content || !req.file) {
            return res.status(400).send({ error: 'All fields required' });
        }

        const newPost = new Post({
            author: req.session.userID,
            heading: req.body.heading,
            tags: req.body.tags.split(','),
            content: req.body.content,
            image: req.file.filename
        });

        await newPost.save();
        res.status(201).send(newPost);
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(400).send({ error: err.message });
    }
});


// All posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).send({ error: err.message });
    }
});

// Single post by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate('author', 'username');
        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }
        res.send(post);
    } catch (err) {
        console.error('Error fetching post:', err);
        res.status(500).send({ error: err.message });
    }
});

// Edit post
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        if (!req.session.userID) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }

        // Check if the post author is the same as the logged-in user
        if (post.author.toString() !== req.session.userID) {
            return res.status(403).send({ error: 'Forbidden' });
        }

        const { heading, tags, content } = req.body;
        if (heading) post.heading = heading;
        if (tags) post.tags = tags.split(',');
        if (content) post.content = content;
        if (req.file) post.image = req.file.filename;

        await post.save();
        res.send(post);
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(400).send({ error: err.message });
    }
});



// Delete post
router.delete('/:id', async (req, res) => {
    try {
        if (!req.session.userID) {
            console.log('No user ID in session');
            return res.status(401).send({ error: 'Unauthorized' });
        }

        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            console.log('Post not found');
            return res.status(404).send({ error: 'Post not found' });
        }

        if (!post.author || post.author.toString() !== req.session.userID) {
            console.log(`Post author: ${post.author}, User ID: ${req.session.userID}`);
            return res.status(403).send({ error: 'Forbidden' });
        }

        await Post.findByIdAndDelete(id);
        res.send({ message: 'Post deleted' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(400).send({ error: err.message });
    }
});

// delete when user is not defined
// router.delete('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const post = await Post.findById(id);

//         if (!post) {
//             console.log('Post not found');
//             return res.status(404).send({ error: 'Post not found' });
//         }

//         await Post.findByIdAndDelete(id);
//         res.send({ message: 'Post deleted' });
//     } catch (err) {
//         console.error('Error deleting post:', err);
//         res.status(400).send({ error: err.message });
//     }
// });

module.exports = router;
