const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
   name:{type:String},
   price:{type:String},
   description:{type:String},
   image:{type:String},
   type:{type:String}
  
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product", Product);