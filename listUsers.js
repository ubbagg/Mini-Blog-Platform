require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user'); // Adjust the path if necessary

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');

    try {
        const users = await User.find();
        console.log(users);
    } catch (err) {
        console.error('Error fetching users:', err);
    } finally {
        mongoose.connection.close();
    }
});
