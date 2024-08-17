const express = require("express");
const Review = require("../models/Review");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
router.post("/review", async (req, res) => {
  const {
    rating,
    review,
    productId,
    reviewerName, // Assuming the user has a name field
    reviewDate,
    userId,
  } = req.body;
  try {
    const productReviews = new Review({
      productId: new mongoose.Types.ObjectId(productId),
      rating,
      review,
      reviewerName,
      reviewDate,
      userId: new mongoose.Types.ObjectId(userId),
    });
    productReviews.save();

    res.status(200).json({ success: true, message: "succesfuly " });
  } catch (error) {
    console.error("Error fetching related products:", error);
    res
      .status(500)
      .json({ success: false, message: "An unexpected error occurred." });
  }
});
router.post("/user/rate", async (req, res) => {
  const { productId, userId } = req.body;

  try {
    let review;
    const reviews = await Review.find({
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    if (reviews.length) {
      review = reviews[reviews.length - 1]; // get the latest review
    }
    res.json({ rating: review ? review.rating : 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/rate", async (req, res) => {
  const { productId } = req.body;
  try {
    const reviews = await Review.find({
      productId: new mongoose.Types.ObjectId(productId),
    });
    let sum = reviews
      ? reviews.reduce((acc, review) => acc + review.rating, 0)
      : 0;
    res.json({
      rating: reviews.length ? sum / reviews.length : 0,
      vote: reviews.length ? reviews.length : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/update/user/rate", async (req, res) => {
  const { productId, userId, value, reviewerName } = req.body;

  try {
    let review;
    const reviews = await Review.find({
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });
    console.log(review);
    if (reviews.length) {
      review = reviews[reviews.length - 1]; // get the latest review
      review.rating = value; // update the rating with the new value
      await review.save(); // save the updated review
    } else {
      // create a new review if none exists
      review = new Review({
        productId: new mongoose.Types.ObjectId(productId),
        userId: new mongoose.Types.ObjectId(userId),
        rating: value,
        reviewerName,
      });
      await review.save();
    }

    res.json({ rating: review.rating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
