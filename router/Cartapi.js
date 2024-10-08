var express = require("express");
var router = express.Router();
const Cart = require("../model/Cart");
const Product = require("../model/Product");

// Trang chính của API Cart
router.get("/", (req, res) => {
  res.send("Vào API Cart");
});

// Lấy danh sách giỏ hàng theo tên người dùng
router.get("/get-list-cart", async (req, res) => {
  try {
    const { userName } = req.query; // Lấy userName từ query params

    if (!userName) {
      return res.status(400).json({ message: "Tên không hợp lệ" });
    }

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
  try {
    const { userName, productId, quantity } = req.body; // Lấy userName từ body

    if (!userName) {
      return res.status(400).json({ message: "Tên người dùng là bắt buộc" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    let cart = await Cart.findOne({ userName });
    if (!cart) {
      cart = new Cart({ userName, products: [] }); // Tạo mới giỏ hàng nếu chưa tồn tại
    }

    const productIndex = cart.products.findIndex((p) => p.product.equals(product._id));

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity; // Cập nhật số lượng nếu sản phẩm đã có
    } else {
      cart.products.push({
        product: product._id,
        quantity: quantity,
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

// Xóa sản phẩm khỏi giỏ hàng theo tên người dùng và productId
router.delete("/remove-from-cart", async (req, res) => {
  try {
    const { userName, productId } = req.query; // Lấy userName từ query params

    if (!userName) {
      return res.status(400).json({ message: "Tên không hợp lệ" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID không hợp lệ" });
    }

    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userName });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng trống" });
    }

    // Tìm sản phẩm trong giỏ hàng và xóa nó
    const productIndex = cart.products.findIndex((p) => p.product.equals(productId));
    if (productIndex > -1) {
      cart.products.splice(productIndex, 1); // Xóa sản phẩm
    } else {
      return res.status(404).json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    // Lưu lại giỏ hàng sau khi xóa sản phẩm
    await cart.save();

    res.json({
      status: 200,
      msg: "Sản phẩm đã được xóa khỏi giỏ hàng",
      data: cart,
    });
  } catch (error) {
    console.log("remove-from-cart error:", error);
    res.status(500).json({
      status: 500,
      message: "Lỗi server",
      data: [],
    });
  }
});

module.exports = router;
