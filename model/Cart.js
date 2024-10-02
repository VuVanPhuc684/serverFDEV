const mongoose = require("mongoose");

const Cart = new mongoose.Schema(
  {
    userId: { type: String },
    productId: { type: String },
    quantity: { type: String }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("cart", Cart);