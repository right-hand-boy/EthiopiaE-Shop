const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const CategoryImage = require("../models/CategoryImage");
const mongoose = require("mongoose");
const Category = require("../models/Category"); // Import the Category model

router.post("/category", upload.single("file"), async (req, res) => {
  try {
    const { categoryId } = req.body;

    const category = await Category.findOne({ categoryId: categoryId });

    if (!category) {
      return res
        .status(400)
        .json({ error: `Category with ID ${categoryId} not found.` });
    }

    // Check if a record with the given categoryId already exists
    let categoryImage = await CategoryImage.findOne({
      categoryId: categoryId,
    });

    if (categoryImage) {
      // Update existing record
      categoryImage.name = req.file.originalname;
      categoryImage.type = req.file.mimetype;
      categoryImage.size = req.file.size;
      categoryImage.content = req.file.buffer;
      categoryImage.date = Date.now();
    } else {
      // Insert new record
      categoryImage = new CategoryImage({
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
        content: req.file.buffer,
        categoryId,
        date: Date.now(),
      });
    }

    await categoryImage.save();

    res.status(201).json({
      message:
        "Image uploaded and inserted/updated in the database successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get categories
router.get("/get_categories", async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});
router.get("/get_categories_image", async (req, res, next) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "categoryimages", // The name of the collection in MongoDB
          localField: "categoryId", // Field from the Category collection
          foreignField: "categoryId", // Field from the CategoryImage collection
          as: "images", // The name of the new array field to hold the joined data
        },
      },
      {
        $unwind: {
          path: "$images",
          preserveNullAndEmptyArrays: true, // Include categories even if they don't have an image
        },
      },
      {
        $project: {
          _id: 1,
          categoryId: 1,
          categoryName: 1,
          description: 1,
          imageName: "$images.name",
          imageType: "$images.type",
          imageSize: "$images.size",
          imageContent: "$images.content",
        },
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
