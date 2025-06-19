const express = require('express');
const router = express.Router();
const Amulet = require('../models/Amulet');

router.get('/:id', async (req, res) => {
  try {
    const amulet = await Amulet.findById(req.params.id);
    if (!amulet) {
      return res.status(404).json({ message: 'Amulet not found' });
    }
    const metadata = {
      name: amulet.name,
      description: amulet.description,
      image: amulet.imageURL,
      attributes: [
        {
          trait_type: 'Minted Status',
          value: amulet.isMinted ? 'Minted' : 'Not Minted',
        },
        {
          trait_type: 'Type',
          value: amulet.isAuction ? 'Auction' : 'Fixed Price',
        },
      ],
    };
    res.json(metadata);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Amulet not found (Invalid ID)' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
