const Product = require('../models/Product');
const { getCache, setCache, flushPattern } = require('../config/redis');

// Curated top-tier tech items ensuring the store has an incredible catalog
const CURATED_TECH_SEEDS = [
  {
    externalId: 9001,
    title: 'CyberVibe Neural VR Headset Pro',
    description: 'Next-generation spatial computing headset featuring dual 4K micro-OLED displays, ultra-low latency eye tracking, and haptic spatial audio.',
    category: 'Virtual Reality',
    price: 999.99,
    discountPercentage: 15,
    rating: 4.9,
    stock: 18,
    brand: 'CyberVibe',
    thumbnail: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      { label: 'Display', value: 'Dual 4K Micro-OLED 120Hz' },
      { label: 'Tracking', value: '6-DoF Inside-Out + Eye Tracking' },
      { label: 'Weight', value: '385 grams' },
      { label: 'Connectivity', value: 'Wi-Fi 7, Ultra-wideband' }
    ],
    isFeatured: true,
    tags: ['VR', 'Spatial Computing', 'Featured', 'Hot']
  },
  {
    externalId: 9002,
    title: 'AeroBlade 16 Gaming Laptop RTX 4090',
    description: 'Ultra-thin aerospace aluminum chassis with Intel Core i9 14900HX, NVIDIA GeForce RTX 4090 16GB, and 240Hz Mini-LED QHD+ display.',
    category: 'Laptops',
    price: 2499.00,
    discountPercentage: 10,
    rating: 4.95,
    stock: 12,
    brand: 'AeroBlade',
    thumbnail: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      { label: 'Processor', value: 'Intel Core i9-14900HX (24 cores)' },
      { label: 'Graphics', value: 'NVIDIA RTX 4090 16GB GDDR6' },
      { label: 'RAM', value: '64GB DDR5 5600MHz' },
      { label: 'Storage', value: '2TB NVMe PCIe Gen4 SSD' }
    ],
    isFeatured: true,
    tags: ['Gaming', 'Laptop', 'RTX 4090', 'High Performance']
  },
  {
    externalId: 9003,
    title: 'AuraSonic ANC Studio Headphones Mk.IV',
    description: 'Audiophile-grade wireless planar magnetic headphones with active hybrid noise cancellation, LDAC lossless codec, and 60-hour continuous battery life.',
    category: 'Audio',
    price: 349.99,
    discountPercentage: 12,
    rating: 4.85,
    stock: 45,
    brand: 'AuraSonic',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      { label: 'Driver', value: '45mm Custom Carbon Planar Magnetic' },
      { label: 'Battery', value: '60 Hours (ANC On)' },
      { label: 'Codecs', value: 'LDAC, aptX Adaptive, AAC' },
      { label: 'Noise Reduction', value: '-42dB Hybrid Active' }
    ],
    isFeatured: true,
    tags: ['Audio', 'Headphones', 'Lossless', 'Noise Cancelling']
  },
  {
    externalId: 9004,
    title: 'QuantumEdge Curved OLED Monitor 34"',
    description: '34-inch 175Hz Quantum Dot OLED curved gaming monitor with 0.03ms response time, infinite contrast ratio, and true 10-bit HDR1000.',
    category: 'Monitors',
    price: 899.99,
    discountPercentage: 8,
    rating: 4.9,
    stock: 15,
    brand: 'QuantumTech',
    thumbnail: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      { label: 'Resolution', value: 'UWQHD 3440 x 1440' },
      { label: 'Refresh Rate', value: '175Hz Native' },
      { label: 'Response Time', value: '0.03ms GtG' },
      { label: 'Curvature', value: '1800R' }
    ],
    isFeatured: true,
    tags: ['Monitor', 'OLED', '175Hz', 'Curved']
  },
  {
    externalId: 9005,
    title: 'Chronos Titanium Smartwatch Ultra',
    description: 'Rugged grade-5 titanium smartwatch with dual-band GPS, 100m water resistance, ECG monitor, and micro-sapphire crystal lens.',
    category: 'Wearables',
    price: 499.00,
    discountPercentage: 15,
    rating: 4.8,
    stock: 30,
    brand: 'Chronos',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      { label: 'Case Material', value: 'Titanium Grade 5' },
      { label: 'Battery Life', value: 'Up to 14 days' },
      { label: 'Water Rating', value: '10 ATM (100 meters)' },
      { label: 'Sensors', value: 'ECG, SpO2, Dual GPS, Barometer' }
    ],
    isFeatured: true,
    tags: ['Smartwatch', 'Wearables', 'Titanium', 'Health']
  },
  {
    externalId: 9006,
    title: 'Vortex Mechanical Keyboard RGB Custom',
    description: 'Custom hot-swappable 75% wireless mechanical keyboard with pre-lubed linear switches, gasket mount design, and CNC aluminum casing.',
    category: 'Accessories',
    price: 189.99,
    discountPercentage: 5,
    rating: 4.75,
    stock: 50,
    brand: 'VortexKey',
    thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      { label: 'Form Factor', value: '75% Compact' },
      { label: 'Switches', value: 'Pre-lubed Vortex Crystal Linear' },
      { label: 'Mounting', value: 'Silicone Gasket Mount' },
      { label: 'Connectivity', value: 'Bluetooth 5.3, 2.4GHz & USB-C' }
    ],
    isFeatured: false,
    tags: ['Keyboard', 'Mechanical', 'Gaming', 'Hot-swap']
  }
];

// Helper to normalize and map external DummyJSON products
const mapDummyJsonProduct = (item) => {
  // Normalize categories into standard tech store categories
  let category = 'Gadgets';
  const rawCat = (item.category || '').toLowerCase();
  if (rawCat.includes('smartphone') || rawCat.includes('phone')) category = 'Smartphones';
  else if (rawCat.includes('laptop')) category = 'Laptops';
  else if (rawCat.includes('tablet')) category = 'Tablets';
  else if (rawCat.includes('accessories')) category = 'Accessories';
  else if (rawCat.includes('audio') || rawCat.includes('headphone')) category = 'Audio';

  return {
    externalId: item.id,
    title: item.title,
    description: item.description,
    category,
    price: item.price,
    discountPercentage: Math.round(item.discountPercentage || 0),
    rating: item.rating || 4.5,
    stock: item.stock || 20,
    brand: item.brand || 'Nexus Brand',
    thumbnail: item.thumbnail || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    images: item.images && item.images.length > 0 ? item.images : [item.thumbnail],
    specs: [
      { label: 'Brand', value: item.brand || 'Premium Tech' },
      { label: 'Warranty', value: item.warrantyInformation || '2-Year Manufacturer Warranty' },
      { label: 'Shipping', value: item.shippingInformation || 'Free Express Shipping' },
      { label: 'Return Policy', value: item.returnPolicy || '30-Day Hassle-Free Returns' }
    ],
    isFeatured: item.rating >= 4.7 || (item.discountPercentage && item.discountPercentage > 15),
    tags: [category, item.brand, 'Tech']
  };
};

// @desc    Sync / seed products from External DummyJSON API + Curated seeds
// @route   POST /api/products/sync-external
const syncExternalProducts = async (req, res, next) => {
  try {
    let externalProducts = [];

    const categoriesToFetch = ['smartphones', 'laptops', 'tablets', 'mobile-accessories'];

    for (const cat of categoriesToFetch) {
      try {
        const response = await fetch(`https://dummyjson.com/products/category/${cat}?limit=12`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.products) {
            externalProducts.push(...data.products);
          }
        }
      } catch (err) {
        console.warn(`Could not fetch category ${cat} from DummyJSON:`, err.message);
      }
    }

    // Format DummyJSON products
    const mappedExternal = externalProducts.map(mapDummyJsonProduct);

    // Combine with curated seeds
    const allProductsToSeed = [...CURATED_TECH_SEEDS, ...mappedExternal];

    let upsertedCount = 0;
    for (const item of allProductsToSeed) {
      await Product.findOneAndUpdate(
        { externalId: item.externalId },
        { $set: item },
        { upsert: true, new: true }
      );
      upsertedCount++;
    }

    const totalCount = await Product.countDocuments();

    // Invalidate Redis product cache on catalog sync
    await flushPattern('products:*');
    await flushPattern('product:*');

    res.json({
      success: true,
      message: `Successfully synchronized ${upsertedCount} products from external tech APIs!`,
      totalInDatabase: totalCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products with search, filter, sort, pagination (with Redis caching)
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    // Generate deterministic cache key from query params
    const queryParams = new URLSearchParams(req.query);
    queryParams.sort();
    const cacheKey = `products:list:${queryParams.toString()}`;

    // 1. Check Redis cache first
    const cachedResponse = await getCache(cacheKey);
    if (cachedResponse) {
      res.set('X-Cache', 'HIT');
      return res.json({
        ...cachedResponse,
        cached: true,
        source: 'redis'
      });
    }

    // If database is completely empty, automatically seed curated + external
    const existingCount = await Product.countDocuments();
    if (existingCount === 0) {
      console.log('Database product catalog empty, auto-populating initial tech catalog...');
      await Product.insertMany(CURATED_TECH_SEEDS);
      // Asynchronously trigger external fetch
      syncExternalProducts({ body: {} }, { json: () => {} }, () => {}).catch(() => {});
    }

    const {
      q,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      sort,
      inStock,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Search query
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Brand filter
    if (brand) {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // In-stock filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'discount') sortOptions = { discountPercentage: -1 };
    else if (sort === 'title_asc') sortOptions = { title: 1 };

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(pageSize),
      Product.countDocuments(query)
    ]);

    const responsePayload = {
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      products
    };

    // Cache in Redis for 180 seconds (3 mins)
    await setCache(cacheKey, responsePayload, 180);

    res.set('X-Cache', 'MISS');
    res.json({
      ...responsePayload,
      cached: false,
      source: 'database'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID (with Redis caching)
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const cacheKey = `product:detail:${req.params.id}`;
    const cachedProduct = await getCache(cacheKey);
    if (cachedProduct) {
      res.set('X-Cache', 'HIT');
      return res.json({ success: true, product: cachedProduct, cached: true, source: 'redis' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await setCache(cacheKey, product, 300); // 5 minutes TTL
    res.set('X-Cache', 'MISS');
    res.json({ success: true, product, cached: false, source: 'database' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products (with Redis caching)
// @route   GET /api/products/featured
const getFeaturedProducts = async (req, res, next) => {
  try {
    const cacheKey = 'products:featured';
    const cachedFeatured = await getCache(cacheKey);
    if (cachedFeatured) {
      res.set('X-Cache', 'HIT');
      return res.json({ success: true, products: cachedFeatured, cached: true, source: 'redis' });
    }

    const featured = await Product.find({ isFeatured: true }).limit(8);
    await setCache(cacheKey, featured, 300);

    res.set('X-Cache', 'MISS');
    res.json({ success: true, products: featured, cached: false, source: 'database' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique categories (with Redis caching)
// @route   GET /api/products/categories
const getCategories = async (req, res, next) => {
  try {
    const cacheKey = 'products:categories';
    const cachedCategories = await getCache(cacheKey);
    if (cachedCategories) {
      res.set('X-Cache', 'HIT');
      return res.json({ success: true, categories: cachedCategories, cached: true, source: 'redis' });
    }

    const categories = await Product.distinct('category');
    const result = ['All', ...categories];
    await setCache(cacheKey, result, 600); // 10 minutes TTL

    res.set('X-Cache', 'MISS');
    res.json({ success: true, categories: result, cached: false, source: 'database' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  syncExternalProducts
};
