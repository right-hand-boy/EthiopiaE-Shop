const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");
const Seller = require("../models/Seller");
const Category = require("../models/Category");
const ProductSpecification = require("../models/ProductSpecification");
const ProductVariation = require("../models/ProductVariation");
const PricingInventory = require("../models/PricingInventory");
router.post(
  "/uploadProduct",
  upload.fields([
    { name: "productImage", maxCount: 1 },
    { name: "productThumbnails", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const {
        productName,
        productDescription,
        price,
        sellerId,
        categoryId,
        model,
        brand,
        sku,
        inventory,
      } = req.body;

      // Parse specifications and variations if they are provided as JSON strings
      let specifications = req.body.specifications;
      if (typeof specifications === "string") {
        try {
          specifications = JSON.parse(specifications);
        } catch (err) {
          return res
            .status(400)
            .json({ error: "Invalid JSON format for specifications." });
        }
      }

      let variations = req.body.variations;
      if (typeof variations === "string") {
        try {
          variations = JSON.parse(variations);
        } catch (err) {
          return res
            .status(400)
            .json({ error: "Invalid JSON format for variations." });
        }
      }

      // Validate seller and category existence using ObjectId
      const seller = await Seller.findOne({ sellerId });
      const category = await Category.findById(categoryId);

      if (!seller) {
        return res
          .status(400)
          .json({ error: `Seller with ID ${sellerId} not found.` });
      }
      if (!category) {
        return res
          .status(400)
          .json({ error: `Category with ID ${categoryId} not found.` });
      }
      if (price <= 0) {
        return res
          .status(400)
          .json({ error: "Invalid price. The price must be greater than 0." });
      }

      // Create and save the product
      const product = new Product({
        productName,
        productDescription,
        sellerId: seller._id,
        categoryId: category._id,
        brand,
        model,
        SKU: sku,
      });

      const savedProduct = await product.save();
      const productId = savedProduct._id; // Use the ObjectId of the saved product

      // Save specifications if provided
      if (Array.isArray(specifications)) {
        specifications.forEach(async (spec) => {
          const productSpecification = new ProductSpecification({
            productId,
            specification: spec.name,
            value: spec.value,
          });
          await productSpecification.save();
        });
      } else {
        console.error("Specifications is not an array:", specifications);
      }

      // Save variations if provided
      if (Array.isArray(variations)) {
        variations.forEach(async (variation) => {
          const productVariation = new ProductVariation({
            productId,
            variation: variation.name,
            value: variation.value,
          });
          await productVariation.save();
        });
      } else {
        console.error("Variations is not an array:", variations);
      }

      // Save pricing and inventory
      const pricingInventory = new PricingInventory({
        productId,
        price,
        inventory,
      });

      await pricingInventory.save();

      // Save main product image if provided
      if (req.files && req.files["productImage"]) {
        const productImage = new ProductImage({
          productId,
          imageName: req.files["productImage"][0].originalname,
          imageType: req.files["productImage"][0].mimetype,
          imageSize: req.files["productImage"][0].size,
          imageContent: req.files["productImage"][0].buffer,
          type: "main",
        });
        await productImage.save();
      }

      // Save product thumbnails if provided
      if (req.files && req.files["productThumbnails"]) {
        for (const thumbnail of req.files["productThumbnails"]) {
          const productThumbnail = new ProductImage({
            productId,
            imageName: thumbnail.originalname,
            imageType: thumbnail.mimetype,
            imageSize: thumbnail.size,
            imageContent: thumbnail.buffer,
            type: "thumb",
          });
          await productThumbnail.save();
        }
      }

      res
        .status(201)
        .json({ message: "Product and images uploaded successfully." });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
);

module.exports = router;
