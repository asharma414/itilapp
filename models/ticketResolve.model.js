const mongoose = require('mongoose');


const resolveSchema = new mongoose.Schema({
    close_ref: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'},
    createdAt: { type: Date, expires: '5m', default: Date.now }
});


module.exports = mongoose.model('TicketResolve', resolveSchema)