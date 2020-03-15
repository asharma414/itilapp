const router = require('express').Router();
const Ticket = require('../models/ticket.model');
const Comment = require('../models/comment.model');
const TicketResolve = require('../models/ticketResolve.model');
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
            }).populate('closed').exec((err, tickets) => {
                if (tickets.length < 1) {
                    res.json([])
                } else {
                    for (let i = 0; i < tickets.length; i++) {
                        if (tickets[i].status === 'Resolved' && tickets[i].closed === null && tickets[i].open === true) {
                            Ticket.findOneAndUpdate({ _id: tickets[i]._id }, { open: false }, (err, result) => {
                            })
                            Ticket.findById(tickets[i]._id, (err, ticket) => {
                                if(err) {
                                    res.status(404).json({ msg: 'Ticket not found'})
                                } else {
                                    Comment.create({ text: 'State is <i>Closed</i> was <i>Open</i>', author: { name: 'System' } }, (err, comment) => {
                                        if(err) {
                                            res.status(500).json({ msg: 'Server error' })
                                        } else {
                                            comment.save();
                                            //save comment
                                            ticket.comments.push(comment);
                                            ticket.save();
                                        }
                                    });
                                }
                            });
                        }
                    }
                    res.json(tickets);
                }
            })
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
            if(req.body.status === 'Resolved' || req.body.status === 'Cancelled') {
                let newResolve = new TicketResolve({
                    close_ref: updatedTicket._id
                });
                newResolve.save((err, result) => {
                })
                Ticket.findOneAndUpdate({ _id: updatedTicket._id }, { closed: newResolve._id }, (err, updatedTicket) => {
                    if(err){
                        console.log(err);
                    }
                })
            }
            res.json('ticket updated');
        }
    });
});


//function converts text into regex that can be used to fuzzy
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

module.exports = router;