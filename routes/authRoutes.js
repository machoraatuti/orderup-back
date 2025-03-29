//imports
const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controllers/authController");
const { authMiddleware} = require("../middleware/authMiddleWare");

//REST api authentication routes
router.post("/signup", signup);//signup
router.post("/login", login);//login
router.post("/logout", authMiddleware, logout);//logout

module.exports = router;


