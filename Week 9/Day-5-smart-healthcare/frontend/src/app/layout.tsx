import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";
import { ProductsProvider } from "../context/ProductsContext";
import { Toaster } from "react-hot-toast";
import Header from "../components/Header";

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
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main>{children}</main>
            </div>
            <Toaster position="top-right" />
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
