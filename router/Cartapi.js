const mongoose = require("mongoose"); // Nhập khẩu mongoose
var express = require("express");
var router = express.Router();

const Cart = require("../model/Cart");
const Product = require("../model/Product");

// Trang chính của API Cart
router.get("/", (req, res) => {
  res.send("Vào API Cart");
});

// Lấy danh sách giỏ hàng
router.get("/get-list-cart", async (req, res) => {
  try {
    const { userId } = req.query; // Lấy userId từ query (thay vì body)

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({
        msg: "Invalid userId",
      });
    }

    // Tìm giỏ hàng theo userId và populate sản phẩm
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'products.product', // Sửa ở đây
      select: 'name price image',
    });

    if (!cart) {
      return res.status(404).json({ msg: "Cart empty" });
    }

    res.status(200).json({
      status: 200,
      msg: "List cart",
      data: cart,
    });
  } catch (error) {
    console.log("get-list-cart error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

// Thêm sản phẩm vào giỏ hàng thông qua POST
router.post("/add-to-cart", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body; // Thêm userId vào đây

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Invalid userId or productId" });
    }

    // Tìm sản phẩm bằng ProductModel
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

   // Tìm giỏ hàng theo userId
let cart = await Cart.findOne({ user: userId });
if (!cart) {
  // Nếu giỏ hàng không tồn tại, tạo mới giỏ hàng với mảng products rỗng
  cart = new Cart({ user: userId, products: [] }); // Sử dụng products thay vì items
}

// Kiểm tra sản phẩm đã có trong giỏ hàng chưa
const itemIndex = cart.products.findIndex(item => item.product.toString() === productId);
if (itemIndex !== -1) {
  // Nếu đã có, cập nhật số lượng và giá
  cart.products[itemIndex].quantity += quantity;
  cart.products[itemIndex].price = product.price * cart.products[itemIndex].quantity;
} else {
  // Nếu chưa có, thêm vào giỏ hàng
  cart.products.push({
    product: productId,
    quantity: quantity,
    price: product.price * quantity,
    name: product.name,
    image: product.image,
  });
}

const result = await cart.save();
res.status(200).json({ status: 200, msg: "Add item to cart successfully", data: result });

  } catch (error) {
    console.log("addItemToCart error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
