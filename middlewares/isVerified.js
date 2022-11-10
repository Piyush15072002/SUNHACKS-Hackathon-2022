const User = require('../model/User');

const jwt = require('jsonwebtoken');

const cookie = require('cookie-parser');

const isVerified = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (user) {
            if (user.isVerified === true) {
                return next();
            }

            if (user.isVerified === false) {
                console.log("Please activate your account using the email sent to you!")
                const message = "Please activate your Account using the mail sent to your registered Email, then Login again! "
                return res.render('message.ejs', { message: message });
            }


        }
        else {
            res.redirect('/register');
        }


    }
    catch (err) {
        console.log(err)
    }
}



module.exports = isVerified;