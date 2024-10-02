const mongoose = require("mongoose");

const Payment = new mongoose.Schema(
  {
   userId:{type:String},
   expiryDate:{type:String},
   cvv:{type:Number},
   isSelected:{type:Boolean},
   type:{type:String},
   bankName:{type:String},
   image:{type:String}
  
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("payment", Payment);