const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const upload = multer({dest:'../config/multer'});
const bcrypt = require('bcrypt');
const { error } = require('console');

//CreateUser
router.post('/signup', upload.single('profilepic'), async (req, res) => {
    try{
        const { fullname, username, email, mobileno, dateofbirth, password } = req.body;

        if (!fullname || !username || !email || !mobileno || !dateofbirth || !password) {
            return res.status(400).send({ error: 'All fields are required' });
        }

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
        res.status(400).send({error: err.message});    
    }
});

//LoginUser

router.post('/login', async (req,res) =>{
    try{
        const user = await User.findOne({email: req.body.email});
        if (!user || !(await bcrypt.compare(req.body.password, user.password))){
            return res.status(401), send('Invalid Credentials');
        }
        res.send(user);
    } catch (err){
        res.status(500).send(err);
    }
});

module.exports = router;