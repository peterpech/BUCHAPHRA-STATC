# BuchaPhra NFT Marketplace

A monorepo containing a Next.js frontend and a lightweight Express-style backend.
Mock data resides in the `mock` folder.

## Setup

### Frontend
```
cd frontend && npm install && npm run dev
```

### Backend
```
cd backend && npm install
export MONGO_URI=your_mongo
npm run dev
```

## Folder Structure
- frontend/ — Next.js App Router
- backend/ — Express + MongoDB API
- mock/ — sample data JSON

## CI
GitHub Actions รัน tests ทั้ง FE และ BE

## Features
- Auction, Bids (Web3), Crop, Price Chart (Recharts), Logistics UI
- Custom Web3 hook `useWeb3Auction`
- Order and PriceHistory models with example routes
