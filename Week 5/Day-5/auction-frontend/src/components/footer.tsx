import Link from "next/link";
import {
  Car,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#4A5FBF] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/car-deposit%20Logo.png"
                alt="Car Deposit logo"
                className="object-contain"
              />
            </Link>

            <p className="text-sm text-blue-200 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin
              turpis pretium donec orci semper. Sit suscipit lacus cras commodo
              in lectus sed egestas. Mattis egestas sit viverra pretium
              tincidunt libero. Suspendisse aliquam donec leo nisl purus et quam
              pulvinar. Odio egestas egestas tristique et lectus viverra in sed
              mauris.
            </p>

            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <Facebook className="w-5 h-5 text-blue-200 hover:text-white cursor-pointer" />
                <Instagram className="w-5 h-5 text-blue-200 hover:text-white cursor-pointer" />
                <Linkedin className="w-5 h-5 text-blue-200 hover:text-white cursor-pointer" />
                <Twitter className="w-5 h-5 text-blue-200 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Link href="/" className="block text-blue-200 hover:text-white">
                Home
              </Link>
              <Link
                href="/help-center"
                className="block text-blue-200 hover:text-white"
              >
                Help Center
              </Link>
              <Link
                href="/faq"
                className="block text-blue-200 hover:text-white"
              >
                FAQ
              </Link>
              <Link
                href="/my-account"
                className="block text-blue-200 hover:text-white"
              >
                My Account
              </Link>
              <Link
                href="/my-account"
                className="block text-blue-200 hover:text-white"
              >
                My Account
              </Link>
            </div>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Link
                href="/car-auction"
                className="block text-blue-200 hover:text-white"
              >
                Car Auction
              </Link>
              <Link
                href="/help-center"
                className="block text-blue-200 hover:text-white"
              >
                Help Center
              </Link>
              <Link
                href="/faq"
                className="block text-blue-200 hover:text-white"
              >
                FAQ
              </Link>
              <Link
                href="/my-account"
                className="block text-blue-200 hover:text-white"
              >
                My Account
              </Link>
              <Link
                href="/my-account"
                className="block text-blue-200 hover:text-white"
              >
                My Account
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Link
                href="/about"
                className="block text-blue-200 hover:text-white"
              >
                About us
              </Link>
            </div>

            <div className="space-y-3 flex gap-2">
              <svg
                width="17"
                height="176"
                viewBox="0 0 17 176"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8.5" cy="8.5" r="8.5" fill="white" />
                <circle cx="8.5" cy="86.5" r="8.5" fill="white" />
                <circle cx="8.5" cy="167.5" r="8.5" fill="white" />
                <path d="M9 16V78" stroke="white" strokeWidth="3" />
                <path d="M9 92L9 159" stroke="white" strokeWidth="3" />
              </svg>

              <div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-200">Hot Line Number</p>
                    <p className="font-medium">+054 211 4444</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-200">Email Id :</p>
                    <p className="font-medium">info@cardeposit.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-200 mt-1" />
                  <div>
                    <p className="text-sm text-blue-200">
                      Office No 6, SKB Plaza next to Bentley showroom,
                    </p>
                    <p className="text-sm text-blue-200">
                      Umm Al Sheif Street, Sheikh Zayed Road, Dubai, UAE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-400 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-blue-200">
            Copyright 2022 All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
