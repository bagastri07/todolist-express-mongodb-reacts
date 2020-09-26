const express = require('express');
const router = express.Router();
const bcyrpt = require('bcrypt');
const User = require('../../models/User');

router.get('/', (req, res) => {
    res.send('OKE');
});

router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.json({message: 'User already exist'});
        if (!doc) {
            const hashedPassword = await bcyrpt.hash(req.body.password, 10);

            const newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashedPassword
            });
            await newUser.save();
            res.json({message: 'User created'});
        }
    });
});

module.exports = router;