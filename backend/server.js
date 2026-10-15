const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const startDb = require('./config/db');
const { getRedisStats } = require('./config/redis');
const mongoose = require('mongoose');

const app = express();

// 1. Application-level middleware
app.use(logger);
app.use(cors({ origin: '*' }));
app.use(express.json());

// 2. Health check & status routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MeShop E-Commerce API is running' });
});

app.get('/api/redis/status', async (req, res) => {
  const stats = await getRedisStats();
  res.json({ success: true, redis: stats });
});

app.get('/api/status', async (req, res) => {
  const redisStats = await getRedisStats();
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.json({
    success: true,
    server: 'MeShop E-Commerce API',
    database: {
      engine: 'MongoDB Local Standalone (wiredTiger)',
      status: dbState,
      name: mongoose.connection.name || 'meshop_db',
      host: mongoose.connection.host,
      port: mongoose.connection.port
    },
    redis: redisStats
  });
});

// 3. Mount API resource routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/tasks', taskRoutes);

// 4. Serve the React SPA production build
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Fallback to React index.html for client-side routing on any non-API web request
app.get(/^(?!\/api).+/, (req, res, next) => {
  const indexPath = path.join(frontendDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  next();
});

// 5. Central error-handling middleware
app.use(notFound);      // Catches 404s for undefined routes
app.use(errorHandler);  // Catches and formats any error passed via next(err)

// Connect to database and start server
startDb();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`MeShop Server is running on port ${PORT}`);
});