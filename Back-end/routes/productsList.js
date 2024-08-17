const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");
const PricingInventory = require("../models/PricingInventory");

router.get("/products_with_images", async (req, res, next) => {
  try {
    // Fetch all products
    const products = await Product.find({});

    // Prepare an array to hold the combined product data
    const productsWithImages = [];

    // Iterate over each product to find its corresponding image
    for (const product of products) {
      let productImage = null;

      try {
        // Use the productId directly without converting to ObjectId
        const productId = product._id;

        const productObjectId = new mongoose.Types.ObjectId(productId);

        // Fetch the corresponding product image
        productImage = await ProductImage.findOne({
          productId: productObjectId, // Assuming productId is stored as a string or number
          type: "main",
        });
        pricingInventory = await PricingInventory.findOne({
          productId: productObjectId, //
        });
      } catch (err) {
        console.error("Error finding product image:", err);
        continue; // Skip this product and continue with the next one
      }

      // Combine product and image data into a single object
      const combinedProduct = {
        ...product._doc,
        productImage: productImage
          ? {
              imageName: productImage.imageName,
              imageType: productImage.imageType,
              imageSize: productImage.imageSize,
              imageContent: productImage.imageContent.toString("base64"), // Convert buffer to base64 string
            }
          : null,
        price: pricingInventory.price,
      };

      productsWithImages.push(combinedProduct);
    }

    // Respond with the combined data
    res.status(200).json(productsWithImages);
  } catch (error) {
    console.error("Error in /products_with_images:", error); // Log the error for debugging
    res
      .status(500)
      .json({ success: false, message: "An unexpected error occurred." });
    next(error);
  }
});

module.exports = router;
