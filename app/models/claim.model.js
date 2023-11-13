const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: [
    {
      data: Buffer,
      contentType: String,
    },
  ],
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
