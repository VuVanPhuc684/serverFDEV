var express = require("express");
var router = express.Router();

const Product = require("../model/Product");

router.get("/", (rq, rs) => {
  rs.send("Vao API Product");
});

// Lấy danh sách các sản phẩm 
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

module.exports = router;

