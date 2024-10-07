var express = require("express");
var router = express.Router();

const User = require("../model/User");

router.get("/", (rq, rs) => {
  rs.send("Vao API User");
});

// Lấy danh sách các sản phẩm giày
router.get("/get-list-User", async (req, res) => {
  try {
    const data = await User.find().select("-password");
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

// Đăng nhập người dùng
// Đăng nhập người dùng
router.post("/get-Login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm người dùng bằng email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    // Kiểm tra mật khẩu
    if (user.pass !== password) {  // Sử dụng trường pass thay vì password
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });
    }

    // Trả về thông tin người dùng (trừ mật khẩu)
    res.json({
      id: user._id,
      email: user.email,
      message: "Đăng nhập thành công!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

module.exports = router;

