const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    heading: String,
    tags: {
        type: [String],
        default: []
    },
    content: String,
    image: String,
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// Indexes
postSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
