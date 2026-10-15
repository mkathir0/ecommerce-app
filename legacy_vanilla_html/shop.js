// Shop Page Logic: Products fetching, filtering, category toggles, sidebar filters & cart addition

const API_URL = 'https://fakestoreapi.com/products';

let allProducts = [];
let activeCategory = 'all';
let currentSearchQuery = '';
let maxPrice = 1000;
let selectedColors = [];
let selectedSizes = [];
let selectedRatings = [];

// Available options for deterministic assignment to FakeStoreAPI items
const COLOR_PALETTE = ['red', 'blue', 'green', 'black', 'white'];
const SIZE_PALETTE = ['s', 'm', 'l', 'xl'];

document.addEventListener('DOMContentLoaded', () => {
  // 1. Fetch products from API on page load
  fetchProducts();

  // 2. Setup Search input listener with onChange & onInput
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    // Console log on onChange event of input of search as explicitly requested
    searchInput.addEventListener('change', (e) => {
      currentSearchQuery = e.target.value;
      console.log('Search input onChange triggered! Current search value:', currentSearchQuery);
      applyAllFilters();
    });

    // Also support live filtering on input for great UX
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      applyAllFilters();
    });
  }

  // 3. Setup Category Toggle Buttons
  setupCategoryToggles();

  // 4. Setup Sidebar Filters (Rating, Colors, Sizes, Price Range Slider)
  setupSidebarFilters();
});

// Fetch products from FakeStoreAPI
async function fetchProducts() {
  const container = document.getElementById('products-container');
  if (container) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; font-size: 1.1rem; color: #666;">Loading products from FakeStore API...</div>';
  }

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    // Enrich products with Colours and sizes if missing, matching prompt specification
    allProducts = data.map((item) => {
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

    console.log(`Successfully fetched and enriched ${allProducts.length} products.`);
    applyAllFilters();
  } catch (error) {
    console.warn('Could not fetch from external FakeStore API, using rich offline seed products:', error.message);
    allProducts = getFallbackProducts();
    applyAllFilters();
  }
}

// Category Toggles handler
function setupCategoryToggles() {
  const toggleButtons = document.querySelectorAll('.category-toggles .toggle-btn');

  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const clickedBtn = e.target;
      console.log('Category Toggle clicked:', clickedBtn.innerText.trim());

      // Update active toggle styling: black background for active
      toggleButtons.forEach((b) => b.classList.remove('active'));
      clickedBtn.classList.add('active');

      activeCategory = clickedBtn.getAttribute('data-category') || 'all';
      applyAllFilters();
    });
  });
}

// Sidebar Filter handlers
function setupSidebarFilters() {
  // Price Range Slider
  const priceSlider = document.getElementById('price-slider');
  const priceValueDisplay = document.getElementById('price-value');

  if (priceSlider && priceValueDisplay) {
    priceSlider.addEventListener('input', (e) => {
      maxPrice = Number(e.target.value);
      priceValueDisplay.innerText = `$${maxPrice}`;
      console.log('Price slider adjusted to:', maxPrice);
      applyAllFilters();
    });
  }

  // Color Checkboxes
  const colorCheckboxes = document.querySelectorAll('input[name="color-filter"]');
  colorCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      selectedColors = Array.from(colorCheckboxes)
        .filter((c) => c.checked)
        .map((c) => c.value.toLowerCase());
      console.log('Selected colors:', selectedColors);
      applyAllFilters();
    });
  });

  // Size Checkboxes
  const sizeCheckboxes = document.querySelectorAll('input[name="size-filter"]');
  sizeCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      selectedSizes = Array.from(sizeCheckboxes)
        .filter((c) => c.checked)
        .map((c) => c.value.toLowerCase());
      console.log('Selected sizes:', selectedSizes);
      applyAllFilters();
    });
  });

  // Rating Checkboxes
  const ratingCheckboxes = document.querySelectorAll('input[name="rating-filter"]');
  ratingCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      selectedRatings = Array.from(ratingCheckboxes)
        .filter((c) => c.checked)
        .map((c) => Number(c.value));
      console.log('Selected rating thresholds:', selectedRatings);
      applyAllFilters();
    });
  });
}

// Apply Search, Category, Price, Color, Size, and Rating filters
function applyAllFilters() {
  let filtered = [...allProducts];

  // 1. Search Query
  if (currentSearchQuery.trim()) {
    const q = currentSearchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // 2. Category Toggle
  if (activeCategory !== 'all') {
    filtered = filtered.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      if (activeCategory === "men's") {
        return cat.includes("men's clothing") || cat === 'men';
      }
      if (activeCategory === "women's") {
        return cat.includes("women's clothing") || cat === 'women';
      }
      if (activeCategory === 'jewellery') {
        return cat.includes('jewelery') || cat.includes('jewelry');
      }
      if (activeCategory === 'electronics') {
        return cat.includes('electronics');
      }
      return cat.includes(activeCategory);
    });
  }

  // 3. Price Filter (<= maxPrice)
  filtered = filtered.filter((p) => p.price <= maxPrice);

  // 4. Color Filter
  if (selectedColors.length > 0) {
    filtered = filtered.filter((p) => {
      if (!p.Colours || !Array.isArray(p.Colours)) return false;
      return p.Colours.some((c) => selectedColors.includes(c.toLowerCase()));
    });
  }

  // 5. Size Filter
  if (selectedSizes.length > 0) {
    filtered = filtered.filter((p) => {
      if (!p.sizes || !Array.isArray(p.sizes)) return false;
      return p.sizes.some((s) => selectedSizes.includes(s.toLowerCase()));
    });
  }

  // 6. Rating Filter
  if (selectedRatings.length > 0) {
    const minRating = Math.min(...selectedRatings);
    filtered = filtered.filter((p) => (p.rating ? p.rating.rate >= minRating : true));
  }

  renderProducts(filtered);
}

// Render Products Grid
function renderProducts(products) {
  const container = document.getElementById('products-container');
  if (!container) return;

  if (products.length === 0) {
    // Show exact message required by prompt: "couldn't find the product the user searched for"
    container.innerHTML = `
      <div class="no-products-msg">
        <p style="font-size: 1.3rem; font-weight: 700; color: #111; margin-bottom: 0.5rem;">
          Oops! We couldn't find the product the user searched for.
        </p>
        <p style="font-size: 0.95rem; color: #666;">
          Try adjusting your search terms, changing the category, or clearing the sidebar filters.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = products
    .map((product) => {
      const colorsMarkup = (product.Colours || [])
        .map((c) => `<span class="chip">${c}</span>`)
        .join(' ');

      const sizesMarkup = (product.sizes || [])
        .map((s) => `<span class="chip">${s}</span>`)
        .join(' ');

      const rate = product.rating ? product.rating.rate : 4.0;
      const count = product.rating ? product.rating.count : 50;

      return `
        <div class="product-card">
          <div class="product-image-box">
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
          </div>
          <h3 class="product-title" title="${product.title}">${product.title}</h3>
          
          <div class="product-rating">
            <span class="star">★</span>
            <strong>${rate.toFixed(1)}</strong>
            <span style="color: #6b7280; font-size: 0.8rem;">(${count})</span>
          </div>

          <div class="product-price-row">
            <span class="product-price">$${product.price.toFixed(2)}</span>
            <span style="font-size: 0.75rem; text-transform: uppercase; color: #9ca3af; font-weight: 600;">
              ${product.category}
            </span>
          </div>

          <div class="product-meta">
            ${colorsMarkup ? `<div class="meta-row"><span>Colors:</span> ${colorsMarkup}</div>` : ''}
            ${sizesMarkup ? `<div class="meta-row"><span>Sizes:</span> ${sizesMarkup}</div>` : ''}
          </div>

          <button 
            type="button" 
            class="btn-add-cart" 
            onclick="addToCart(${product.id})"
          >
            Add to Cart
          </button>
        </div>
      `;
    })
    .join('');
}

// Add Item to Cart and save in localStorage
window.addToCart = function (productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  console.log('Adding product to cart:', product.title);

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingIndex = cart.findIndex((item) => item.id === productId);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1,
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  // Update badge count
  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  }

  alert(`"${product.title}" added to your cart!`);
};

// Offline Fallback Products conforming to FakeStore API JSON structure
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
      sizes: ['s', 'l', 'm', 'xl'],
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
    {
      id: 15,
      title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
      price: 56.99,
      description: 'Detachable Liner Fabric: Warm Fleece. Stand Collar design.',
      category: "women's clothing",
      image: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
      rating: { rate: 2.6, count: 235 },
      Colours: ['red', 'green', 'blue'],
      sizes: ['s', 'm', 'l', 'xl'],
    },
    {
      id: 18,
      title: "MBJ Women's Solid Short Sleeve Boat Neck V",
      price: 9.85,
      description: 'Lightweight fabric with great stretch for comfort.',
      category: "women's clothing",
      image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg',
      rating: { rate: 4.7, count: 130 },
      Colours: ['white', 'black', 'red'],
      sizes: ['s', 'm', 'l'],
    },
  ];
}
