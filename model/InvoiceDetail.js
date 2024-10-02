const { Types } = require("mongoose");
const mongoose = require("mongoose");

const InvoiceDetail = new mongoose.Schema(
  {
  invoiceId:{type:String},
  productId:{type:String},
  price:{type:Number},
  quantity:{type:String}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("invoicedetail", InvoiceDetail);