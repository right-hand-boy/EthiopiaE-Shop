const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Load User model
const User = require("../models/User");

// @route   POST /signup
// @desc    Register new user
// @access  Public
router.post("/signup", async (req, res) => {
  const {
    username,
    firstname,
    lastname,
    userid,
    password,
    email,
    phonenumber,
  } = req.body;

  // Check if all required fields are provided
  if (
    !username ||
    !firstname ||
    !lastname ||
    !userid ||
    !password ||
    !email ||
    !phonenumber
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Incomplete data." });
  }

  try {
    // Check if the phone number is unique
    const existingUser =
      (await User.findOne({ phonenumber })) || (await User.findOne({ email }));

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      userid,
      phonenumber,
    });

    // Save the user to the database
    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully." });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error: " + err.message });
  }
});

module.exports = router;
