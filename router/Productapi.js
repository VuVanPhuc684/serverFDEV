var express = require("express");
var router = express.Router();

const Product = require("../model/Product");

router.get("/", (rq, rs) => {
  rs.send("Vao API Product");
});

// Lấy danh sách các sản phẩm giày
router.get("/get-list-Product", async (req, res) => {
  try {
    const data = await Product.find();
    console.log(data)
    res.json(data); // Trả về dữ liệu dưới dạng JSON
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      messenger: "Internal Server Error",
      data: [],
    });
  }
});
// API tìm kiếm sản phẩm theo tên
router.get("/search-product", async (req, res) => {
  const { name } = req.query; // Lấy tên sản phẩm từ query string

  if (!name) {
    return res.status(400).json({
      status: 400,
      messenger: "Tên sản phẩm không được để trống",
    });
  }

  try {
    // Tìm kiếm sản phẩm theo tên
    const products = await Product.find({ name: { $regex: name, $options: "i" } }); // Sử dụng regex để tìm kiếm không phân biệt chữ hoa chữ thường

    if (products.length === 0) {
      return res.status(404).json({
        status: 404,
        messenger: "Không tìm thấy sản phẩm nào",
        data: [],
      });
    }

    res.json(products); // Trả về danh sách sản phẩm tìm thấy
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      messenger: "Internal Server Error",
      data: [],
    });
  }
});

module.exports = router;

