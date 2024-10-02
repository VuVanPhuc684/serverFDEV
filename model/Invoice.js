const { Types } = require("mongoose");
const mongoose = require("mongoose");

const Invoice = new mongoose.Schema(
  {
  userId:{type:String},
  totalPrice:{type:Number},
  dateExport:{type:String},
  paymentType:{type:String}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("invoice", Invoice);