const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_tech_store_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: role === 'admin' ? 'admin' : 'customer',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      oauthProvider: 'local',
      isEmailVerified: false,
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        oauthProvider: user.oauthProvider,
        isEmailVerified: user.isEmailVerified,
        address: user.address,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
          oauthProvider: user.oauthProvider,
          isEmailVerified: user.isEmailVerified,
          address: user.address,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    OAuth authentication (Google, GitHub, etc.)
// @route   POST /api/auth/oauth
const oauthLogin = async (req, res, next) => {
  try {
    const { provider = 'google', email, name, avatar, oauthId } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'OAuth provider did not provide a valid email' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      // User exists: update oauth info and avatar if not set
      if (!user.avatar && avatar) {
        user.avatar = avatar;
      }
      if (!user.oauthProvider || user.oauthProvider === 'local') {
        user.oauthProvider = provider;
        user.oauthId = oauthId || user.oauthId;
      }
      user.isEmailVerified = true;
      await user.save();
    } else {
      // Register new user via OAuth
      const displayName = name || cleanEmail.split('@')[0];
      user = await User.create({
        name: displayName,
        email: cleanEmail,
        oauthProvider: provider,
        oauthId: oauthId || '',
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
        isEmailVerified: true,
        role: 'customer',
      });
    }

    res.json({
      success: true,
      message: `Signed in successfully with ${provider}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        oauthProvider: user.oauthProvider,
        isEmailVerified: user.isEmailVerified,
        address: user.address,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & address
// @route   PUT /api/auth/profile
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    if (req.body.address) {
      user.address = {
        street: req.body.address.street !== undefined ? req.body.address.street : user.address.street,
        city: req.body.address.city !== undefined ? req.body.address.city : user.address.city,
        state: req.body.address.state !== undefined ? req.body.address.state : user.address.state,
        postalCode: req.body.address.postalCode !== undefined ? req.body.address.postalCode : user.address.postalCode,
        country: req.body.address.country !== undefined ? req.body.address.country : user.address.country,
      };
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        oauthProvider: updatedUser.oauthProvider,
        isEmailVerified: updatedUser.isEmailVerified,
        phone: updatedUser.phone,
        address: updatedUser.address,
        token: generateToken(updatedUser._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  oauthLogin,
  getUserProfile,
  updateUserProfile,
};
