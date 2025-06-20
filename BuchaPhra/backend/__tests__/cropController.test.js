const { createCrop } = require('../controllers/cropController')
const Crop = require('../models/Crop')

async function testCreateCrop() {
  const req = { body: { image: 'path', x:0, y:0 } }
  const res = { json: (data) => { res.data = data } }
  await createCrop(req, res)
  if (res.data.image !== 'path') throw new Error('Crop not created')
  console.log('createCrop test passed')
}

testCreateCrop()
