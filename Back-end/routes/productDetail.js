const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types; // Import ObjectId for converting IDs

// MongoDB Models
const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");
const Review = require("../models/Review");
const ProductSpecification = require("../models/ProductSpecification");
const ProductVariation = require("../models/ProductVariation");
const PricingInventory = require("../models/PricingInventory");

// Endpoint to fetch a product by its productId
router.get("/getProductDetail", async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID not provided." });
    }

    // Convert productId to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Find the product by ObjectId
    const product = await Product.findById(productObjectId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Fetch all thumbnail images associated with the product
    const productThumbnails = await ProductImage.find({
      productId: productObjectId,
      type: "thumb",
    });

    // Transform each thumbnail into the desired format
    const Thumbnails = productThumbnails.map((thumbnail) => ({
      imageType: thumbnail?.imageType || null,
      imageContent: thumbnail
        ? thumbnail.imageContent.toString("base64")
        : null,
    }));

    const productImage = await ProductImage.findOne({
      productId: productObjectId,
      type: "main",
    });

    // Create the product data object
    const productData = {
      productId: product.productId,
      productName: product.productName,
      productDescription: product.productDescription,
      categoryId: product.categoryId,
      model: product.model,
      brand: product.brand,
      SKU: product.SKU,
      productThumbil: Thumbnails,
      productImage: {
        imageType: productImage?.imageType || null,
        imageContent: productImage
          ? productImage.imageContent.toString("base64")
          : null,
      },
    };

    // Fetch reviews, specifications, variations, and pricing/inventory
    const [reviews, specifications, variations, pricingInventory] =
      await Promise.all([
        Review.find({
          productId: productObjectId,
          review: { $ne: null },
        }),
        ProductSpecification.find({ productId: productObjectId }),
        ProductVariation.find({ productId: productObjectId }),
        PricingInventory.findOne({ productId: productObjectId }),
      ]);

    res.status(200).json({
      ...productData,
      reviews,
      specifications,
      variations,
      price: pricingInventory?.price || null,
      inventory: pricingInventory?.inventory || null,
    });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res
      .status(500)
      .json({ success: false, message: "An unexpected error occurred." });
  }
});

// Endpoint to fetch related products by categoryId
router.get("/getRelatedProducts", async (req, res) => {
  try {
    const { categoryId, productId } = req.query;

    if (!categoryId) {
      return res
        .status(400)
        .json({ success: false, message: "Category ID not provided." });
    }

    // Convert categoryId and productId to ObjectId
    const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Find related products by categoryId, excluding the current product
    const relatedProducts = await Product.find({
      categoryId: categoryObjectId,
      _id: { $ne: productObjectId }, // Exclude the current product
    }).limit(8); // Limit the number of related products

    // Prepare an array to hold related products with their images
    const relatedProductsWithImages = [];

    for (let product of relatedProducts) {
      // Find the associated product image
      const productImage = await ProductImage.findOne({
        productId: product._id,
      });

      let imageContentBase64 = null;
      let imageType = null;

      if (productImage) {
        imageContentBase64 = productImage.imageContent.toString("base64");
        imageType = productImage.imageType;
      }

      const pricingInventory = await PricingInventory.findOne({
        productId: product._id,
      });

      // Combine product and image data
      const productData = {
        _id: product._id,
        productId: product.productId,
        productName: product.productName,
        productDescription: product.productDescription,
        price: pricingInventory?.price || null,
        categoryId: product.categoryId,
        imageType: imageType,
        imageContent: imageContentBase64,
        rating: product.rating,
      };

      relatedProductsWithImages.push(productData);
    }

    res.status(200).json(relatedProductsWithImages);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res
      .status(500)
      .json({ success: false, message: "An unexpected error occurred." });
  }
});

module.exports = router;
