const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: { type: String, trim: true }
    }
});

module.exports = mongoose.model('Comment', commentSchema);