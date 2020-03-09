const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const db = process.env.mongoURI;
const port = process.env.PORT || 5000;
const passport = require('passport');
const userRoutes = require('./routes/users');
const ticketRoutes = require('./routes/tickets');
const commentRoutes = require('./routes/comments');
const path = require('path');

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
app.use('/api/users', userRoutes);
app.use('/api/tickets/:id/comments', commentRoutes);
app.use('/api/tickets', ticketRoutes);


if(process.env.NODE_DEV === 'production') {
    // set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})