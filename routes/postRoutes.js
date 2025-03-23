const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const upload = require('../config/multer');
const authMiddleware = require('../middleware/auth');

// New post
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { title, heading, tags, content } = req.body;
        if (!title || !heading || !tags || !content || !req.file) {
            return res.status(400).send({ error: 'All fields are required' });
        }

        const newPost = new Post({
            author: req.session.userID,
            title,
            heading,
            tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
            content,
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
        const post = await Post.findById(req.params.id).populate('author', 'username');
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
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }

        if (post.author.toString() !== req.session.userID) {
            return res.status(403).send({ error: 'Forbidden' });
        }

        const { title, heading, tags, content } = req.body;
        if (title) post.title = title;
        if (heading) post.heading = heading;
        if (tags) post.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
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
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }

        if (post.author.toString() !== req.session.userID) {
            return res.status(403).send({ error: 'Forbidden' });
        }

        await Post.findByIdAndDelete(id);
        res.send({ message: 'Post deleted' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(400).send({ error: err.message });
    }
});

module.exports = router;