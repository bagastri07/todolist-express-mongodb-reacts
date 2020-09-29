const express = require('express');
const router = express.Router();
const bcyrpt = require('bcrypt');
const User = require('../../models/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//Passport
require('../../passport-config/passport-config')(passport);

router.get('/', (req, res) => {
    res.json({user: req.user, message: 'welcome to API'});
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user) return res.json({
            auth: false,
            message: 'No user exist'
        });

        req.logIn(user, (err) => {
            if (err) throw err;
            const token = jwt.sign({id: req.user._id}, process.env.JWT_SECRET, {expiresIn: '4h'});
            res.cookie('auth', token, {maxAge: 4 * 60 * 60 * 1000})
            return res.json({
                auth: true,
                message: 'You are logged',
                token : token
            });
        });
    })(req, res, next);
  });

router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.json({message: 'User already exist'});
        if (!doc) {
            const rawPassword = req.body.password;
            let hashedPassword;
            if (rawPassword.length >= 8) {
                hashedPassword = await bcyrpt.hash(rawPassword, 10);
            };

            const newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashedPassword || req.body.password
            });

            let error = await newUser.validateSync();
            if (error) {
                let errors = validatingNewUser(error);
                    res.json({
                        error : 'data not valid',
                        message: errors
                    });
            } else {
                await newUser.save();
                res.json({message: 'User created'});
            }
        }
    });
});


function validatingNewUser(error) {
    let errorsArray = []; 
    if (error) {
        if (error.errors['firstname']) {
            errorsArray.push(error.errors['firstname'].message)
        };
        if (error.errors['lastname']) {
            errorsArray.push(error.errors['lastname'].message)
        };
        if (error.errors['email']) {
            errorsArray.push(error.errors['email'].message)
        };
        if (error.errors['password']) {
            errorsArray.push(error.errors['password'].message)
        };
    }
    return errorsArray  
};

module.exports = router;