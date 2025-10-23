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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body>
        <ReduxProvider>
          <WalletProvider>
            <I18nProvider>
              <ThemeProvider>
                <TokenDataLoader>
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-1 max-w-[1400px] w-full mx-auto p-8">
                      {children}
                    </main>
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
