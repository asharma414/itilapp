const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    customer: { name: { type: String, trim: true }, contact: { type: String, trim: true } },
    status: { type: String, default: 'New' },
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
          ref: 'Comment'
       }]
    },
    { timestamps: true }
);


//index for fast searching but not working with fuzzy search at the moment
ticketSchema.index({
    title: 'text',
    description: 'text'
});

module.exports = mongoose.model('Ticket', ticketSchema)