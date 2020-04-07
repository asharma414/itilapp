const router = require('express').Router({mergeParams: true});
const Ticket = require('../models/ticket.model');
const Comment = require('../models/comment.model');
const auth = require('../middleware/auth');

router.post('/', auth, (req,res) => {
    Ticket.findById(req.params.id, (err, ticket) => {
        if(err) {
            res.status(404).json({ msg: 'Ticket not found' })
        } else {
            Comment.create(req.body, (err, comment) => {
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
});


module.exports = router;

