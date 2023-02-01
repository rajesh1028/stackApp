const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    pwd: String,
    age: Number
})

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel }