const mongoose = require('mongoose');
// const { type } = require('os');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    heading: String,
    tags: {
        type: [String],
        default: []
    },
    content: {
        type: String,
        required: true
    },
    image: String
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);