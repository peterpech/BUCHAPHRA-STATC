const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BidSchema = new Schema({
  bidder: { type: Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  timestamp: Date,
});

const AmuletSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageURL: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  isAuction: { type: Boolean, default: false },
  fixedPrice: { type: Number },
  startingPrice: { type: Number },
  currentPrice: { type: Number },
  auctionEndTime: { type: Date },
  auctionStatus: { type: String, default: 'pending' },
  highestBidder: { type: Schema.Types.ObjectId, ref: 'User' },
  bids: [BidSchema],
  isMinted: { type: Boolean, default: false },
  nftData: {
    contractAddress: String,
    transactionHash: String,
  },
});

module.exports = mongoose.model('Amulet', AmuletSchema);
