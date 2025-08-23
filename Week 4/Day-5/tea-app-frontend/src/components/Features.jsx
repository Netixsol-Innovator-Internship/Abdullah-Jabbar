// Features.jsx
import { Coffee, Gift, Truck, Tag } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="bg-[#F5F5F5] py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Feature Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Coffee className="w-6 h-6 text-gray-900" />
            <p className="text-sm font-medium">450+ KIND OF LOOSE TEA</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Gift className="w-6 h-6 text-gray-900" />
            <p className="text-sm font-medium">CERTIFICATED ORGANIC TEAS</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Truck className="w-6 h-6 text-gray-900" />
            <p className="text-sm font-medium">FREE DELIVERY</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Tag className="w-6 h-6 text-gray-900" />
            <p className="text-sm font-medium">SAMPLE FOR ALL TEAS</p>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-10">
          <button className="cursor-pointer border border-gray-900 px-8 py-2 text-sm uppercase tracking-wide ">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
