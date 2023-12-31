const mongoose = require("mongoose");

const Lamppost = mongoose.model(
  "Lamppost",
  new mongoose.Schema({
    name:String,
    address: {
        country:String,
        state:String,
        city:String,
        street:String,
        areaCode:String
    },
    longitude: Number,
    latitude:Number,
    status: String
  })
);

module.exports = Lamppost;