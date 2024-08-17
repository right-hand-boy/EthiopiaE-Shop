const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { loggedIdentifer, password } = req.body;

  if (loggedIdentifer && password) {
    try {
      let user;
      if (String(loggedIdentifer).includes("@")) {
        user = await User.findOne({ email: loggedIdentifer });
      } else {
        user = await User.findOne({ phonenumber: loggedIdentifer });
      }
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          res.json({
            success: true,
            message: "Login successful.",
            user,
          });
        } else {
          res.json({ success: false, message: "Incorrect password." });
        }
      } else {
        res.json({ success: false, message: "User not found." });
      }
    } catch (err) {
      res.json({
        success: false,
        message: "Server error.",
        error: err.message,
      });
    }
  } else {
    res.json({ success: false, message: "Invalid email or password." });
  }
});

module.exports = router;
