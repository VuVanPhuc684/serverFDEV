var express = require("express");
var router = express.Router();

const Contact = require("../model/Contact");

// Route kiểm tra hoạt động API
router.get("/", (req, res) => {
  res.send("Vào API Contact");
});

// Lấy danh sách các contact
router.get("/get-list-Contact", async (req, res) => {
  try {
    const data = await Contact.find();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: [],
    });
  }
});

// Thêm một contact mới
router.post("/post-list-Contact", async (req, res) => {
  try {
    // In ra dữ liệu nhận được để kiểm tra
    console.log("Received data:", req.body);

    // Kiểm tra xem body có tồn tại và có đầy đủ trường cần thiết không
    const { name, email, content } = req.body;

    if (!name || !email || !content) {
      // Trường hợp thiếu một trong các trường bắt buộc
      return res.status(400).json({
        status: 400,
        message: "Missing required fields (name, email, content)",
      });
    }

    // Kiểm tra email có hợp lệ không
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email format",
      });
    }

    // Tạo mới một đối tượng Contact
    const newContact = new Contact({
      name,
      email,
      content,
    });

    // Lưu dữ liệu vào MongoDB
    const result = await newContact.save();

    // Trả về phản hồi thành công
    res.status(200).json({
      status: 200,
      message: "Create contact successfully",
      data: result,
    });
  } catch (error) {
    // Bắt và ghi lỗi trong quá trình xử lý
    console.log("Error when creating contact:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
