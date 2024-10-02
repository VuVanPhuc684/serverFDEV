const mongoose = require("mongoose");

const Contact = new mongoose.Schema(
  {
   name:{type: String},
   email:{type: String},
   content:{type:String}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("contact", Contact);