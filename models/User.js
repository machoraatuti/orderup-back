//imports
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    //set up properties
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "Password must be atleast 8 characters long"]
    },
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

//exports
module.exports = mongoose.model("User", userSchema);