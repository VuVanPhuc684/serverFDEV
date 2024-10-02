const mongoose = require("mongoose");

const Favourite = new mongoose.Schema(
  {
   userId:{type:String},
  productId:{type:String},
  
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("favourite", Favourite);