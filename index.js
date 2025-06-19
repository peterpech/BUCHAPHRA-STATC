const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const cors = require('cors');
require('dotenv').config();

const Amulet = require('./models/Amulet');

const authRoutes = require('./routes/auth'); // placeholder, not created yet
const amuletRoutes = require('./routes/amulets');
const metadataRoutes = require('./routes/metadata');

const app = express();
const port = process.env.PORT || 3001;
const mongoURI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());
let io;

app.get('/', (req, res) => res.send('Amulet API Server is running...'));
//app.use('/api/auth', authRoutes);
app.use('/api/amulets', amuletRoutes);
app.use('/api/metadata', metadataRoutes);

const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, walletAddress } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'มีผู้ใช้งานอีเมลนี้ในระบบแล้ว' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ username, email, password: hashedPassword, walletAddress });
    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ!', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
  } catch (err) {
    console.error('ERROR in /register route:', err);
    res.status(500).send('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์');
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(payload, jwtSecret, { expiresIn: 3600 }, (err, token) => {
      if (err) {
        console.error('JWT Signing Error:', err);
        return res.status(500).send('เกิดข้อผิดพลาดในการสร้าง Token');
      }
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์');
  }
});

const startServer = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
    const server = http.createServer(app);
    io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

    app.use((req, res, next) => {
      req.io = io;
      next();
    });

    io.on('connection', (socket) => {
      console.log('A user connected to Socket.IO');
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    server.listen(port, () => {
      console.log(`เซิร์ฟเวอร์กำลังทำงานที่ http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err.message);
    process.exit(1);
  }
};

cron.schedule('* * * * *', async () => {
  console.log('CRON: Checking for expired auctions...');
  try {
    const now = new Date();
    const expiredAuctions = await Amulet.find({ auctionStatus: 'active', auctionEndTime: { $lte: now } });
    if (expiredAuctions.length > 0) {
      console.log(`CRON: Found ${expiredAuctions.length} expired auctions to close.`);
      for (const amulet of expiredAuctions) {
        amulet.auctionStatus = 'finished';
        if (io) {
          io.emit('auction_finished', { amuletId: amulet._id, status: 'finished' });
        }
        await amulet.save();
        console.log(`CRON: Auction for amulet ID ${amulet._id} has been closed.`);
      }
    }
  } catch (err) {
    console.error('CRON Error:', err);
  }
});

startServer();
