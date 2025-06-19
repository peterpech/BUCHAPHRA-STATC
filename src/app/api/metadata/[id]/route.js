import mongoose from 'mongoose';
import Amulet from '@/models/amulet';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amuletdb';

if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGODB_URI).catch(err => {
    console.error('MongoDB connection error:', err);
  });
}

export async function GET(request, { params }) {
  try {
    const amulet = await Amulet.findById(params.id).lean();
    if (!amulet) {
      return new Response(JSON.stringify({ message: 'ไม่พบพระเครื่องสำหรับ Metadata นี้' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const nftMetadata = {
      name: amulet.name,
      description: amulet.description,
      image: amulet.imageURL,
      external_url: `https://buchaphra.com/amulets/${amulet._id}`,
      attributes: [
        {
          trait_type: 'Owner',
          value: amulet.owner.username,
        },
        {
          trait_type: 'Is Auction',
          value: amulet.isAuction ? 'Yes' : 'No',
        },
        {
          trait_type: 'Current Price',
          value: amulet.currentPrice,
        },
      ],
    };

    return new Response(JSON.stringify(nftMetadata), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('ERROR in /metadata/:id route:', err);
    return new Response('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์', { status: 500 });
  }
}
