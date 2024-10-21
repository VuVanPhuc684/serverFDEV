const mongoose = require("mongoose");


const Product = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true // Thêm required nếu tên sản phẩm là bắt buộc
    },
    price: {
      type: Number, // Đổi thành Number thay vì String
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    type: {
      type: String
    }
  },
  {
    timestamps: true // Tự động tạo createdAt và updatedAt
  }
);


// Đăng ký model Product với Mongoose
module.exports = mongoose.model("product", Product);


