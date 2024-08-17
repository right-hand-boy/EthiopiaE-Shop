// ./model/Review.js
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const ReviewSchema = new mongoose.Schema({
  productId: { type: ObjectId, ref: "Product", required: true },
  rating: { type: Number, required: true },
  review: { type: String },
  reviewerName: { type: String, required: true },
  reviewDate: { type: Date, default: Date.now },
  userId: { type: ObjectId, ref: "users", required: true },
});

const Review = mongoose.model("Reviews", ReviewSchema);
module.exports = Review;
