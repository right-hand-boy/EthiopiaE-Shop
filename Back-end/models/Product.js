const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
  },
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  SKU: {
    type: String,
    required: true,
  },
  rating: { type: Number, default: 0 },
  sellerId: {
    type: String,
    required: true,
    ref: "sellers",
  },
  categoryId: {
    type: String,
    ref: "Category",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
