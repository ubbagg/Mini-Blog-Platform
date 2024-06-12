const express = require('express');
const router = express.Router();
const post = require('../models/post');

//nEW POST
router.post('/',async(req, res)=>{
    try{
        const post= new post(req.body);
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