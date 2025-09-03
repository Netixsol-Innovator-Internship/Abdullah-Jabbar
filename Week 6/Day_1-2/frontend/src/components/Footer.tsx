import Link from "next/link";
import { Twitter, Facebook, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="max-w-360 mx-auto bg-[#F0F0F0] ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-35">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-black mb-4 block">
              SHOP.CO
            </Link>
            <p className="text-gray-600 text-sm mb-6">
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-black">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-black">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-black">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-black">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-medium text-black mb-4">COMPANY</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-black">
                  About
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-black">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/works" className="hover:text-black">
                  Works
                </Link>
              </li>
              <li>
                <Link href="/career" className="hover:text-black">
                  Career
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-medium text-black mb-4">HELP</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/support" className="hover:text-black">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-black">
                  Delivery Details
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-black">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* FAQ Links */}
          <div>
            <h3 className="font-medium text-black mb-4">FAQ</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/account" className="hover:text-black">
                  Account
                </Link>
              </li>
              <li>
                <Link href="/deliveries" className="hover:text-black">
                  Manage Deliveries
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-black">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/payments" className="hover:text-black">
                  Payments
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-medium text-black mb-4">RESOURCES</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/ebooks" className="hover:text-black">
                  Free eBooks
                </Link>
              </li>
              <li>
                <Link href="/tutorial" className="hover:text-black">
                  Development Tutorial
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-black">
                  How to - Blog
                </Link>
              </li>
              <li>
                <Link href="/playlist" className="hover:text-black">
                  Youtube Playlist
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            Shop.co © 2000-2023, All Rights Reserved
          </p>
          <div className="flex space-x-4">
            <div className="bg-white p-1 max-w-11.5 max-h-7.5  rounded-md">
              <img src="/payment/Visa.svg" alt="Visa" className="h-6" />
            </div>
            <div className="bg-white p-1 max-w-11.5 max-h-7.5  rounded-md">
              <img src="/payment/Mastercard.svg" alt="Visa" className="h-6" />
            </div>
            <div className="bg-white p-1 max-w-11.5 max-h-7.5  rounded-md">
              <img src="/payment/Paypal.svg" alt="Visa" className="h-6" />
            </div>
            <div className="bg-white p-1 max-w-11.5 max-h-7.5  rounded-md">
              <img src="/payment/ApplePay.svg" alt="Visa" className="h-6" />
            </div>
            <div className="bg-white p-1 max-w-11.5 max-h-7.5  rounded-md">
              <img src="/payment/GPay.svg" alt="Visa" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
