
import "./globals.css";
import type { Metadata } from "next";

import Navbar from "../components/NavBar";
import Footer from "../components/Footer";


export const metadata: Metadata = {
  title: "Epic Games",
  description: "Epic Games style landing page built with Next.js + Zustand",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-zinc-900">
        <Navbar />
        <main>{children}</main>
      <Footer/>
      </body>
    </html>
  );
}
