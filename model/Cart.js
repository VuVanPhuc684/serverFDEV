const mongoose = require("mongoose");

const Cart = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,  // Email người dùng từ Firebase
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

module.exports = mongoose.model('cart', Cart);
