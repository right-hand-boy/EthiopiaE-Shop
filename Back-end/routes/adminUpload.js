const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const Category = require("../models/Category"); // Import the Category model
const CategoryImage = require("../models/CategoryImage"); // Assuming you have a CategoryImage model for the uploaded images

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Admin upload route
router.post("/category", upload.single("file"), async (req, res) => {
  const { categoryId } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  if (!categoryId) {
    return res.status(400).json({ error: "Category ID is required." });
  }

  const { originalname, mimetype, size, buffer } = req.file;

  try {
    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    // Create or update the category image
    const existingImage = await CategoryImage.findOne({ categoryId });

    if (existingImage) {
      // Update existing record
      existingImage.name = originalname;
      existingImage.type = mimetype;
      existingImage.size = size;
      existingImage.content = buffer;
      existingImage.date = Date.now();
      await existingImage.save();
    } else {
      // Insert new record
      const newImage = new CategoryImage({
        name: originalname,
        type: mimetype,
        size,
        content: buffer,
        categoryId,
      });
      await newImage.save();
    }

    return res.status(201).json({
      message: "Image uploaded and associated with the category successfully.",
    });
  } catch (error) {
    return res.status(500).json({ error: "Error: " + error.message });
  }
});

module.exports = router;
