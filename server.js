const express = require('express');
const mongoose = require('mongoose');
const config = require('dotenv').config()
const cors = require('cors');
const app = express();
let db;
if (process.env.NODE_ENV === 'production') {
    db = process.env.prodMongURI;
} else {
    db = process.env.devMongoURI;
}

const port = process.env.PORT || 5000;
const passport = require('passport');
const userRoutes = require('./routes/users');
const ticketRoutes = require('./routes/tickets');
const commentRoutes = require('./routes/comments');
const path = require('path');
const User = require('./models/user.model');

app.use(cors());

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(err));
// Passport middleware
app.use(passport.initialize());
// Passport config
require('./passport')(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/api/verify', async (req, res) => {
    await User.findOneAndUpdate({ _id: req.query.id }, { active: true }, (err, result) => {
        if(!result) {
            return res.status(404).json({ userNotFound: 'User not found' });
        }
    });
}) 

app.use('/api/users', userRoutes);
app.use('/api/tickets/:id/comments', commentRoutes);
app.use('/api/tickets', ticketRoutes);

if(process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})