const express = require('express'), mongoose = require('mongoose'), auctionRoutes = require('./routes/auctionRoutes'), cropRoutes = require('./routes/cropRoutes')
require('dotenv').config()
const app = express()
app.use(express.json())
mongoose.connect(process.env.MONGO_URI || '')
app.use('/api', auctionRoutes)
app.use('/api', cropRoutes)
app.get('/health', (req, res) => res.json({ status: 'ok' }))
module.exports = app
