const router = require('express').Router();
const Ticket = require('../models/ticket.model');
const Comment = require('../models/comment.model');
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
                    { description: { $regex: regex } },
                    { number: { $regex: regex } }
                ]
            }).populate('closed').exec((err, tickets) => {
                if (tickets.length < 1) {
                    res.json([])
                } else {
                    for (let i = 0; i < tickets.length; i++) {
                        if (tickets[i].closeAt != null && Date.now() > tickets[i].closeAt) {
                            Ticket.findOneAndUpdate({ _id: tickets[i]._id }, { open: false }, (err, result) => {
                                if(err) {
                                    res.status(404).json({ msg: 'Ticket not found' })
                                } else {
                                    Comment.create({ text: 'State is <i>Closed</i> was <i>Open</i>', author: { name: 'System' } }, (err, comment) => {
                                        if(err) {
                                            res.status(500).json({ msg: 'Server error' })
                                        } else {
                                            comment.createdAt = result.closeAt;
                                            comment.save();
                                            //save comment
                                            result.comments.push(comment);
                                            result.updatedAt = result.closeAt
                                            result.closeAt = null;
                                            result.save();
                                        }
                                })
                            }
                        })
                    }
                }
                res.json(tickets);
            }
        }
            )} catch(e) {
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
    }
});

//create ticket
router.post('/create', auth, async (req, res) => {
    let retry = true;
    let number = 'INC' + Math.floor(Math.random() * 9999999)
    const data = {...req.body, number: number }
    while (retry) {
        const newTicket = new Ticket(data);
        try {
            await newTicket.save();
            res.json('ticket added');
            retry = false;
        } catch(e) {
            console.log(e);
        }
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
                updatedTicket.closeAt = Date.now()+300000;
            } else if((updatedTicket.status === 'Resolved' || updatedTicket.status === 'Cancelled') && (req.body.status != 'Resolved' || req.body.status != 'Cancelled')) {
                updatedTicket.closeAt = null;
            }
            updatedTicket.save();
            res.json('ticket updated');
        }
    });
});


//function converts text into regex that can be used to fuzzy
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

module.exports = router;