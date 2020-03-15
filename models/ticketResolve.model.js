const mongoose = require('mongoose');


const resolveSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now, expires: 259200 },
    close_ref: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'}
});

module.exports = mongoose.model('TicketResolve', resolveSchema)