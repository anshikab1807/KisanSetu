"use client";

import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center bg-gradient-to-br from-green-50 via-green-100 to-green-200 text-green-900 text-center px-4 py-16 relative overflow-hidden">
      <div className="max-w-3xl mx-auto z-10">
        <span className="inline-block px-4 py-1.5 mb-4 text-xs sm:text-sm font-semibold tracking-wider text-green-800 uppercase bg-green-200/70 rounded-full">
          Connecting Farmers & Consumers
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-green-950">
          Fresh From Farm, <br className="hidden sm:inline" />
          <span className="text-green-700">To Your Table</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-green-800 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
          Support local farmers, eat healthy seasonal produce, and bring natural goodness straight into your home.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <Link
            to="/products"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-base sm:text-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Explore Fresh Products
          </Link>
          <Link
            to="/farmers"
            className="w-full sm:w-auto border-2 border-green-700 text-green-800 hover:bg-green-700 hover:text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-base sm:text-lg transition-all duration-300"
          >
            Meet Our Farmers
          </Link>
        </div>
      </div>

      {/* Bottom wave */}
      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none opacity-60"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#bbf7d0"
          fillOpacity="0.5"
          d="M0,64L48,90.7C96,117,192,171,288,197.3C384,224,480,224,576,218.7C672,213,768,203,864,197.3C960,192,1056,192,1152,186.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default HomePage;

