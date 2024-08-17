const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ProductSpecificationSchema = new mongoose.Schema({
  productId: { type: ObjectId, ref: "Product", required: true },
  specification: { type: String, required: true },
  value: { type: String, required: true },
});

module.exports = mongoose.model(
  "ProductSpecification",
  ProductSpecificationSchema
);
