const express = require('express');

const router = express.Router();

const User = require('../model/User');
const Guide = require('../model/Guide');

const isVerified = require('../middlewares/isVerified');
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/', (req, res) => {
    res.render('sites.ejs');
});





module.exports = router;

