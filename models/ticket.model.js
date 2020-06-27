const mongoose = require('mongoose');
const mongooseCounter = require('mongoose-counters').default

const autoIncrement = mongooseCounter(mongoose)
const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    customer: { name: { type: String, trim: true }, contact: { type: String, trim: true } },
    status: { type: String, default: 'New' },
    open: { type: Boolean, default: true },
    closeAt: { type: Date, default: null },
    author: {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String
    },
    assignedTo: {
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
ticketSchema.plugin(autoIncrement, { incField: 'id'})

module.exports = mongoose.model('Ticket', ticketSchema)