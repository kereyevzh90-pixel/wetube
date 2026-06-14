import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import SessionProvider from "@/components/SessionProvider";

const roboto = Roboto({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "WeTube",
  description: "Смотри и загружай видео",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <body className={`${roboto.className} bg-[#0f0f0f] text-white min-h-full overflow-x-hidden`}>
        <SessionProvider>
          <AppShell>{children}</AppShell>
        </SessionProvider>
      </body>
    </html>
  );
}
