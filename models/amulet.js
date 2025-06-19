import mongoose from 'mongoose';

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

export default mongoose.models.Amulet || mongoose.model('Amulet', AmuletSchema);
