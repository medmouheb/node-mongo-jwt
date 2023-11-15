const mongoose = require('mongoose');

const gasStationchema = new mongoose.Schema({
    name: String,
    description: String,
    images: {
    type: [String], 
    default: [],    
  },
  address: {
    country:String,
    state:String,
    city:String,
    street:String,
    areaCode:String
},

});

const GasStation = mongoose.model('GasStation', gasStationchema);

module.exports = GasStation;
