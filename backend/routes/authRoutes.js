const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  oauthLogin,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/oauth', oauthLogin);
router.post('/google', oauthLogin);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
