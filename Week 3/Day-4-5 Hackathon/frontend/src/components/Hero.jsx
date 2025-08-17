// src/components/Hero.jsx

import heroImg from "../assets/hero.jpg";

export default function Hero() {
  return (
    <div id="hero" className="w-full flex flex-col md:flex-row max-h-157 px-18">
      {/* This div contains the image. It is hidden on small screens and
          takes up half the width on medium screens and up. */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={heroImg}
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>

      {/* This div contains the text content. It takes full width on small screens
          and half the width on medium screens and up. */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-8 md:px-12 py-8">
        <div className="md:pl-5 lg:pl-15 xl:pl-20">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4 sm:mb-6 leading-snug font-prosto">
            Every day is unique, <br className="hidden sm:block" /> just like our tea
          </h1>
          <p className="text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus
            adipiscing odio. Neque lacus nibh eros in. <br className="hidden sm:block" />
            Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus
            adipiscing odio. Neque lacus nibh eros in.
          </p>
          <button className="bg-gray-900 text-white uppercase w-full max-w-xs py-3 tracking-wide">
            Browse Teas
          </button>
        </div>
      </div>
    </div>
  );
}