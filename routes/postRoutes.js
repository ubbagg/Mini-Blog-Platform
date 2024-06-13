const express = require('express');
const router = express.Router();
const post = require('../models/post');
const multer = require('multer');
const upload = require('../config/multer');

//nEW POST
router.post('/',upload.single('image'), async(req, res)=>{
    try{
        const post= new post({
            author: req.body.author,
            heading: req.body.heading,
            tags: req.body.tags.split(','),
            content: req.body.content,
            image: req.file.path
        });
        await post.save();
        req.statusCode(201).send(post);
    } catch (err){
        req.statusCode(400).send(err);
    }
});

//all posts
router.get('/', async(req, res)=>{
    try{
        const posts = await post.find().populate('author');
        res.send(posts);
    }catch (err){
        res.status(500).send(err);
    }
});

module.exports = router;