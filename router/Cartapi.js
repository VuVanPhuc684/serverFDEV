var express = require("express");
var router = express.Router();
const Cart = require("../model/Cart");
const Product = require("../model/Product");

// Trang chính của API Cart
router.get("/", (req, res) => {
  res.send("Vào API Cart");
});

// Lấy danh sách giỏ hàng theo email người dùng
router.get("/get-list-cart", async (req, res) => {
  try {
    const { userEmail } = req.query;  // Lấy email người dùng từ query params

    if (!userEmail) {
      return res.status(400).json({ message: "Email không hợp lệ" });
    }

    // Tìm giỏ hàng theo email và populate thông tin sản phẩm chi tiết
    const cart = await Cart.findOne({ userEmail }).populate({
      path: "products.product",
      select: "name price image",
    });

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng trống" });
    }

    // Trả về danh sách giỏ hàng
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

// Thêm sản phẩm vào giỏ hàng theo email người dùng từ Firebase Auth
router.post("/add-to-cart", async (req, res) => {
  try {
    // Lấy email và thông tin sản phẩm từ body request
    const { userEmail, productId, quantity } = req.body;

    // Kiểm tra xem email người dùng có được cung cấp không
    if (!userEmail) {
      return res.status(400).json({ message: "Email người dùng là bắt buộc" });
    }

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Tìm giỏ hàng của người dùng theo email hoặc tạo mới nếu chưa có
    let cart = await Cart.findOne({ userEmail });
    if (!cart) {
      cart = new Cart({ userEmail, products: [] });
    }

    // Kiểm tra sản phẩm có trong giỏ hàng chưa
    const productIndex = cart.products.findIndex((p) => p.product.equals(product._id));

    if (productIndex > -1) {
      // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
      cart.products[productIndex].quantity += quantity;
    } else {
      // Nếu sản phẩm chưa có, thêm sản phẩm mới vào giỏ hàng
      cart.products.push({
        product: product._id,
        quantity: quantity,
        price: product.price,
        name: product.name,
        image: product.image,
      });
    }

    // Lưu giỏ hàng sau khi cập nhật
    await cart.save();

    // Trả về phản hồi khi thêm sản phẩm thành công
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

module.exports = router;
