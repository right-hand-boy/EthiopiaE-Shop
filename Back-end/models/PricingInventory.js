const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const PricingInventorySchema = new mongoose.Schema({
  productId: { type: ObjectId, ref: "Product", required: true },
  price: { type: Number, required: true },
  inventory: { type: Number, required: true },
});

module.exports = mongoose.model("PricingInventory", PricingInventorySchema);
