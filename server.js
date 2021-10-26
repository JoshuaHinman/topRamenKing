require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const ejs = require('ejs')
const expressSession = require('express-session')
const reviewsRouter = require('./routes/reviewsRouter');
const usersRouter = require('./routes/usersRouter');

let dbUrl = process.env.DATABASE_URL || "mongodb://localhost/topRamenKing"
mongoose.connect(dbUrl, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.on('open', () => console.log('Connected to ' + process.env.DATABASE_URL));

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({secret: "top ramen king",
                        resave: true,
                        saveUninitialized: true}))
app.use('/reviews', reviewsRouter);
app.use('/users', usersRouter);
app.use(express.static('public'));



app.get('/', (req, res) => {
    res.redirect('/reviews')
})

let port = process.env.PORT
if (port == null || port == "") {
    port = 4000
}
app.listen(port, () => console.log('Listening on ' + port));