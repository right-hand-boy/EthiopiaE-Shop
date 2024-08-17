const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productImageSchema = new mongoose.Schema({
  productId: { type: ObjectId, ref: "Product", required: true },
  imageName: String,
  imageType: String,
  imageSize: Number,
  imageContent: Buffer,
  type: { type: String, required: true },
});

const ProductImage = mongoose.model("ProductImage", productImageSchema);

module.exports = ProductImage;
