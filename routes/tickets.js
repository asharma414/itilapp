const router = require('express').Router();
const Ticket = require('../models/ticket.model')
const auth = require('../middleware/auth');

//get ticket list
router.get('/', auth, async (req, res) => {
    try {
        let tickets = await Ticket.find();
        res.json(tickets);
    } catch(e) {
        console.log(e);
    }
});

//create ticket
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

//ticket show page
router.get('/:id', auth, (req, res) => {
    Ticket.findById(req.params.id).populate('comments').exec()
        .then(ticket => res.json(ticket))
        .catch(err => res.status(404).json({ success: false }));
});

//update ticket
router.put('/:id', auth, (req, res) => {
    Ticket.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { useFindAndModify: false }, (err, updatedTicket) =>{
        if(err){
            res.status(404).json({success: false})
        } else {
            res.json('ticket updated');
        }
    });
});

module.exports = router;