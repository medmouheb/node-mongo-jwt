const mongoose = require("mongoose");

const Trash = mongoose.model(
  "Trash",
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
    status: Number,

  })
);

module.exports = Trash;