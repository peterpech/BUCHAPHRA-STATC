const Crop = require('../models/Crop')

async function createCrop(req, res) {
  const crop = await Crop.create(req.body)
  res.json(crop)
}

module.exports = { createCrop }
