const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    dob: {
        type: Date,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    username: {
        type: String,
       required: true,
      unique: true
    },

    password: {
        type: String
    },

    firstLogin: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("User", UserSchema);