# MeShop • Full-Stack E-Commerce Web Application

A full-stack modern e-commerce web application built with **React**, **Tailwind CSS**, **Node.js/Express**, **MongoDB** (local persistent database), and **Redis** caching, designed according to the MeShop shopping contest specifications.

---

## 🚀 Features

- **Pixel-Accurate UI**: Built matching the Figma specifications using Google Font **Inter**, dark top navigation, solid black sidebar with ratings/price filters, and sharp 1px bordered product cards.
- **Pure React SPA**: Single-page application architecture using **React 19**, **Vite**, **Tailwind CSS v3**, and **React Router v7** with clean URLs (`/`, `/shop`, `/login`, `/signup`, `/cart`, `/profile`).
- **Catalog & Advanced Filtering**:
  - Live search input.
  - 5 category toggle buttons (`All`, `Mens`, `Womens`, `Jewellery`, `Electronics`).
  - Rating slider with datalist markers and star ratings.
  - Price range checkboxes and dynamic range slider.
  - Deterministic color dots palette and size badges.
- **Cart & Checkout**:
  - Global cart state persistence.
  - Item addition, removal, and live subtotal/total calculations.
  - Integrated Razorpay checkout modal with test key (`rzp_test_PV1oQ0oMtgXOsq`).
  - Alert notification (`"The items were purchased."`) and cart clearing upon payment confirmation.
- **Authentication & User Management**:
  - 5-input registration (First Name, Last Name, Email, Password, Confirm Password).
  - 2-input login with 16-byte random session token generation and JWT.
  - User profile management with password change and address updates.
  - State persisted across browser `localStorage` and synchronized with the backend.
- **High-Performance Redis Caching**:
  - Response caching on product queries (`GET /api/products`), product details (`GET /api/products/:id`), and categories (`GET /api/products/categories`).
  - Returns `X-Cache: HIT / MISS` headers and `{ cached: true, source: 'redis' }`.
  - Automatic cache invalidation (`flushPattern`) upon catalog updates.
- **Local Standalone Database**:
  - Persistent MongoDB database engine spun locally at `backend/data/db` using wiredTiger.
  - Automated lock management and graceful process cleanup.

---

## 📁 Project Structure

```text
├── backend/                  # Node.js & Express REST API
│   ├── config/               # Database (MongoDB) & Redis configurations
│   ├── controllers/          # Product, Auth, Order & Payment controllers
│   ├── middleware/           # Auth, logger & error handler middlewares
│   ├── models/               # Mongoose schemas (User, Product, Order)
│   ├── routes/               # API route definitions
│   ├── server.js             # Express entry point
│   └── .env.example          # Environment variables template
│
├── frontend/                 # React SPA (Vite + Tailwind CSS v3)
│   ├── public/               # Static assets & images
│   ├── src/
│   │   ├── components/       # Navbar, Footer
│   │   ├── context/          # AuthContext, CartContext
│   │   ├── pages/            # Home, Shop, Login, Signup, Cart, Profile
│   │   ├── App.jsx           # React Router route declarations
│   │   └── main.jsx          # React DOM entry
│   ├── index.html            # Single root HTML entry
│   └── vite.config.js        # Vite config with /api proxy to backend
│
├── legacy_vanilla_html/      # Archived original static HTML/JS starter files
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Redis](https://redis.io/) (installed and running locally on port 6379, e.g., via `brew services start redis` or `redis-server`)

### 1. Clone the repository
```bash
git clone https://github.com/mkathir0/ecommerce-app.git
cd ecommerce-app
```

### 2. Configure Backend Environment
```bash
cd backend
cp .env.example .env
npm install
```

Configure `backend/.env` (default values work out-of-the-box for local development):
```env
PORT=5001
MONGODB_URI=
JWT_SECRET=super_secret_jwt_key_tech_store_2026
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 3. Start Backend Server
```bash
npm run dev
```
The backend will:
1. Start the local standalone MongoDB engine at `backend/data/db`.
2. Connect to the local Redis server on `127.0.0.1:6379`.
3. Auto-seed the product catalog if empty.
4. Listen on `http://localhost:5001`.

### 4. Configure & Start Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The React frontend will be accessible at `http://localhost:5173`.

---

## 🔍 API Status & Diagnostics

Check system health, database connection, and Redis cache telemetry:
```bash
curl -s http://localhost:5001/api/status | jq .
```

Verify Redis caching headers:
```bash
curl -s -i "http://localhost:5001/api/products?limit=4" | grep -E "X-Cache|cached"
```
