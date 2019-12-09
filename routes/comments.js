const router = require('express').Router({mergeParams: true});
const Ticket = require('../models/ticket.model');
const Comment = require('../models/comment.model');
const auth = require('../middleware/auth');

router.post('/', auth, (req,res) => {
    Ticket.findById(req.params.id, (err, ticket) => {
        if(err) {
            console.log(err);
        } else {
            Comment.create(req.body, (err, comment) => {
                if(err) {
                    console.log(err);
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

