// model/Payment.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    cardNumber: { type: String, required: true },
    nameOnCard: { type: String, required: true },
    expiryMonth: { type: Number, required: true },
    expiryYear: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    type: { type: String, required: true },
    cardType: { type: String, required: true },
    bankName: { type: String, required: true },
    billingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    image: { type: String }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", PaymentSchema);
