import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ReviewsSlider from "@/components/ReviewsSlider";

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
  ];

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
  ];


  return (
    <div className="max-w-360 mx-auto">
      {/* Hero Section */}
      <section className=" bg-[#F2F0F1]">
        <div className="  px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6 ">
                FIND CLOTHES THAT MATCHES YOUR STYLE
              </h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Browse through our diverse range of meticulously crafted
                garments, designed to bring out your individuality and cater to
                your sense of style.
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
              <img
                src="/hero.jpg"
                alt="Fashion couple"
                className="rounded-lg object-cover"
              />
              <img
                src="/star.svg"
                className="absolute top-25 right-6 w-24 h-24 text-black"
              />
              <img
                src="/star.svg"
                className="absolute top-70 left-2 w-14 h-14 text-black"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos */}
      <section className="bg-black py-8">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between space-x-8 overflow-x-auto">
            <img
              src="/versace-logo.png"
              alt="Versace"
              className="h-8 opacity-80"
            />
            <img src="/zara-logo.png" alt="Zara" className="h-8 opacity-80" />
            <img src="/gucci-logo.png" alt="Gucci" className="h-8 opacity-80" />
            <img src="/prada-logo.png" alt="Prada" className="h-8 opacity-80" />
            <img
              src="/placeholder.svg?height=40&width=140"
              alt="Calvin Klein"
              className="h-8 opacity-80"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            NEW ARRIVALS
          </h2>
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
      <section className="py-16 ">
        <div className=" px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            TOP SELLING
          </h2>
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

      <section className="relative mx-auto bg-[#F0F0F0] rounded-[48px] md:rounded-[64px] py-14 md:py-16 px-4 sm:px-6 lg:px-16">
        <h2 className="text-center font-extrabold uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl mb-12">
          Browse By Dress Style
        </h2>

        <div className="grid grid-cols-12 gap-6 md:gap-7">
          {/* Casual */}
          <Link
            href="/casual"
            aria-label="Browse Casual styles"
            className="group relative col-span-12 md:col-span-4 rounded-3xl overflow-hidden isolate bg-white shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-black/10 h-[220px] sm:h-[250px] md:h-[260px] lg:h-[300px]"
          >
            <img
              src="/browse/casual.png"
              alt="Casual"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-transform duration-500 group-hover:scale-105"
            />

            <div className="relative z-10 p-6 flex items-start">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Casual
              </h3>
            </div>
          </Link>

          {/* Formal */}
          <Link
            href="/formal"
            aria-label="Browse Formal styles"
            className="group relative col-span-12 md:col-span-8 rounded-3xl overflow-hidden isolate bg-white shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-black/10 h-[220px] sm:h-[250px] md:h-[260px] lg:h-[300px]"
          >
            <img
              src="/browse/formal.png"
              alt="Formal"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-[20%_center] transition-transform duration-500 group-hover:scale-105"
            />

            <div className="relative z-10 p-6 flex items-start">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Formal
              </h3>
            </div>
          </Link>

          {/* Party */}
          <Link
            href="/party"
            aria-label="Browse Party styles"
            className="group relative col-span-12 md:col-span-8 rounded-3xl overflow-hidden isolate bg-white shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-black/10 h-[220px] sm:h-[250px] md:h-[260px] lg:h-[300px]"
          >
            <img
              src="/browse/party.png"
              alt="Party"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="relative z-10 p-6 flex items-start">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Party
              </h3>
            </div>
          </Link>

          {/* Gym */}
          <Link
            href="/gym"
            aria-label="Browse Gym styles"
            className="group relative col-span-12 md:col-span-4 rounded-3xl overflow-hidden isolate bg-white shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-black/10 h-[220px] sm:h-[250px] md:h-[260px] lg:h-[300px]"
          >
            <img
              src="/browse/gym.png"
              alt="Gym"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="relative z-10 p-6 flex items-start">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Gym
              </h3>
            </div>
          </Link>
        </div>
      </section>

    <ReviewsSlider />
    </div>
  );
}
