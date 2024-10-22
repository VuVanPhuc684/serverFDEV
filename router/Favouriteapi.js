var express = require("express");
var router = express.Router();

const Favourite = require("../model/Favourite");
const Product = require("../model/Product");

// Lấy danh sách các sản phẩm yêu thích
// Lấy danh sách các sản phẩm yêu thích với thông tin sản phẩm đầy đủ
router.get("/get-list-favourite", async (req, res) => {
  const { userName } = req.query;
  if (!userName) {
    return res.status(400).json({ message: "Tên không hợp lệ" });
  }
  try {
    const favourite = await Favourite.findOne({ userName }).populate({
      path: "products.product",
      select: "name price image",
    });
    if (!favourite || favourite.products.length === 0) {
      return res.status(404).json({ message: "Yêu thích trống", data: [] });
    }
    return res.json({
      status: 200,
      msg: "Danh sách yêu thích",
      data: favourite,
    });
  } catch (error) {
    console.log("get-list-favourite error:", error);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
      data: [],
    });
  }
});

// Thêm sản phẩm vào danh sách yêu thích
router.post("/add-to-favourite", async (req, res) => {
  const { userName, productId, quantity = 1 } = req.body;
  if (!userName) {
    return res.status(400).json({ message: "Tên người dùng là bắt buộc" });
  }
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    let favourite = await Favourite.findOne({ userName });
    if (!favourite) {
      favourite = new Favourite({ userName, products: [] });
    }
    const productIndex = favourite.products.findIndex(p => p.product.equals(product._id));
    if (productIndex > -1) {
      favourite.products[productIndex].quantity += quantity;
    } else {
      favourite.products.push({
        product: product._id,
        quantity,
        price: product.price,
        name: product.name,
        image: product.image,
      });
    }
    await favourite.save();
    res.json({
      status: 200,
      msg: "Sản phẩm đã được thêm vào yêu thích",
      data: favourite,
    });
  } catch (error) {
    console.log("add-to-favourite error:", error);
    res.status(500).json({
      status: 500,
      message: "Lỗi server",
      data: [],
    });
  }
});

// Xóa sản phẩm khỏi danh sách yêu thích
router.delete("/remove-from-favourite/:userName/:productName", async (req, res) => {
  const { userName, productName } = req.params;
  if (!userName) {
    return res.status(400).json({ message: "Tên không hợp lệ" });
  }
  try {
    const favourite = await Favourite.findOne({ userName });
    if (!favourite) {
      return res.status(404).json({ message: "Không tìm thấy danh sách yêu thích" });
    }
    const productIndex = favourite.products.findIndex(p => p.name === productName);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại trong danh sách yêu thích" });
    }
    favourite.products.splice(productIndex, 1);
    await favourite.save();
    return res.json({
      status: 200,
      msg: "Sản phẩm đã được xóa khỏi yêu thích",
      data: favourite,
    });
  } catch (error) {
    console.log("remove-from-favourite error:", error);
    res.status(500).json({
      status: 500,
      message: "Lỗi server",
      data: [],
    });
  }
});

module.exports = router;
