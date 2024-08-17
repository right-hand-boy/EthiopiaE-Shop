const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ProductVariationSchema = new mongoose.Schema({
  productId: { type: ObjectId, ref: "Product", required: true },
  variation: { type: String, required: true },
  value: { type: String, required: true },
});

module.exports = mongoose.model("ProductVariation", ProductVariationSchema);
