const mongoose = require("mongoose");
const {Schema} = mongoose;

const user = new Schema({
    idUser: String,
    password: String,
    username: String,
    email: String, 
    phone: String,
    address: String,
    emoji: String,
    delete: {type: Boolean, default: false},
    createDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model("User", user);