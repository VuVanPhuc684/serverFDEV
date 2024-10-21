var express = require("express");
var router = express.Router();
const Cart = require("../model/Cart");
const Product = require("../model/Product");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
  res.send("Vào API Cart");
});

// Lấy danh sách giỏ hàng
router.get("/get-list-cart", async (req, res) => {
  const { userName } = req.query;
  if (!userName) {
    return res.status(400).json({ message: "Tên không hợp lệ" });
  }
  try {
    const cart = await Cart.findOne({ userName }).populate({
      path: "products.product",
      select: "name price image",
    });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng trống" });
    }
    return res.json({
      status: 200,
      msg: "Danh sách giỏ hàng",
      data: cart,
    });
  } catch (error) {
    console.log("get-list-cart error:", error);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
      data: [],
    });
  }
});

// Thêm sản phẩm vào giỏ hàng
router.post("/add-to-cart", async (req, res) => {
  const { userName, productId, quantity } = req.body;
  if (!userName) {
    return res.status(400).json({ message: "Tên người dùng là bắt buộc" });
  }
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    let cart = await Cart.findOne({ userName });
    if (!cart) {
      cart = new Cart({ userName, products: [] });
    }
    const productIndex = cart.products.findIndex(p => p.product.equals(product._id));
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({
        product: product._id,
        quantity,
        price: product.price,
        name: product.name,
        image: product.image,
      });
    }
    await cart.save();
    res.json({
      status: 200,
      msg: "Sản phẩm đã được thêm vào giỏ hàng",
      data: cart,
    });
  } catch (error) {
    console.log("add-to-cart error:", error);
    res.status(500).json({
      status: 500,
      message: "Lỗi server",
      data: [],
    });
  }
});

// Xóa sản phẩm khỏi giỏ hàng theo tên sản phẩm
router.delete("/remove-from-cart/:userName/:productName", async (req, res) => {
  const { userName, productName } = req.params;
  if (!userName || !productName) {
    return res.status(400).json({ message: "Missing userName or productName" });
  }
  try {
    const cart = await Cart.findOne({ userName });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Lọc sản phẩm theo tên
    const updatedProducts = cart.products.filter(p => p.name !== productName);
    
    if (updatedProducts.length === cart.products.length) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Cập nhật giỏ hàng
    cart.products = updatedProducts;
    await cart.save();

    res.status(200).json({
      status: 200,
      message: "Product removed successfully",
      data: cart
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
