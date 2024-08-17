const express = require("express");
const router = express.Router();
const multer = require("multer");
const Category = require("../models/Category"); // Import the Category model
const CategoryImage = require("../models/CategoryImage"); // Import the Category model
const Product = require("../models/Product"); // Assuming you have a Product model for uploaded products
const ProductImage = require("../models/ProductImage");

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
// Admin upload route
// router.post("/category", upload.single("file"), async (req, res) => {
//   const { categoryId } = req.body;

//   if (!req.file) {
//     console.error("No file uploaded.");
//     return res.status(400).json({ error: "No file uploaded." });
//   }

//   if (!categoryId) {
//     console.error("Category ID is required.");
//     return res.status(400).json({ error: "Category ID is required." });
//   }

//   const { originalname, mimetype, size, buffer } = req.file;

//   try {
//     console.log(`Searching for category with ID: ${categoryId}`);
//     const category = await Category.findById(categoryId);
//     if (!category) {
//       console.error("Category not found.");
//       return res.status(404).json({ error: "Category not found." });
//     }

//     console.log(
//       `Checking if image already exists for category ID: ${categoryId}`
//     );
//     const existingImage = await CategoryImage.findOne({ categoryId });

//     if (existingImage) {
//       console.log("Updating existing image record...");
//       existingImage.name = originalname;
//       existingImage.type = mimetype;
//       existingImage.size = size;
//       existingImage.content = buffer;
//       existingImage.date = Date.now();
//       await existingImage.save();
//     } else {
//       console.log("Creating new image record...");
//       const newImage = new CategoryImage({
//         name: originalname,
//         type: mimetype,
//         size,
//         content: buffer,
//         categoryId,
//         date: Date.now(),
//       });
//       await newImage.save();
//     }

//     console.log("Image uploaded and associated successfully.");
//     return res.status(201).json({
//       message: "Image uploaded and associated with the category successfully.",
//     });
//   } catch (error) {
//     console.error("Error processing request:", error.message);
//     return res.status(500).json({ error: "Error: " + error.message });
//   }
// });

// Route to get categories
router.get("/get_categories", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching categories: " + error.message });
  }
});

// Route to upload products
// router.post(
//   "/upload_product",
//   upload.single("productImage"),
//   async (req, res) => {
//     const { productName, productDescription, price, sellerId, categoryId } =
//       req.body;

//     if (!req.file) {
//       console.error("No product image uploaded.");
//       return res.status(400).json({ error: "No product image uploaded." });
//     }

//     if (
//       !productName ||
//       !productDescription ||
//       !price ||
//       !sellerId ||
//       !categoryId
//     ) {
//       console.error("All fields are required.");
//       return res.status(400).json({ error: "All fields are required." });
//     }

//     const { originalname, mimetype, size, buffer } = req.file;

//     try {
//       console.log("Creating new product...");

//       const newProduct = new Product({
//         name: productName,
//         description: productDescription,
//         price,
//         sellerId,
//         categoryId,
//         image: {
//           name: originalname,
//           type: mimetype,
//           size,
//           content: buffer,
//         },
//         date: Date.now(),
//       });

//       await newProduct.save();
//       console.log("Product saved successfully.");

//       return res
//         .status(201)
//         .json({ message: "Product uploaded successfully." });
//     } catch (error) {
//       console.error("Error uploading product:", error.message);
//       return res
//         .status(500)
//         .json({ error: "Error uploading product: " + error.message });
//     }
//   }
// );

// Product Upload Route
router.post(
  "/uploadProduct",
  upload.single("productImage"),
  async (req, res) => {
    try {
      const { productName, productDescription, price, sellerId, categoryId } =
        req.body;

      // Create a new product
      const product = new Product({
        productName,
        productDescription,
        price,
        sellerId,
        categoryId,
      });

      const savedProduct = await product.save();

      // Save the product image
      if (req.file) {
        const productImage = new ProductImage({
          productId: savedProduct._id,
          imageName: req.file.originalname,
          imageType: req.file.mimetype,
          imageSize: req.file.size,
          imageContent: req.file.buffer,
        });

        await productImage.save();
      }

      res
        .status(201)
        .json({ message: "Product and image uploaded successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Category Image Upload/Update Route
router.post("/uploadCategoryImage", upload.single("file"), async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Check if a record with the given categoryId already exists
    let categoryImage = await CategoryImage.findOne({ categoryId });

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

module.exports = router;
