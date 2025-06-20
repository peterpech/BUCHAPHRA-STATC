const express = require('express')
const { createAuction, bidAuction } = require('../controllers/auctionController')
const router = express.Router()

router.post('/auctions', createAuction)
router.post('/auctions/:id/bid', bidAuction)

module.exports = router
