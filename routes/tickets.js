const router = require('express').Router();
const Ticket = require('../models/ticket.model')
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        let tickets = await Ticket.find();
        res.json(tickets);
    } catch(e) {
        console.log(e);
    }
});

router.post('/create', auth, async (req, res) => {
    const data = req.body;
    console.log(req.body);
    const newTicket = new Ticket(data);

    try {
        await newTicket.save();
        res.json('ticket added');
    } catch(e) {
        console.log(e);
    }
});

module.exports = router;