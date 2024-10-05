// router/Paymentapi.js
const express = require("express");
const router = express.Router();
const Payment = require("../model/Payment");

// Thêm thẻ thanh toán mới
router.post("/", async (req, res) => {
  const {
    userId,
    cardNumber,
    nameOnCard,
    expiryMonth,
    expiryYear,
    type,
    cardType,
    bankName,
    billingAddress,
    image
  } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!userId || !cardNumber || !nameOnCard || !expiryMonth || !expiryYear || !type || !cardType || !bankName || !billingAddress) {
    return res.status(400).json({
      status: 400,
      message: "Thiếu thông tin bắt buộc",
    });
  }

  const newPayment = new Payment({
    userId,
    cardNumber: cardNumber.slice(-4), // Lưu chỉ 4 số cuối
    nameOnCard,
    expiryMonth,
    expiryYear,
    isActive: true,
    type,
    cardType,
    bankName,
    billingAddress,
    image
  });

  await newPayment.save();
  return res.status(200).json({
    status: 200,
    message: "Thêm thẻ mới thành công",
    data: newPayment,
  });
});

// Lấy danh sách thẻ thanh toán của người dùng
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ userId });

    if (!payments.length) {
      return res.status(404).json({
        status: 404,
        message: "Không tìm thấy thông tin thanh toán cho người dùng này",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Lấy thông tin thẻ thành công",
      data: payments,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Đã xảy ra lỗi khi lấy thông tin thanh toán",
      error: error.message,
    });
  }
});

module.exports = router;
