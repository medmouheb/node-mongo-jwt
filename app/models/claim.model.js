const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
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
  entityReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: function() {
        return this.entityType;
      }, 
  },
  entityType: String, 
});

const Claim = mongoose.model('Claim', claimSchema);

module.exports = Claim;
