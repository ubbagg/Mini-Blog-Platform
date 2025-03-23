require('dotenv').config();
console.log('PORT:', process.env.PORT); // Debugging: Check if env variables load
console.log('MONGO_URI:', process.env.MONGO_URI); // Debugging

const express = require('express');
const path = require('path');
const initial_path = path.join(__dirname, 'public');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Check for missing env variables
// if (!process.env.MONGO_URI || !process.env.SESSION_SECRET) {
//     console.error("⚠️ Missing required environment variables!");
//     process.exit(1);
// }

//Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-production-domain.vercel.app'] 
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-for-dev',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax'
    },
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI,
        ttl: 60 * 60 * 24 * 7 // 1 week
    })
}));

//MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected, Reconnecting...');
    mongoose.connect(process.env.MONGO_URI);
});

//Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

//Homepage Serve
app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, 'home.html'));
});

app.get('/user', (req, res) => {
    if (req.session.userID) {
        res.send({ username: req.session.username });
    } else {
        res.status(401).send({ error: 'Unauthorized' });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).send({ error: "Route not found" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});