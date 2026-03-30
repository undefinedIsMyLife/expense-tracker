import { AuthService } from '../services/AuthService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { User } from '../models/User.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const result = await AuthService.register(email, password, name);
    res.status(201).json({
      message: 'User registered successfully',
      data: result
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await AuthService.login(email, password);
    res.status(200).json({
      message: 'Login successful',
      data: result
    });
  }),

  getProfile: asyncHandler(async (req, res) => {
    // Get userId from JWT token (set by authenticateToken middleware)
    // The token contains userId, so we extract it from req.user
    const userId = req.user?.userId || req.user?._id || req.user?.id;
    
    console.log('🔍 getProfile - req.user:', req.user);
    console.log('🔍 getProfile - userId extracted:', userId);
    
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    const user = await User.findById(userId).select('-password');
    
    console.log('🔍 getProfile - user found:', user ? 'YES' : 'NO');
    console.log('🔍 getProfile - user._id:', user?._id);
    console.log('🔍 getProfile - user.email:', user?.email);
    console.log('🔍 getProfile - user.name:', user?.name);
    console.log('🔍 getProfile - user.categories:', user?.categories);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure categories exist (for legacy users)
    if (!user.categories) {
      user.categories = {
        income: ['salary', 'freelance', 'investment', 'bonus', 'other'],
        expense: ['food', 'transport', 'entertainment', 'utilities', 'health', 'shopping', 'other']
      };
      await user.save();
      console.log('🔍 Created default categories for user');
    }

    const responseData = {
      message: 'Profile fetched successfully',
      data: { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          categories: user.categories
        },
        categories: user.categories
      }
    };
    
    console.log('🔍 Sending response:', JSON.stringify(responseData, null, 2));
    
    res.status(200).json(responseData);
  })
};

export const updateCategories = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id || req.user?.id;
    
    console.log('updateCategories - req.user:', req.user);
    console.log('updateCategories - userId extracted:', userId);
    
    if (!userId) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { categories } = req.body;
    
    if (!categories || !categories.income || !categories.expense) {
      return res.status(400).json({ message: 'Invalid categories format' });
    }
    
    // Lowercase and trim categories for consistency
    const formattedCategories = {
      income: categories.income.map(c => c.toLowerCase().trim()),
      expense: categories.expense.map(c => c.toLowerCase().trim())
    };
    
    console.log('updateCategories - formatted categories:', formattedCategories);
    
    const user = await User.findByIdAndUpdate(
      userId,
      { categories: formattedCategories },
      { new: true }
    );
    
    console.log('updateCategories - user updated:', user ? 'yes' : 'no');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      data: user.categories,
      message: 'Categories updated successfully'
    });
  } catch (error) {
    console.error('updateCategories error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};