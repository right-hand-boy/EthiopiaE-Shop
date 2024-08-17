// db/mongo.js
const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/EthiopiaE-Shop"; // Local MongoDB URI

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to local MongoDB.");
  } catch (err) {
    console.error("Failed to connect to local MongoDB:", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
