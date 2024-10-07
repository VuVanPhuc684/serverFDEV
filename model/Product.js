const mongoose = require("mongoose");

const ProductModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    type: {
      type: String, // Loại sản phẩm
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product", ProductModel);
