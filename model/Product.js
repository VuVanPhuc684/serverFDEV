const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
    id:{type:String},
   userId:{type:String},
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