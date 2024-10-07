const mongoose = require("mongoose");

// Hàm định dạng chỉ lấy giờ và ngày
const formatTime = () => {
  const currentDate = new Date();
  return currentDate.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Hiển thị giờ theo định dạng 24h
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const Review = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    rate: { type: Number, required: true },
    comment: { type: String, required: true },
    time: { type: String, default: formatTime }, // Định dạng thời gian khi lưu
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

module.exports = mongoose.model("review", Review);
