const mongoose = require('mongoose');

const organisationchema = new mongoose.Schema({
  name: String,
  description: String,
  images: {
    type: [String],
    default: [],
  },
  address: {
    country: String,
    state: String,
    city: String,
    street: String,
    areaCode: String
  },
  longitude: Number,
  latitude: Number,
});

const Organisation = mongoose.model('Organisation', organisationchema);

module.exports = Organisation;
