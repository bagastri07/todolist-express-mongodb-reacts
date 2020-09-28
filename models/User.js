const mongoose = require("mongoose");
const user = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'First name required']
    },
    lastname: {
        type: String,
        required: [true, 'Last Name required']
    },
    email: {
        type: String,
        required: [true, 'Email required']
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minlength: [8, 'at least 8 characters of password'],
    }
});

module.exports = mongoose.model("User", user);