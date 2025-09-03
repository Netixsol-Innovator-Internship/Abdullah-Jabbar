import type { Metadata } from "next";
import "../styles/globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Auction App",
  description: "Created by Abdullah Jabbar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="max-w-360 mx-auto">
        <div className="flex flex-col">
          <Header />
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
