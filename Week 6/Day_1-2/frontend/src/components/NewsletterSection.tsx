export default function NewsletterSection() {
  return (
    <section className="max-w-310  mx-auto bg-black text-white py-12 rounded-3xl translate-y-25">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">STAY UPTO DATE ABOUT</h2>
            <h2 className="text-3xl md:text-4xl font-bold">OUR LATEST OFFERS</h2>
          </div>
          <div className="w-full md:w-auto">
            <div className="flex flex-col space-y-4 md:w-80">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-4 py-3 rounded-full text-black bg-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
