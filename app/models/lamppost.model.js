const mongoose = require("mongoose");

const Lamppost = mongoose.model(
  "Lamppost",
  new mongoose.Schema({
    address: {
        country:String,
        state:String,
        city:String,
        street:String,
        areaCode:String
    },
    longitude: Number,
    latitude:Number,
    isWorking: Boolean
  })
);

module.exports = Lamppost;