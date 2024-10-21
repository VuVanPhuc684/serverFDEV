const mongoose = require("mongoose");

const Favourite = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,  // Tên người dùng từ màn hình đăng ký
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",  // Liên kết với sản phẩm
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('favourite', Favourite);