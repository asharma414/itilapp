const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const db = process.env.mongoURI;
const port = process.env.port || 5000;
const passport = require('passport');
const userRoutes = require('./routes/users');
const ticketRoutes = require('./routes/tickets');
const commentRoutes = require('./routes/comments');
const path = require('path');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/tickets/:id/comments', commentRoutes);
app.use('/api/tickets', ticketRoutes);

// Passport middleware
app.use(passport.initialize());
// Passport config
require('./passport')(passport);

if(process.env.NODE_DEV === 'production' || process.env.NODE_DEV === 'staging') {
    // set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})