// src/app/layout.tsx
// นี่คือไฟล์หลักสำหรับ layout ของ Next.js App Directory

import "./globals.css";
import { Inter } from "next/font/google";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
// import { WagmiConfig, createConfig } from 'wagmi'; // Uncomment if using wagmi
// import { mainnet, polygonAmoy } from 'wagmi/chains'; // Uncomment if using wagmi

const inter = Inter({ subsets: ["latin"] });

// ถ้าใช้ wagmi
// const config = createConfig({
//   chains: [mainnet, polygonAmoy], // เพิ่มเครือข่ายที่คุณต้องการรองรับ
//   // connectors: [
//   //   new MetaMaskConnector(), // หรือ connector อื่นๆ
//   // ],
//   // transports: {
//   //   [mainnet.id]: http(),
//   //   [polygonAmoy.id]: http('YOUR_AMOY_RPC_URL'), // **สำคัญ: เปลี่ยนเป็น RPC URL ของ Amoy**
//   // },
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <WagmiConfig config={config}> // Uncomment if using wagmi
      <NextAuthSessionProvider>
        <html lang="th">
          <body className={inter.className}>
            {/* Navbar หรือ Header ทั่วไป */}
            {children}
            {/* Footer ทั่วไป */}
          </body>
        </html>
      </NextAuthSessionProvider>
    // </WagmiConfig> // Uncomment if using wagmi
  );
}

// ตัวอย่าง src/app/page.tsx หรือ Components อื่นๆ ที่ต้องการเข้าถึงสถานะผู้ใช้
// import { useSession, signIn, signOut } from "next-auth/react";
//
// export default function HomePage() {
//   const { data: session, status } = useSession();
//
//   if (status === "loading") {
//     return <p>กำลังโหลด...</p>;
//   }
//
//   if (session) {
//     return (
//       <div>
//         <p>สวัสดี, {session.user?.email}</p>
//         <button onClick={() => signOut()}>ออกจากระบบ</button>
//       </div>
//     );
//   }
//   return (
//     <div>
//       <p>คุณยังไม่ได้เข้าสู่ระบบ</p>
//       <button onClick={() => signIn()}>เข้าสู่ระบบ</button>
//     </div>
//   );
// }
