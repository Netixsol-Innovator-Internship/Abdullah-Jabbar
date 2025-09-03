import Link from "next/link"
import ProductCard from "@/components/ProductCard"
import { Star, Sparkles } from "lucide-react"

export default function HomePage() {
  const newArrivals = [
    {
      id: "1",
      name: "T-shirt with Tape Details",
      image: "/black-tshirt.png",
      price: 120,
      rating: 4.5,
      reviewCount: 45,
    },
    {
      id: "2",
      name: "Skinny Fit Jeans",
      image: "/blue-jeans.png",
      price: 240,
      originalPrice: 260,
      rating: 3.5,
      reviewCount: 32,
      discount: 20,
    },
    {
      id: "3",
      name: "Checkered Shirt",
      image: "/checkered-shirt.png",
      price: 180,
      rating: 4.5,
      reviewCount: 67,
    },
    {
      id: "4",
      name: "Sleeve Striped T-shirt",
      image: "/striped-tshirt.png",
      price: 130,
      originalPrice: 160,
      rating: 4.5,
      reviewCount: 89,
      discount: 30,
    },
  ]

  const topSelling = [
    {
      id: "5",
      name: "Vertical Striped Shirt",
      image: "/vertical-striped-shirt.png",
      price: 212,
      originalPrice: 232,
      rating: 5.0,
      reviewCount: 123,
      discount: 20,
    },
    {
      id: "6",
      name: "Courage Graphic T-shirt",
      image: "/orange-graphic-tshirt.png",
      price: 145,
      rating: 4.0,
      reviewCount: 78,
    },
    {
      id: "7",
      name: "Loose Fit Bermuda Shorts",
      image: "/bermuda-shorts.png",
      price: 80,
      rating: 3.0,
      reviewCount: 45,
    },
    {
      id: "8",
      name: "Faded Skinny Jeans",
      image: "/faded-jeans.png",
      price: 210,
      rating: 4.5,
      reviewCount: 156,
    },
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    },
    {
      name: "Alex K.",
      rating: 5,
      text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
    },
    {
      name: "James L.",
      rating: 5,
      text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6 leading-tight">
                FIND CLOTHES THAT MATCHES YOUR STYLE
              </h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Browse through our diverse range of meticulously crafted garments, designed to bring out your
                individuality and cater to your sense of style.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Shop Now
              </Link>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold text-black">200+</div>
                  <div className="text-gray-600">International Brands</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-black">2,000+</div>
                  <div className="text-gray-600">High-Quality Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-black">30,000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img src="/fashion-couple-hero.png" alt="Fashion couple" className="w-full h-auto rounded-lg" />
              <Sparkles className="absolute top-10 right-10 w-8 h-8 text-black" />
              <Sparkles className="absolute bottom-20 left-10 w-6 h-6 text-black" />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos */}
      <section className="bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between space-x-8 overflow-x-auto">
            <img src="/versace-logo.png" alt="Versace" className="h-8 opacity-80" />
            <img src="/zara-logo.png" alt="Zara" className="h-8 opacity-80" />
            <img src="/gucci-logo.png" alt="Gucci" className="h-8 opacity-80" />
            <img src="/prada-logo.png" alt="Prada" className="h-8 opacity-80" />
            <img src="/placeholder.svg?height=40&width=140" alt="Calvin Klein" className="h-8 opacity-80" />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black mb-12">NEW ARRIVALS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/new-arrivals"
              className="inline-block border border-gray-300 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Top Selling */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black mb-12">TOP SELLING</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topSelling.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/top-selling"
              className="inline-block border border-gray-300 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Dress Style */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black mb-12">BROWSE BY DRESS STYLE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/casual" className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-[4/3]">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Casual"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-6 left-6">
                <h3 className="text-2xl font-bold text-black">Casual</h3>
              </div>
            </Link>

            <Link href="/formal" className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-[4/3]">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Formal"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-6 left-6">
                <h3 className="text-2xl font-bold text-black">Formal</h3>
              </div>
            </Link>

            <Link href="/party" className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-[4/3]">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Party"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-6 left-6">
                <h3 className="text-2xl font-bold text-black">Party</h3>
              </div>
            </Link>

            <Link href="/gym" className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-[4/3]">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Gym"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-6 left-6">
                <h3 className="text-2xl font-bold text-black">Gym</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black mb-12">OUR HAPPY CUSTOMERS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{testimonial.text}</p>
                <p className="font-medium text-black">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
