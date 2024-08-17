const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");
const PricingInventory = require("../models/PricingInventory");

const router = express.Router();

router.get("/search", async (req, res) => {
  const { productName, categoryId, brand } = req.query;

  if (!productName) {
    return res
      .status(400)
      .json({ success: false, message: "Product name is required." });
  }

  // Create a regex pattern for case-insensitive search
  let query = {
    productName: { $regex: productName, $options: "i" }, // Naive String Matching using regex
  };

  // Add categoryId to the query if provided
  if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    query.categoryId = new mongoose.Types.ObjectId(categoryId);
  }

  try {
    const products = await Product.find(query).sort({ date: -1 });

    const productsWithImages = [];

    for (const product of products) {
      let productImage = null;
      let pricingInventory = null;

      const productId = product._id;
      const productObjectId = new mongoose.Types.ObjectId(productId);

      try {
        // Fetch the main product image
        productImage = await ProductImage.findOne({
          productId: productObjectId,
          type: "main",
        });

        // Fetch the pricing and inventory information
        pricingInventory = await PricingInventory.findOne({
          productId: productObjectId,
        });
      } catch (err) {
        console.error("Error finding product image or pricing:", err);
        continue;
      }

      // Combine product details with image and pricing information
      const combinedProduct = {
        ...product._doc,
        productImage: productImage
          ? {
              imageName: productImage.imageName,
              imageType: productImage.imageType,
              imageSize: productImage.imageSize,
              imageContent: productImage.imageContent.toString("base64"),
            }
          : null,
        price: pricingInventory?.price,
        _id: productObjectId,
      };

      productsWithImages.push(combinedProduct);
    }

    res.status(200).json(productsWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
