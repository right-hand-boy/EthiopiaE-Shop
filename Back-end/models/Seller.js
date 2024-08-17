const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  sellerId: { type: Number, required: true }, // Change this to Number
  seller_name: { type: String, required: true },
  store_name: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  products: { type: Number, default: 0 },
  location: { type: String, required: true },
});

const Seller = mongoose.model("Sellers", sellerSchema);
module.exports = Seller;
