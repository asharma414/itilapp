const mongoose = require('mongoose');


const resolveSchema = new mongoose.Schema({
    close_ref: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'},
    expireAt: { type: Date, expires: 259200, default: Date.now }
});


module.exports = mongoose.model('TicketResolve', resolveSchema)