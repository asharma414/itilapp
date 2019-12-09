const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const db = require('../keys').mongoURI;
const port = process.env.port || 5000;
const passport = require('passport');
const userRoutes = require('./routes/users');
const ticketRoutes = require('./routes/tickets');
const commentRoutes = require('./routes/comments');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRoutes);
app.use('/tickets/:id/comments', commentRoutes);
app.use('/tickets', ticketRoutes);

// Passport middleware
app.use(passport.initialize());
// Passport config
require('./passport')(passport);

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})