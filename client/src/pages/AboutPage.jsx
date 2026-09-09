"use client";

import { FaLeaf, FaUsers, FaHandshake, FaShoppingBasket, FaCheck } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="font-poppins relative bg-gradient-to-br from-green-50 via-green-100 to-green-200 text-green-900 overflow-x-hidden">

      {/* Floating decorative leaves */}
      <div className="absolute top-10 left-10 text-3xl opacity-10 animate-bounce pointer-events-none">🍃</div>
      <div className="absolute bottom-20 right-20 text-4xl opacity-10 animate-bounce-slow pointer-events-none">🌾</div>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 md:px-20">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 text-green-800 drop-shadow-lg">
          Welcome to <span className="text-yellow-500">KisanSetu</span>
        </h1>
        <p className="text-2xl md:text-3xl text-green-700 mb-6">
          Fresh Produce. Direct from Local Farmers.
        </p>
        <p className="text-lg md:text-xl text-green-800 mb-10 max-w-3xl">
          Discover organic fruits, vegetables, and farm products. Support your local farmers and enjoy the freshest seasonal produce.
        </p>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-4 md:px-20 bg-green-100 rounded-3xl mx-4 md:mx-20 shadow-lg relative z-10">
        <h2 className="text-5xl font-extrabold text-green-800 text-center mb-8">
          Our Mission
        </h2>
        <p className="text-2xl text-green-700 text-center max-w-4xl mx-auto">
          At KisanSetu, we connect you with local farmers to enjoy the freshest produce.
          Every purchase supports local agriculture and promotes sustainable farming practices.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 md:px-20 relative z-10">
        <h2 className="text-5xl font-extrabold text-center mb-16 text-green-800">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: <FaUsers className="text-green-600 text-4xl" />, title: "Connect", desc: "Farmers create profiles showcasing their farms, growing practices, and available produce. Consumers browse and discover local farms in their area." },
            { icon: <FaShoppingBasket className="text-green-600 text-4xl" />, title: "Order", desc: "Consumers browse available products, select items, and place orders directly with farmers. Choose between pickup or delivery options." },
            { icon: <FaHandshake className="text-green-600 text-4xl" />, title: "Enjoy", desc: "Receive fresh, locally grown produce directly from farmers. Build relationships with the people who grow your food and support your local economy." },
          ].map((step, i) => (
            <div key={i} className="glass p-8 rounded-3xl text-center shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-green-800">{step.title}</h3>
              <p className="text-green-700">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 md:px-20 bg-green-50 rounded-3xl mx-4 md:mx-20 shadow-lg relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-green-800">
          Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="glass p-8 rounded-3xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-green-800">For Consumers</h3>
            <ul className="space-y-3 text-green-700">
              <li className="flex items-start"><FaCheck className="text-green-600 mt-1 mr-2" />Access to fresher, more nutritious produce</li>
              <li className="flex items-start"><FaCheck className="text-green-600 mt-1 mr-2" />Knowledge about where your food comes from and how it's grown</li>
              <li className="flex items-start"><FaCheck className="text-green-600 mt-1 mr-2" />Support for local economy and sustainable farming practices</li>
              <li className="flex items-start"><FaCheck className="text-green-600 mt-1 mr-2" />Reduced environmental impact from shorter supply chains</li>
              <li className="flex items-start"><FaCheck className="text-green-600 mt-1 mr-2" />Direct communication with farmers</li>
            </ul>
          </div>
          <div className="glass p-8 rounded-3xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-green-800">For Farmers</h3>
            <ul className="space-y-3 text-green-700">
              <li className="flex items-start"><FaCheck className="text-green-600 mt-1 mr-2" />Higher profit margins by selling directly to consumers</li>
              <li className="flex items-start"><FaCheck className="text-green-600 mt-1 mr-2" />Stable local market for products</li>
              <li className="flex items-start"><FaCheck className="text-green-600 mt-1 mr-2" />Reduced waste through better demand planning</li>
              <li className="flex items-start"><FaCheck className="text-green-600 mt-1 mr-2" />Opportunity to showcase sustainable farming practices</li>
              <li className="flex items-start"><FaCheck className="text-green-600 mt-1 mr-2" />Direct feedback from customers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom decorative wave */}
      <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 320">
        <path
          fill="#d1fae5"
          fillOpacity="1"
          d="M0,64L48,90.7C96,117,192,171,288,197.3C384,224,480,224,576,218.7C672,213,768,203,864,197.3C960,192,1056,192,1152,186.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default AboutPage;
