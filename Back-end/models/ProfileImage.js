const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const profileImageSchema = new mongoose.Schema({
  userid: {
    type: ObjectId,
    required: true,
    unique: true,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  content: {
    type: Buffer,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ProfileImage", profileImageSchema);
