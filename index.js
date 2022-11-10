// Importing libraries and packages
const express = require('express');

const app = express();



// Routes

app.get('/', (req, res) => {
    res.render('index.ejs');
})






// For unknown routes

app.all('*', (req, res) => {
    res.send("PAGE NOT FOUND 404 :-(");
})


// PORT

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Listening at Port ${PORT}`)
})