const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    author: {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
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