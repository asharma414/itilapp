const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now},
    activationHash: {type: String},
    active: {type: Boolean, default: false, required: true}
});

module.exports = mongoose.model('User', userSchema)