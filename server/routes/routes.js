const express = require("express");
const router = express.Router();
const loginController = require("../controller/login_controller");
const { signupController } = require("../controller/signup_controller");

// Login route
router.post("/login", loginController.loginController);

// Signup route
router.post("/signup", signupController);

module.exports = router;
