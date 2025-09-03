import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NewsletterSection from "@/components/NewsletterSection"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SHOP.CO - Find Clothes That Matches Your Style",
  description:
    "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <NewsletterSection />
        <Footer />
      </body>
    </html>
  )
}
