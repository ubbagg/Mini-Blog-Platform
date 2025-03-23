const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// User Signup Route
router.post('/signup', upload.single('profilepic'), async (req, res) => {
    try {
        const { fullname, username, email, mobileno, dateofbirth, password } = req.body;
        if (!fullname || !username || !email || !mobileno || !dateofbirth || !password) {
            return res.status(400).send({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ error: 'Username is already taken' });
        }

        // Enhance password validation
        if (password.length < 8) {
            return res.status(400).send({ error: 'Password must be at least 8 characters long' });
        }

        // Add email validation 
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.status(400).send({ error: 'Please provide a valid email address' });
        }

        // Add phone validation
        if (!/^\d{10}$/.test(mobileno)) {
            return res.status(400).send({ error: 'Please provide a valid 10-digit mobile number' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            fullname,
            username,
            email,
            mobileno,
            dateofbirth,
            password: hashedPassword,
            profilepic: req.file ? req.file.filename : null
        });

        await user.save();
        res.status(201).send({ message: 'User created successfully', user });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

//LoginUser
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(401).send({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            req.session.userID = user._id;
            req.session.username = user.username;
            console.log('Login successful');
            res.send({ message: 'Login successful', username: user.username });
        } else {
            res.status(401).send({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send({ error: err.message });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.send({ message: 'Logout successful' });
    });
});

module.exports = router;