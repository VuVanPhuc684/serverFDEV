const express = require("express");
const router = express.Router();
const Review = require("../model/Review"); // Đảm bảo đường dẫn đúng
const Product = require("../model/Product"); // Đảm bảo đường dẫn đúng


// Route to check API status
router.get("/", (req, res) => {
  res.send("Review API is running");
});


router.get("/get-reviews/:productId", async (req, res) => {
  const { productId } = req.params;
  console.log(`Fetching reviews for productId: ${productId}`);
  try {
    const reviews = await Review.find({ productId }).populate('productId', 'name price description');
    console.log(reviews); // Log reviews để kiểm tra kết quả truy vấn
    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found for this product." });
    }
    const response = reviews.map(review => ({
      userName: review.userName,
      comment: review.comment,
      rating: review.rating,
      createdAt: review.createdAt,
      productDetails: {
        name: review.productId.name,
        price: review.productId.price,
        description: review.productId.description
      }
    }));
    res.json(response);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Add a new review
router.post("/add-review", async (req, res) => {
  const { productId, userName, comment, rating } = req.body;
  try {
    // Kiểm tra xem đánh giá đã tồn tại chưa
    const existingReview = await Review.findOne({ productId, userName });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product." });
    }


    // Tạo đánh giá mới
    const newReview = new Review({
      productId,
      userName,
      comment,
      rating
    });
    const savedReview = await newReview.save();


    res.status(201).json({
      message: "Review added successfully",
      review: {
        productId: savedReview.productId,
        userName: savedReview.userName,
        comment: savedReview.comment,
        rating: savedReview.rating,
        createdAt: savedReview.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding review." });
  }
});




// Delete a review
router.delete("/delete-review/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found." });
    }
    res.json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting review." });
  }
});


module.exports = router;



