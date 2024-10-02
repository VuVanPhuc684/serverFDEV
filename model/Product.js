const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
   userId:{type:String},
   name:{type:String},
   price:{type:Number},
   description:{type:String},
   image:{type:String},
   type:{type:String}
  
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product", Product);