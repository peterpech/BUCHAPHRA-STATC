# Amulet-NFT Marketplace API

โปรเจกต์นี้คือ Backend API สำหรับแพลตฟอร์มซื้อขายและประมูลพระเครื่องในรูปแบบ NFT สร้างด้วย Node.js, Express, และ MongoDB พร้อมระบบ Real-time Bidding และการ Mint NFT บน Polygon (Amoy Testnet)

## คุณสมบัติ (Features)

- **Authentication:** สมัครสมาชิกและเข้าสู่ระบบด้วย JWT (JSON Web Tokens)
- **Amulet Management:** สร้าง, อ่าน, อัปเดต, ลบ (CRUD) ข้อมูลพระเครื่อง
- **Auction System:** ระบบประมูลตามเวลาจริง พร้อมการแจ้งเตือนด้วย Socket.IO
- **NFT Minting:** สามารถ Mint พระเครื่องให้กลายเป็น NFT บน Blockchain (Polygon Amoy) ได้
- **NFT Metadata:** มี Endpoint สำหรับ `tokenURI` ตามมาตรฐาน ERC721
- **Scheduled Jobs:** ตรวจสอบและปิดการประมูลที่หมดเวลาแล้วโดยอัตโนมัติด้วย `node-cron`

## เทคโนโลยีที่ใช้

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.IO
- **Authentication:** bcrypt.js, JSON Web Token
- **Blockchain Interaction:** Ethers.js
- **Smart Contract:** Solidity, Hardhat

## การติดตั้งและเริ่มใช้งาน (Setup & Installation)

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd amulet-nft-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   คัดลอกไฟล์ `.env.example` แล้วสร้างไฟล์ใหม่ชื่อ `.env`
   ```bash
   cp .env.example .env
   ```
   จากนั้นเข้าไปแก้ไขค่าต่างๆ ในไฟล์ `.env` ให้ถูกต้อง
   - `MONGO_URI`: Connection string ของ MongoDB
   - `JWT_SECRET`: Secret key สำหรับสร้าง Token
   - `AMOY_RPC_URL`: URL ของ RPC Node สำหรับ Polygon Amoy
   - `PRIVATE_KEY`: Private Key ของ Wallet ที่จะใช้เป็นผู้จ่าย Gas Fee ในการ Mint
   - `NFT_CONTRACT_ADDRESS`: Address ของ Smart Contract ที่ Deploy แล้ว

4. **Run the application:**

   - **Development Mode (ใช้ `nodemon` เพื่อ auto-reload):**
     ```bash
     npm run dev
     ```

   - **Production Mode:**
     ```bash
     npm start
     ```

   เซิร์ฟเวอร์จะเริ่มทำงานที่ `http://localhost:3001` (หรือ Port ที่คุณตั้งค่าไว้)

## รายการ API Endpoints

### Authentication

- `POST /api/auth/register` : สมัครสมาชิก
- `POST /api/auth/login` : เข้าสู่ระบบ

### Amulets

- `GET /api/amulets` : ดูรายการพระเครื่องทั้งหมด
- `GET /api/amulets/:id` : ดูรายละเอียดพระเครื่อง 1 ชิ้น
- `POST /api/amulets` : เพิ่มพระเครื่องใหม่ (ต้องใช้ Token)
- `PUT /api/amulets/:id` : แก้ไขข้อมูลพระเครื่อง (ต้องใช้ Token และเป็นเจ้าของ)
- `DELETE /api/amulets/:id` : ลบพระเครื่อง (ต้องใช้ Token และเป็นเจ้าของ)

### Bidding

- `POST /api/amulets/:id/bids` : เสนอราคาประมูล (ต้องใช้ Token)

### NFT

- `POST /api/amulets/:id/mint` : Mint พระเครื่องเป็น NFT (ต้องใช้ Token และเป็นเจ้าของ)

### Metadata

- `GET /api/metadata/:id` : ดึงข้อมูล Metadata สำหรับ `tokenURI`
