const mongoose = require("mongoose");
const user = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
});

module.exports = mongoose.model("User", user);