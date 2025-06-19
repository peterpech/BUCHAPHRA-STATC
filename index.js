const express = require('express');
const mongoose = require('mongoose');
const Amulet = require('./models/amulet');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amuletdb';

mongoose.connect(MONGODB_URI).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// ===============================================
// API ROUTE FOR NFT METADATA
// ===============================================
app.get('/metadata/:id', async (req, res) => {
  try {
    const amulet = await Amulet.findById(req.params.id);
    if (!amulet) {
      return res.status(404).json({ message: 'ไม่พบพระเครื่องสำหรับ Metadata นี้' });
    }

    const nftMetadata = {
      name: amulet.name,
      description: amulet.description,
      image: amulet.imageURL,
      external_url: `https://buchaphra.com/amulets/${amulet._id}`,
      attributes: [
        {
          trait_type: 'Owner',
          value: amulet.owner.username,
        },
        {
          trait_type: 'Is Auction',
          value: amulet.isAuction ? 'Yes' : 'No',
        },
        {
          trait_type: 'Current Price',
          value: amulet.currentPrice,
        },
      ],
    };

    res.json(nftMetadata);
  } catch (err) {
    console.error('ERROR in /metadata/:id route:', err);
    res.status(500).send('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
