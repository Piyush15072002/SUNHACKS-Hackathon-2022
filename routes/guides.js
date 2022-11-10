const express = require('express')

const router = express.Router();

const User = require('../model/User');

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');

const cookie = require('cookie-parser');

const isVerified = require('../middlewares/isVerified');


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




module.exports = router;