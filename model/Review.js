const mongoose = require("mongoose");

const Review = new mongoose.Schema(
  {
   productId:{type:String},
   userId:{type:String},
   rate:{type:Number},
   comment:{type:String},
   time:{type:String},
  
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("review", Review);