var express = require("express");
var router = express.Router();

const Review = require("../model/Review");

router.get("/", (rq, rs) => {
  rs.send("Vao API Review");
});

// Lấy danh sách các sản phẩm giày
router.get("/get-list-Review", async (req, res) => {
  try {
    const data = await Review.find();
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

