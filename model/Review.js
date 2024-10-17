// models/Review.js
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Product model
    ref: 'Product',
    required: true
  },
  userName: {
    type: String,
    required: true, // userName is fetched and validated via Firebase auth middleware
  },
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Ensuring a unique review per product per user
ReviewSchema.index({ productId: 1, userName: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
