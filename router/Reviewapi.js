const express = require("express");
const router = express.Router();
const Review = require("../model/Review");
const Product = require("../model/Product");

// Hàm định dạng chỉ lấy giờ và ngày
const formatTime = () => {
  const currentDate = new Date();
  return currentDate.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

router.get("/", (req, res) => {
  res.send("Vào API Review");
});

// Lấy danh sách tất cả các review
router.get("/get-list-review", async (req, res) => {
  try {
    const data = await Review.find();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: [],
    });
  }
});

// Lấy review theo productId
router.get("/get-reviews/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.find({ productId });
    if (reviews.length === 0) {
      return res.status(404).json({ message: "Không có review cho sản phẩm này." });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// Thêm review mới
router.post("/add-review", async (req, res) => {
  const { productId, userId, rate, comment } = req.body;

  try {
    if (rate < 0 || rate > 5) {
      return res.status(400).json({ message: "Số sao phải nằm trong khoảng từ 0 đến 5." });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    const newReview = new Review({
      productId,
      userId,
      rate,
      comment,
      time: formatTime(),
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Có lỗi xảy ra khi thêm review." });
  }
});

// Cập nhật review theo ID
router.put("/update-review/:id", async (req, res) => {
  const { id } = req.params;
  const { rate, comment } = req.body;

  try {
    if (rate < 0 || rate > 5) {
      return res.status(400).json({ message: "Số sao phải nằm trong khoảng từ 0 đến 5." });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rate, comment, time: formatTime() },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Không tìm thấy review để cập nhật." });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật review." });
  }
});

// Xóa review theo ID
router.delete("/delete-review/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Không tìm thấy review để xóa." });
    }
    res.status(200).json({ message: "Review đã được xóa." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Có lỗi xảy ra khi xóa review." });
  }
});

module.exports = router;
