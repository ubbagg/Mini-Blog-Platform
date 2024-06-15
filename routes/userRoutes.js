const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
// const upload = multer({dest:'../config/multer'});
const upload = multer({dest:'uploads/'});
const bcrypt = require('bcrypt');
// const { error } = require('console');
// const session = require('express-session');
// router.use(session({
//     secret: 'yoursecretKey',
//     resave: false,
//     saveUninitialized: true
// }))

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
    const{ email, password}= req.body;
    // console.log('Login attempt for email: ${email}');
    console.log(`Login attempt for email: ${email}`);
    try{
        const user = await User.findOne({email});
        if(!user){
            console.log('User not found');
            return res.status(401).send({error:'Invalid email or password'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            req.session.userID = user._id;
            req.session.username = user.username; // Store username in session
            console.log('Login successful');
            res.send({ message: 'Login successful', username: user.username });
        } else {
            res.status(401).send({ error: 'Invalid email or password' });
        }
    } catch (err){
        console.error('Login error:', err.message);
        res.status(500).send({error: err.message});
    }
});



router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.send({ message: 'Logout successful' });
    });
});

module.exports = router;