const mongoose = require('mongoose');

const doctorchema = new mongoose.Schema({
    name: String,
    specialty : String,
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

const Doctor = mongoose.model('Doctor', doctorchema);

module.exports = Doctor;
