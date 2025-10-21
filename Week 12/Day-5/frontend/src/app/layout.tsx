import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import { ReduxProvider } from "@/store/ReduxProvider";
import { TokenDataLoader } from "@/components/TokenDataLoader";
import { I18nProvider } from "@/i18n/i18nContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Planer's Mint",
  description:
    "Complete DeFi + NFT platform with token swaps, NFT marketplace, and multi-token payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <WalletProvider>
            <I18nProvider>
              <ThemeProvider>
                <TokenDataLoader>
                  <div className="App">
                    <Navbar />
                    <main className="main-content">{children}</main>
                    <Footer />
                  </div>
                </TokenDataLoader>
              </ThemeProvider>
            </I18nProvider>
          </WalletProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
