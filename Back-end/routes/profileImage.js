const express = require("express");
const router = express.Router();
const ProfileImage = require("../models/ProfileImage");
const multer = require("multer");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
// Configure multer
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Set up your upload route
router.post("/upload", upload.single("image"), async (req, res) => {
  const { userid } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const { originalname, mimetype, size, buffer } = req.file;

  try {
    // Update existing image or create a new one
    const newImage = await ProfileImage.findOneAndUpdate(
      { userid: new mongoose.Types.ObjectId(userid) },
      {
        name: originalname,
        type: mimetype,
        size,
        content: buffer,
      },
      { upsert: true, new: true }
    );

    return res.status(201).json({
      message:
        "Image uploaded and updated/inserted into the database successfully.",
    });
  } catch (error) {
    console.error("Error while saving image to database:", error);
    return res.status(500).json({ error: "Error: " + error.message });
  }
});

router.get("/image", async (req, res) => {
  const { userid } = req.query;

  try {
    // Find the image by userid
    const image = await ProfileImage.findOne({
      userid: new mongoose.Types.ObjectId(userid),
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found for the user." });
    }

    // Set appropriate headers for the image
    res.set("Content-Type", image.type);
    res.set("Content-Length", image.size);

    // Output the image content
    res.send(image.content);
  } catch (error) {
    return res.status(500).json({ error: "Error: " + error.message });
  }
});

module.exports = router;
