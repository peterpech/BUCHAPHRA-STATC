const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');

const auth = require('../middleware/auth');
const Amulet = require('../models/Amulet');
const User = require('../models/User');
const amuletNFTJson = require('../contracts/AmuletNFT.json');
const amuletNFTAbi = amuletNFTJson.abi;

const amoyRpcUrl = process.env.AMOY_RPC_URL;
const walletPrivateKey = process.env.PRIVATE_KEY;
const nftContractAddress = process.env.NFT_CONTRACT_ADDRESS;

router.get('/', async (req, res) => {
  try {
    const amulets = await Amulet.find({}).populate('owner', ['username', 'email']);
    res.json(amulets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const amulet = await Amulet.findById(req.params.id).populate('owner', ['username', 'email']);
    if (!amulet) return res.status(404).json({ message: 'ไม่พบพระเครื่องที่ระบุ' });
    res.json(amulet);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'ไม่พบพระเครื่องที่ระบุ (ID ไม่ถูกต้อง)' });
    res.status(500).send('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์');
  }
});

router.post('/', auth, async (req, res) => {
  const { name, description, imageURL, isAuction, fixedPrice, startingPrice, auctionEndTime } = req.body;
  try {
    const newAmulet = new Amulet({
      name,
      description,
      imageURL,
      owner: req.user.id,
      isAuction,
      fixedPrice,
      startingPrice,
      currentPrice: startingPrice,
      auctionEndTime,
      auctionStatus: isAuction ? 'active' : 'pending',
    });
    const amulet = await newAmulet.save();
    res.status(201).json(amulet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์');
  }
});

router.put('/:id', auth, async (req, res) => {
  const { name, description, imageURL, price } = req.body;
  const amuletFields = {};
  if (name) amuletFields.name = name;
  if (description) amuletFields.description = description;
  if (imageURL) amuletFields.imageURL = imageURL;
  if (price !== undefined) amuletFields.fixedPrice = price;
  try {
    let amulet = await Amulet.findById(req.params.id);
    if (!amulet) return res.status(404).json({ message: 'ไม่พบพระเครื่องที่ระบุ' });
    if (amulet.owner.toString() !== req.user.id) return res.status(401).json({ message: 'คุณไม่ใช่เจ้าของ ไม่มีสิทธิ์แก้ไข' });
    amulet = await Amulet.findByIdAndUpdate(req.params.id, { $set: amuletFields }, { new: true });
    res.json(amulet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const amulet = await Amulet.findById(req.params.id);
    if (!amulet) return res.status(404).json({ message: 'ไม่พบพระเครื่องที่ระบุ' });
    if (amulet.owner.toString() !== req.user.id) return res.status(401).json({ message: 'คุณไม่ใช่เจ้าของ ไม่มีสิทธิ์ลบ' });
    await Amulet.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบพระเครื่องสำเร็จ' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'ไม่พบพระเครื่องที่ระบุ (ID ไม่ถูกต้อง)' });
    res.status(500).send('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์');
  }
});

router.post('/:id/bids', auth, async (req, res) => {
  const { amount } = req.body;
  try {
    const amulet = await Amulet.findById(req.params.id);
    if (!amulet || !amulet.isAuction || amulet.auctionStatus !== 'active') {
      return res.status(400).json({ message: 'ไม่สามารถประมูลพระเครื่องชิ้นนี้ได้ในขณะนี้' });
    }
    if (amount <= amulet.currentPrice) return res.status(400).json({ message: 'ราคาที่เสนอต้องสูงกว่าราคาปัจจุบัน' });
    if (amulet.owner.toString() === req.user.id) return res.status(403).json({ message: 'คุณไม่สามารถประมูลสินค้าของตัวเองได้' });
    const newBid = { bidder: req.user.id, amount, timestamp: new Date() };
    amulet.bids.push(newBid);
    amulet.highestBidder = req.user.id;
    amulet.currentPrice = amount;
    await amulet.save();
    const populatedAmulet = await Amulet.findById(amulet.id).populate('highestBidder', 'username');
    req.io.emit('new_bid', populatedAmulet);
    res.json(amulet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์');
  }
});

router.post('/:id/mint', auth, async (req, res) => {
  try {
    const amulet = await Amulet.findById(req.params.id);
    if (!amulet) return res.status(404).json({ message: 'ไม่พบพระเครื่อง' });
    if (amulet.owner.toString() !== req.user.id) return res.status(401).json({ message: 'คุณไม่ใช่เจ้าของ' });
    if (amulet.isMinted) return res.status(400).json({ message: 'พระเครื่องชิ้นนี้ถูก Mint เป็น NFT ไปแล้ว' });

    const user = await User.findById(req.user.id);
    if (!user || !user.walletAddress) {
      return res.status(400).json({ message: 'ไม่พบที่อยู่กระเป๋าเงิน (Wallet Address) ของคุณ กรุณาอัปเดตในโปรไฟล์' });
    }
    if (!ethers.isAddress(user.walletAddress)) {
      return res.status(400).json({ message: 'รูปแบบ Wallet Address ไม่ถูกต้อง' });
    }

    const provider = new ethers.JsonRpcProvider(amoyRpcUrl);
    const wallet = new ethers.Wallet(walletPrivateKey, provider);
    const amuletNFTContract = new ethers.Contract(nftContractAddress, amuletNFTAbi, wallet);

    const tokenURI = `http://localhost:${process.env.PORT || 3001}/api/metadata/${amulet.id}`;

    console.log(`Minting NFT for amulet: ${amulet.name} to address: ${user.walletAddress}`);

    const tx = await amuletNFTContract.safeMint(user.walletAddress, tokenURI);
    await tx.wait();

    console.log('Transaction confirmed! Hash:', tx.hash);

    amulet.isMinted = true;
    amulet.nftData = {
      contractAddress: nftContractAddress,
      transactionHash: tx.hash,
    };
    await amulet.save();

    res.json({ message: 'Minting successful!', transactionHash: tx.hash, amulet });
  } catch (err) {
    console.error('Minting Error:', err);
    res.status(500).send('เกิดข้อผิดพลาดระหว่างการ Mint NFT');
  }
});

module.exports = router;
