import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "onoS Bot Dashboard - Control Panel & Settings",
  description: "Web Dashboard resmi untuk mengatur musik, moderasi, AutoMod, dan sambutan bot onoS."
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#0b0b0e] text-[#ededed]">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-[#1f1f26] py-6 text-center text-xs text-neutral-500 bg-[#0b0b0e]">
          &copy; {new Date().getFullYear()} onoS Bot • Multi-system Music & Moderation Suite. Hosted with Next.js & Vercel.
        </footer>
      </body>
    </html>
  );
}
