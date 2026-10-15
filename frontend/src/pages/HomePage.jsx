import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 sm:px-12 py-12 md:py-20 gap-10">
      {/* Left Content */}
      <div className="flex-1 max-w-xl">
        <h1 className="text-4xl sm:text-6xl font-black text-black leading-tight tracking-tight mb-5">
          Shopping Made Simple.
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8">
          Welcome to MeShop. Discover the latest collections across Men's, Women's, Jewellery, and Electronics directly from top global manufacturers.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="/shop"
            className="bg-black text-white hover:bg-neutral-800 transition-all font-semibold px-8 py-3.5 rounded text-sm sm:text-base shadow-sm"
          >
            Explore Shop &rarr;
          </Link>
          <Link
            to="/signup"
            className="border-2 border-black text-black hover:bg-black hover:text-white transition-all font-semibold px-8 py-3.5 rounded text-sm sm:text-base"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Right Hero Image using exact landingPagePic.png */}
      <div className="flex-1 flex justify-center w-full">
        <img
          src="/landingPagePic.png"
          alt="MeShop Landing Showcase"
          className="w-full max-w-lg object-contain drop-shadow-md"
          onError={(e) => {
            // fallback if local file fails
            e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>
    </main>
  );
}
