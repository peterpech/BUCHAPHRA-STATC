const hre = require("hardhat");

async function main() {
  // ตรวจสอบให้แน่ใจว่าได้เปลี่ยนชื่อ Contract ของคุณตามที่ถูกต้อง
  const AmuletNFT = await hre.ethers.getContractFactory("AmuletNFT");
  // initialOwner คือ address ของ deployer หรือ address ที่คุณต้องการให้เป็นเจ้าของสัญญา
  const initialOwner = process.env.WALLET_ADDRESS_FOR_OWNERSHIP;
  const amuletNFT = await AmuletNFT.deploy(initialOwner);

  await amuletNFT.waitForDeployment();

  console.log(`AmuletNFT deployed to ${amuletNFT.target}`);

  // บันทึก Contract Address ลงใน .env ของ Backend และ Frontend
  // console.log(`Please add this to your backend .env: NFT_CONTRACT_ADDRESS=${amuletNFT.target}`);
  // console.log(`Please add this to your frontend .env: NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${amuletNFT.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
