// file: app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import Header from "@components/Header";

export const metadata: Metadata = {
  title: "Crypto Price Tracker",
  description: "Next.js + RTK Query crypto prices with CoinGecko proxy",
  icons: { icon: "/favicon.ico" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1 container container-max px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
