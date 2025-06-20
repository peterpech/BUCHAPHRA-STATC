const { createAuction } = require('../controllers/auctionController')
const Auction = require('../models/Auction')

async function testCreateAuction() {
  const req = { body: { tokenId:1, seller:'0x1', type:'auction', startPrice:0.5, endTime: new Date() } }
  const res = { json: (data) => { res.data = data } }
  await createAuction(req, res)
  if (res.data.tokenId !== 1) throw new Error('Auction not created')
  console.log('createAuction test passed')
}

testCreateAuction()
