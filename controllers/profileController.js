//imports
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//get user profile 
exports.profile = async(req, res) => {
    //try..catch block
    try {
        //extract userid from middleware
        const user = await User.findById(req.user._id).select("-password");

        //check for user in db
        if(!user) {
            return res.status(400).json({ message: "User not found!" });
        }
        //send details
        res.status(200).json(user);
    } catch(err) {
        res.status(400).json({ message: "Server Error! Try again later" });
    }
};

//update name
exports.name = async(req, res) => {
    //try..catch block
    try {
        //extract name
        const { name } = req.body;
        //check for name 
        if(!name) {
            return res.status(400).json({ message: "Name is required!" });
        }
        
        //update name
        const user = await User.findByIdAndUpdate(req.user._id, { name }, { new: true }).select("-password");
        res.status(200).json({ message: "Name updated successfully", user });
    } catch(err) {
        res.status(400).json({ message: "Server Error! Try again later" });
    }  
};

//update email
exports.email = async(req, res) => {
    //try..catch block
    try {
        //extract email
        const { email } = req.body;
        //check for email 
        if(!email) {
            return res.status(400).json({ message: "Email is required!" });
        }
        //check for email in db
        const existingEmail = await User.findOne({ email });
        if(existingEmail) {
            return res.status(400).json({ message: "Email is already in use!" });
        }
        //update email
        const user = await User.findByIdAndUpdate(req.user._id, { email }, { new: true }).select("-password");
        res.status(200).json({ message: "Email updated successfully", user });
    } catch(err) {
        res.status(400).json({ message: "Server Error! Try again later" });
    };
};

//update password
exports.password = async(req, res) => {
    //try..catch block
    try {
        //extract password
        const { password } = req.body;
        //validation check
        if(!password || password.length<8) {
            return res.status(400).json({ message: "Password must be atleast 8 characters long!" });
        }

        //hash a new password
        const salt =  await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate(req.user._id, { password: hash });
        res.status(200).json({ message: "Password updated successfully" })
    } catch(err) {
        res.status(400).json({ message: "Server Error! Try again later" });
    };
};