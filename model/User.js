const express = require('express')

const User = require('../models/user.js');

const router = express.Router()

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');

const cookie = require('cookie-parser');

// const isVerified = require('../middlewares/isVerified.js');


// function to create a JWT token

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
};


// Email sender details

let transporter = nodemailer.createTransport({
    host: 'cityguider.in',
    auth: {
        user: process.env.email_username,
        pass: process.env.email_password

    },
    tls: {
        rejectUnauthorized: false,
    }
})

// activating account

router.get('/activateaccount', async (req, res) => {
    try {
        const token = req.query.token

        const user = await User.findOne({ emailToken: token })


        console.log(user)

        if (user) {

            user.emailToken = null;

            // Verifing the user
            user.isVerified = true;

            await user.save();

            res.redirect('/login')

        }
        else {
            res.redirect('/');
        }
    }
    catch (err) {
        console.log(err);
        res.send('An Error Occurred')
    }
});


// Login 


router.get('/login', (req, res) => {
    res.render('login.ejs')
});


router.post('/login', isVerified, async (req, res) => {

    try {

        const { email, password } = req.body;

        const findUser = await User.findOne({ email: email });

        if (findUser) {

            const isUser = await bcrypt.compare(password, findUser.password);

            if (isUser) {

                // after user have been authenticated, we need to save the login details using token
                const token = createToken(findUser._id);

                // Storing the created user in cookie
                res.cookie('access-token', token)

                res.redirect(`/dashboard/${findUser.type}/${findUser._id}`);
            }
            else {
                res.redirect('/login');
            }

        }
        else {
            res.redirect('/login');
        }


    }
    catch (err) {
        console.log(err);
    }

});


// General user Registration

router.get('/register', (req, res) => {
    res.render('register.ejs')
});


router.post('/register', async (req, res) => {

    try {

        const { username, email, password, type } = req.body;

        const user = await new User({
            username,
            email,
            password,
            type,
            emailToken: crypto.randomBytes(64).toString('hex'),
            isVerified: false,
        });

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(user.password, salt)

        user.password = hashedPassword

        const newuser = await user.save();


        // Send verification mail to the user
        let mailOptions = {
            from: ' "Activate your account" <cityguider@cityguider.in> ',
            to: user.email,
            subject: 'Cityguider - Activate your account',
            html: `<h1>Hi ${user.username}!</h1>
            <h3>Thanks for Registering on our site</h3>
            <p>Can't find good vlogs for entertainment and services in your new city? Well do not worry more, CityGuider is here for you!</p>
            <p>We are dedicated to help you anytime you need us by providing you with the best services and vlogs you need.</p>
            <p>All you need to do now is to activate your account and continue using our services</p>
            <a href="http://${req.headers.host}/activateaccount?token=${user.emailToken}">Activate your account</a>
            <br>
            <p><b>Warm Regards,</b><p>
            <p><b>Team CityGuider</b></p>`
        }

        // sending mail
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                const message = "Sorry an error occurred at server :-("
                return res.render('message.ejs', { message: message });
            }
            else {
                console.log('An account activation mail has been sent to your email')

            }
        })

        const message = "We have sent a mail to your email account! Please activate your account using the link given in the mail, Check Spam folder if you cannot find the mail :-)"
        res.render('message.ejs', { message: message });

    } catch (err) {
        console.log(err);
    }

});


// Partner Registration

router.get('/partnerregister', (req, res) => {
    res.render('partnerRegister.ejs')
});

router.post('/partnerregister', async (req, res) => {

    try {

        const { username, email, password, number, type } = req.body;

        const user = await new User({
            username,
            email,
            password,
            type,
            number,
            emailToken: crypto.randomBytes(64).toString('hex'),
            isVerified: false,
        });

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(user.password, salt)

        user.password = hashedPassword

        const newuser = await user.save();


        // Send verification mail to the user
        let mailOptions = {
            from: ' "Activate your account" <cityguider@cityguider.in> ',
            to: user.email,
            subject: 'Cityguider - Activate your account',
            html: `<h1>Hi ${user.username}!</h1>
            <h3>Thanks for Partnering with us, we are really happy to get your support</h3>
            <p>With us, you will be able to put your Vlogs, increase your video views, expand your audience, earn new subscribers, and be in contact with us and our customers</p>
            <p>We are dedicated to help you anytime you need us by providing you with the best services.</p>
            <p>All you need to do now is to activate your account and become our partner :-)</p>
            <a href="http://${req.headers.host}/activateaccount?token=${user.emailToken}">Activate your account</a>
            <p>PS- Before verifying please check your details below for future contact</p>
            <p>Username : ${user.username}</p>
            <p>Phone number : ${user.number}</p>
            <br><br><br>
            <p><b>Warm Regards,</b><p>
            <p><b>Team CityGuider</b></p>`
        }

        // sending mail
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                const message = "Sorry an error occurred at server :-("
                return res.render('message.ejs', { message: message });
            }
            else {
                console.log('An account activation mail has been sent to your email')

            }
        })

        const message = "We have sent a mail to your email account! Please activate your account using the link given in the mail :-)"
        res.render('message.ejs', { message: message });

    } catch (err) {
        console.log(err);
    }

});


// Logout

router.post('/logout', (req, res) => {
    res.cookie('access-token', "", { maxAge: 1 })
    res.redirect('/')
});


module.exports = router;