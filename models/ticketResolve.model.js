const mongoose = require('mongoose');


const resolveSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    close_ref: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'}
});

resolveSchema.index({ createdAt: 1}, { expireAfterSeconds: 259200 })

module.exports = mongoose.model('TicketResolve', resolveSchema)