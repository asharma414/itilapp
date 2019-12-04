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
    const newTicket = new Ticket(data);

    try {
        await newTicket.save();
        res.json('ticket added');
    } catch(e) {
        console.log(e);
    }
});

router.post('/close/:id', auth, async (req, res) => {
    Ticket.findById(req.params.id)
        .then(ticket => ticket.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;