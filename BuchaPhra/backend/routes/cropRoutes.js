const express = require('express')
const { createCrop } = require('../controllers/cropController')
const router = express.Router()

router.post('/crops', createCrop)

module.exports = router
