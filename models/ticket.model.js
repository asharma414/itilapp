const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {type: String, default: 'New' },
    open: { type: Boolean, default: true },
    author: {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String
    },
    comments: [
       {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
       }]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema)