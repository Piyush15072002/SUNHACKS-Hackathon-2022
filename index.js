if (process.env.NODE_ENV !== 'production') {  // if we are not in production mode means we are in development mode then
    require('dotenv').config();
}

// Importing libraries and packages
const express = require('express');

const app = express();

const path = require('path');

const ejsMate = require('ejs-mate'); // lets us create partials, boilerplate etc and add css in ejs files

const mongoose = require('mongoose');

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));



// Routes

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/aboutus', (req, res) => {
    res.render('aboutus.ejs');
});






// For unknown routes

app.all('*', (req, res) => {
    res.send("PAGE NOT FOUND 404 :-(");
})


// PORT

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Listening at Port ${PORT}`)
})