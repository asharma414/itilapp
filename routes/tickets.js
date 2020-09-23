const router = require('express').Router();
const Ticket = require('../models/ticket.model');
const Comment = require('../models/comment.model');
const auth = require('../middleware/auth');
const mongoose = require('mongoose')


//get ticket list

router.get('/', auth, async (req, res) => {
    // close out resolved/cancelled tickets after 3 days of inactivity
    await Ticket.find({status: {$in: ['Resolved', 'Cancelled']}, closeAt: {$lte: new Date()}})
        .then(async (tickets) => {
            for (let i = 0; i < tickets.length; i++) {
                await Comment.create({ text: 'State is <i>Closed</i> was <i>Open</i>', author: { name: 'System' }})
                .then(comment => {
                    comment.createdAt = tickets[i].closeAt;
                    comment.save();
                    tickets[i].comments.push(comment);
                    tickets[i].open = false;
                    tickets[i].updatedAt = tickets[i].closeAt
                    tickets[i].closeAt = null;
                    tickets[i].save();
                })
                .catch(err => console.log('Ticket closing error'))
                }
        })
        .catch(err => console.log('Ticket finding error'))
    //check if finding users tickets or searching by keyword
    if (req.query.name.length === 0) {
        const regex = new RegExp(escapeRegex(req.query.term), 'gi');
        try {
            await Ticket.find({
                $or: [
                    { title: { $regex: regex } },
                    { description: { $regex: regex } },
                    { 'author.name': { $regex: regex } },
                    { number: { $regex: regex } }
                ]
            }, null, {sort: '-createdAt'}, (err, tickets) => {
                if (tickets.length < 1) {
                    res.json([])
                } else {
                    res.json(tickets);
                }
            })
        } catch (e) {
            console.log(e);
        }
    } else if (req.query.name.length > 0) {
        try {
            let tickets = await Ticket.find({
                "assignedTo.name": req.query.name
            }).sort('-createdAt')
            res.json(tickets)
        } catch (e) {
            console.log(e);
        }
    }
});

//create ticket
router.post('/create', auth, async (req, res) => {
    let retry = true;
    while (retry) {
        let number = 'INC' + Math.floor(Math.random() * 10000000)
        const data = { ...req.body, number: number }
        const newTicket = new Ticket(data);
        try {
            await newTicket.save();
            res.json(newTicket);
            retry = false;
        } catch (e) {
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
    Ticket.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { useFindAndModify: false }, (err, updatedTicket) => {
        if (err) {
            res.status(404).json({ success: false })
        } else {
            if (req.body.status === 'Resolved' || req.body.status === 'Cancelled') {
                updatedTicket.closeAt = Date.now() + 259200000;
            } else if ((updatedTicket.status === 'Resolved' || updatedTicket.status === 'Cancelled') && (req.body.status != 'Resolved' || req.body.status != 'Cancelled')) {
                updatedTicket.closeAt = null;
            }
            updatedTicket.save();
            res.json('ticket updated');
        }
    });
});


//function converts text into regex that can be used to fuzzy search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

module.exports = router;