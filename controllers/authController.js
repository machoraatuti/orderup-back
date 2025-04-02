//imports
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//signup logic
exports.signup = async(req, res) => {

    //try..catch block
    try {
        
        //extract name, email and password
        const { name, email, password } = req.body;

        //check if user already exists via email
        let user = await User.findOne({ email });
        if (user) {
            
            //user exists means it is a bad request
            return res.status(400).json({ message: "User already exists!" });
        }

        //hash password
        const salt = await bcrypt.genSalt(10);//generates random salt
        const hashedPass = await bcrypt.hash(password, salt);//hash password by adding salt

        //create new user
        user = new User({ name, email, password: hashedPass });
        await user.save();//save new user

        //generate jwt
        const tokenJwt = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN}
        );

        //return 201 created success message with jwt token
        res.status(201).json({ 
            message: "User registration successful!",
            user: { id: user._id, name: user.name, email: user.email },
            token: tokenJwt 
        });

    } catch(err) {
        //console signup error
        console.log("Signup Error:", err);
        //return internal server error
        res.status(500).json({ message: "Server error", err });
    }
};

//login logic
exports.login = async(req, res) => {

    //try..catch block
    try {

        //extract email and password from request body
        const {  email, password } = req.body;

        //check if the user exists
        const user = await User.findOne({ email });
        if (!user) {

            //user does not exist means bad request
            return res.status(400).json({ message: "Invalid email or pasword!" });
        }

        //check password correctness
        const matchPass = await bcrypt.compare(password, user.password);
        if (!matchPass) {

            //return bad request if password does not match
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        //return success message when logged in
        res.status(200).json({ 
            message: "Login successful!", 
            token, 
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch(err) {
        //return error for unsuccessful login
        res.status(500).json({ message: "Server error", err });
    }
};

//logout logic
exports.logout = async (req, res) => {
    console.log("Logout Request User:", req.user);

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found in request" });
    }

    res.status(200).json({ message: `${req.user.name} logged out successfully!` });
};
