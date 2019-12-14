const router = require('express').Router();
const Ticket = require('../models/ticket.model')
const auth = require('../middleware/auth');

//get ticket list

router.get('/', auth, async (req, res) => {
    //check if finding users tickets or searching by keyword
    if(req.query.name.length === 0) {
        const regex = new RegExp(escapeRegex(req.query.term), 'gi');
        try {
            let tickets = await Ticket.find({
                $or : [
                    { title: { $regex: regex } },
                    { description: { $regex: regex } }
                ]
            })
            if (tickets.length < 1) {
                res.json([])
            } else {
            res.json(tickets);
            }
        } catch(e) {
            console.log(e);
        }
    } else if (req.query.name.length > 0) {
        try {
            let tickets = await Ticket.find({
                "assignedTo.name": req.query.name
            })
            res.json(tickets)
        } catch(e) {
            console.log(e);
        }
    //if not finding specific tickets, find all
    } else {
        try {
            let tickets = await Ticket.find({})
            res.json(tickets);
        } catch(e) {
            console.log(e);
        }
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
    Ticket.findById(req.params.id).populate({ path: 'comments', options: { sort: { 'createdAt': -1 } } }).exec()
        .then(ticket => res.json(ticket))
        .catch(err => res.status(404).json({ success: false }));
});

//update ticket
router.put('/:id', auth, (req, res) => {
    Ticket.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { useFindAndModify: false }, (err, updatedTicket) =>{
        if(err){
            res.status(404).json({ success: false })
        } else {
            res.json('ticket updated');
        }
    });
});


//function converts text into regex that can be used to fuzzy
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

module.exports = router;