//imports
const express = require("express");
const { profile, name, email, password } = require("../controllers/profileController");
const { authMiddleware } = require("../middleware/authMiddleWare");

//create express router
const router = express.Router();

//get user profile
router.get("/", authMiddleware, profile);

//edit profile router
router.put("/edit", authMiddleware, profile);
//name
router.put("/edit/name", authMiddleware, name);
//email
router.put("/edit/email", authMiddleware, email);
//password
router.put("/edit/password", authMiddleware, password);

//exports
module.exports = router;