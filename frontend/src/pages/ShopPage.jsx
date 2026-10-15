import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const API_URL = 'https://fakestoreapi.com/products';

const COLOR_MAP = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#10b981',
  black: '#000000',
  white: '#ffffff',
};

const COLOR_PALETTE = ['red', 'blue', 'green', 'black', 'white'];

export default function ShopPage() {
  const { addToCart } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  // Fetch products on page landing
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();

        // Enrich with Colours and sizes matching prompt specification
        const enriched = data.map((item) => {
          const colors = item.Colours || [
            COLOR_PALETTE[item.id % COLOR_PALETTE.length],
            COLOR_PALETTE[(item.id + 2) % COLOR_PALETTE.length],
          ];
          const sizes = item.sizes || (
            item.category.includes('clothing')
              ? ['s', 'm', 'l', 'xl'].slice(0, 2 + (item.id % 3))
              : ['standard']
          );

          return {
            ...item,
            Colours: colors,
            sizes: sizes,
          };
        });

        setAllProducts(enriched);
      } catch (err) {
        console.warn('FakeStoreAPI live fetch failed, using offline fallback:', err.message);
        setAllProducts(getFallbackProducts());
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Search input change handler
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    console.log('Search input onChange triggered! Variable value:', val);
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handlePriceRangeToggle = (rangeId) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeId) ? prev.filter((r) => r !== rangeId) : [...prev, rangeId]
    );
  };

  // Filtered Products computation
  const filteredProducts = allProducts.filter((p) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description && p.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    // 2. Category Toggle
    if (activeCategory !== 'all') {
      const cat = (p.category || '').toLowerCase();
      if (activeCategory === "mens" && !cat.includes("men's clothing") && cat !== 'men') {
        return false;
      } else if (activeCategory === "womens" && !cat.includes("women's clothing") && cat !== 'women') {
        return false;
      } else if (activeCategory === 'jewellery' && !cat.includes('jewelery') && !cat.includes('jewelry')) {
        return false;
      } else if (activeCategory === 'electronics' && !cat.includes('electronics')) {
        return false;
      }
    }

    // 3. Price Slider
    if (p.price > maxPrice) return false;

    // 4. Price Checkboxes
    if (selectedPriceRanges.length > 0) {
      const inAnyRange = selectedPriceRanges.some((range) => {
        if (range === '0-25') return p.price >= 0 && p.price <= 25;
        if (range === '25-50') return p.price > 25 && p.price <= 50;
        if (range === '50-100') return p.price > 50 && p.price <= 100;
        if (range === '100on') return p.price > 100;
        return true;
      });
      if (!inAnyRange) return false;
    }

    // 5. Color Filter
    if (selectedColors.length > 0) {
      if (!p.Colours || !p.Colours.some((c) => selectedColors.includes(c.toLowerCase()))) {
        return false;
      }
    }

    // 6. Size Filter
    if (selectedSizes.length > 0) {
      if (!p.sizes || !p.sizes.some((s) => selectedSizes.includes(s.toLowerCase()))) {
        return false;
      }
    }

    // 7. Rating Slider
    if (minRating > 0) {
      if (!p.rating || p.rating.rate < minRating) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-[calc(100vh-65px)]">
      {/* Exact Figma Fixed Black Sidebar on Left */}
      <aside className="w-full md:w-48 bg-black text-white shrink-0 p-4 md:sticky md:top-[65px] md:h-[calc(100vh-65px)] overflow-y-auto">
        {/* Colors Section */}
        <section className="pb-4 mb-4 border-b border-white">
          <div className="text-xl font-bold mb-3 tracking-wide">Colors</div>
          <ul className="space-y-2 text-sm">
            {['Red', 'Blue', 'Green', 'Black', 'White'].map((color) => (
              <li key={color} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`color-${color}`}
                  checked={selectedColors.includes(color.toLowerCase())}
                  onChange={() => handleColorToggle(color.toLowerCase())}
                  className="w-4 h-4 cursor-pointer accent-white"
                />
                <label htmlFor={`color-${color}`} className="cursor-pointer select-none">
                  {color}
                </label>
              </li>
            ))}
          </ul>
        </section>

        {/* Sizes Section */}
        <section className="pb-4 mb-4 border-b border-white">
          <div className="text-xl font-bold mb-3 tracking-wide">Sizes</div>
          <ul className="space-y-2 text-sm">
            {['S', 'M', 'L', 'XL'].map((size) => (
              <li key={size} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`size-${size}`}
                  checked={selectedSizes.includes(size.toLowerCase())}
                  onChange={() => handleSizeToggle(size.toLowerCase())}
                  className="w-4 h-4 cursor-pointer accent-white"
                />
                <label htmlFor={`size-${size}`} className="cursor-pointer select-none">
                  {size}
                </label>
              </li>
            ))}
          </ul>
        </section>

        {/* Rating Section in exact Figma slider style */}
        <section className="pb-4 mb-4 border-b border-white">
          <div className="text-xl font-bold mb-3 tracking-wide">Rating</div>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full cursor-pointer accent-white"
            list="rating-values"
          />
          <datalist id="rating-values" className="flex justify-between text-xs text-white px-0.5 mt-1 font-semibold">
            <option value="0" label="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5" label="5">5</option>
          </datalist>
          <div className="text-xs text-neutral-400 mt-2 font-medium">
            Min: <strong>{minRating} Stars</strong>
          </div>
        </section>

        {/* Price Range Section with Checkboxes & Slider */}
        <section>
          <div className="text-xl font-bold mb-3 tracking-wide">Price Range</div>
          <ul className="space-y-2 text-sm mb-4">
            {[
              { id: '0-25', label: '$0 to $25' },
              { id: '25-50', label: '$25 to $50' },
              { id: '50-100', label: '$50 to $100' },
              { id: '100on', label: '$100 onwards' },
            ].map((p) => (
              <li key={p.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={p.id}
                  checked={selectedPriceRanges.includes(p.id)}
                  onChange={() => handlePriceRangeToggle(p.id)}
                  className="w-4 h-4 cursor-pointer accent-white"
                />
                <label htmlFor={p.id} className="cursor-pointer select-none">
                  {p.label}
                </label>
              </li>
            ))}
          </ul>

          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">Max Slider: ${maxPrice}</div>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full cursor-pointer accent-white"
          />
        </section>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 bg-white">
        {/* Exact Figma Search Bar */}
        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-4 border border-black text-base outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* 5 Toggle Buttons in Exact Figma Style */}
        <div className="flex gap-2 sm:gap-4 mb-8 flex-wrap">
          {[
            { id: 'all', label: 'All' },
            { id: 'mens', label: 'Mens' },
            { id: 'womens', label: 'Womens' },
            { id: 'jewellery', label: 'Jewellery' },
            { id: 'electronics', label: 'Electronics' },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  console.log('Category Toggle clicked:', cat.label);
                  setActiveCategory(cat.id);
                }}
                className={`flex-1 min-w-[90px] text-center py-2.5 px-3 border border-black font-semibold text-sm cursor-pointer transition-colors ${
                  isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Products Render */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium text-lg">
            Loading products from FakeStore API...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-black p-8 my-6">
            <h3 className="text-xl font-bold text-black mb-2">
              Oops! We couldn't find the product the user searched for.
            </h3>
            <p className="text-sm text-gray-500">
              Try adjusting your search terms, changing the category, or clearing the sidebar filters.
            </p>
          </div>
        ) : (
          /* Products Grid with Exact Figma Card Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const rate = product.rating ? product.rating.rate : 4.0;
              const count = product.rating ? product.rating.count : 50;

              return (
                <div
                  key={product.id}
                  className="border border-black bg-white flex flex-col justify-between"
                >
                  {/* Product Image */}
                  <div className="w-full h-56 flex items-center justify-center p-4 bg-white border-b border-gray-100">
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3
                        className="text-sm font-bold text-black line-clamp-2 mb-2 leading-snug"
                        title={product.title}
                      >
                        {product.title}
                      </h3>

                      {/* Row: Price & Sizes */}
                      <div className="flex justify-between items-center text-sm font-extrabold text-black mb-2">
                        <span>${product.price.toFixed(2)}</span>
                        <span className="text-xs font-semibold text-gray-600 uppercase">
                          {product.sizes ? product.sizes.join(',').toUpperCase() : 'S,M,L'}
                        </span>
                      </div>

                      {/* Row: Colors with circular dots in exact Figma style */}
                      <div className="flex items-center gap-2 text-xs text-gray-700 mb-2">
                        <span>Colors:</span>
                        <div className="flex items-center gap-1">
                          {product.Colours &&
                            product.Colours.map((c, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded-full border border-gray-400"
                                style={{ backgroundColor: COLOR_MAP[c.toLowerCase()] || c }}
                                title={c}
                              />
                            ))}
                        </div>
                      </div>

                      {/* Row: Rating */}
                      <div className="text-xs text-gray-800 font-semibold mb-3">
                        Rating: ★ {rate.toFixed(1)} <span className="text-gray-400 font-normal">({count})</span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="w-full bg-black text-white py-3 font-semibold text-sm hover:bg-neutral-800 transition cursor-pointer border-t border-black"
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function getFallbackProducts() {
  return [
    {
      id: 1,
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      description: 'Your perfect pack for everyday use and walks in the forest.',
      category: "men's clothing",
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      rating: { rate: 3.9, count: 120 },
      Colours: ['red', 'blue', 'black'],
      sizes: ['s', 'm', 'l', 'xl'],
    },
    {
      id: 2,
      title: 'Mens Casual Premium Slim Fit T-Shirts',
      price: 22.3,
      description: 'Slim-fitting style, contrast raglan long sleeve.',
      category: "men's clothing",
      image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UT_.jpg',
      rating: { rate: 4.1, count: 259 },
      Colours: ['white', 'blue', 'black'],
      sizes: ['s', 'm', 'l'],
    },
    {
      id: 5,
      title: "John Hardy Women's Legends Naga Gold & Silver Dragon Bracelet",
      price: 695.0,
      description: 'From our Legends Collection, the Naga was inspired by the mythical water dragon.',
      category: 'jewelery',
      image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
      rating: { rate: 4.6, count: 400 },
      Colours: ['white', 'black'],
      sizes: ['standard'],
    },
    {
      id: 9,
      title: 'WD 2TB Elements Portable External Hard Drive - USB 3.0',
      price: 64.0,
      description: 'USB 3.0 and USB 2.0 Compatibility Fast data transfers.',
      category: 'electronics',
      image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
      rating: { rate: 3.3, count: 203 },
      Colours: ['black', 'blue'],
      sizes: ['standard'],
    },
  ];
}
