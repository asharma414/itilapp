const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const db = require('../keys').mongoURI;
const port = process.env.port || 5000;
const userRoutes = require('./routes/users');
const ticketRoutes = require('./routes/tickets');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded());
app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})