require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo')


let initial_path = path.join(__dirname, "public");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(initial_path));


app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}))
console.log('MongoDB URI:', process.env.MONGO_URI);


//dATABASE CONNECT
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

//Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open',() => {
//     console.log('connected to MongoDB')
// });


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
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});