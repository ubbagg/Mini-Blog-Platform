const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

let initial_path = path.join(__dirname, "public");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(express.static(initial_path));


//dATABASE CONNECT
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open',() => {
    console.log('connected to MongoDB')
});

//Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

//Homepage Serve
app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, 'home.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});