import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";
import { ProductsProvider } from "../context/ProductsContext";
import { ChatBotProvider } from "../context/ChatBotContext";
import { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import ChatBot from "../components/ChatBot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Healthcare Web App",
  description: "AI-enhanced healthcare product browsing and recommendations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProductsProvider>
            <ChatBotProvider>
              <div className=" bg-gray-50">
                <Header />
                <main>{children}</main>
              </div>
              <ChatBot />
              <Toaster position="top-right" />
            </ChatBotProvider>
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
