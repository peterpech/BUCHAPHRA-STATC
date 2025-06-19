const mongoose = require('mongoose');

const AmuletSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageURL: String,
  owner: {
    username: String,
  },
  isAuction: Boolean,
  currentPrice: Number,
});

module.exports = mongoose.models.Amulet || mongoose.model('Amulet', AmuletSchema);
