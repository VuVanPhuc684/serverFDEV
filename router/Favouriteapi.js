var express = require("express");
var router = express.Router();

const Favourite = require("../model/Favourite");

router.get("/", (rq, rs) => {
  rs.send("Vao API Favourite");
});

// Lấy danh sách các sản phẩm giày
router.get("/get-list-Favourite", async (req, res) => {
  try {
    const data = await Favourite.find();
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

