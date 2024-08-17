const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true, // Ensure username is unique
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
      lowercase: true, // Convert email to lowercase
    },
    password: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      required: true,
      unique: true, // Ensure userid is unique
    },
    phonenumber: {
      type: String,
      required: true,
      unique: true, // Ensure phone number is unique
    },
  },
  { timestamps: true }
); // Automatically create createdAt and updatedAt fields

module.exports = mongoose.model("User", userSchema);
