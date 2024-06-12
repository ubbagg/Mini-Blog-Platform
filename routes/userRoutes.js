const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const upload = require('../config/multer');
const bcrypt = require('bcrypt');

//CreateUser
router.post('/signup', upload.single('profilepic'), async (req, res) => {
    try{
        const { fullname, username, email, mobileno, dateofbirth, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullname,
            username,
            email,
            mobileno,
            dateofbirth,
            password: hashedPassword,
            profilepic: req.file.path
        });
        await user.save();
        res.status(201).send(user);
    } catch (err){
        res.status(400).send(err);    
    }
});

//LoginUser

router.post('/login', async (req,res) =>{
    try{
        const { email,password}= req.body;
        const user = await User.findOne({email});
        if (!user){
            return res.status(401), sned('Invalid Credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(401).send('Invalid Credentials');
        }
        res.send(user);
    } catch (err){
        res.status(500).send(err);
    }
});

module.exports = router;