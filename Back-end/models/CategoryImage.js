const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const categoryImageSchema = new mongoose.Schema({
  name: String,
  type: String,
  size: Number,
  content: Buffer,
  categoryId: { type: ObjectId, ref: "Category" },
  date: { type: Date, default: Date.now },
});

const CategoryImage = mongoose.model("CategoryImage", categoryImageSchema);

module.exports = CategoryImage;
