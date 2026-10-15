const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  syncExternalProducts
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.post('/sync-external', syncExternalProducts);
router.get('/:id', getProductById);

module.exports = router;
