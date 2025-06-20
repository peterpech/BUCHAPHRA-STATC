const Auction = require('../models/Auction')

async function createAuction(req, res) {
  const auction = await Auction.create(req.body)
  res.json(auction)
}

async function bidAuction(req, res) {
  res.json({ tokenId: req.params.id, bid: req.body.bid })
}

module.exports = { createAuction, bidAuction }
