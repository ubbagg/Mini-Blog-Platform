const { profile } = require('console');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: String,
    usrname: String,
    email: String,
    mobileno: String,
    dateofbirth: Date,
    password: String,
    profilepic: String
});

module.exports = mongoose.model('User',userSchema);