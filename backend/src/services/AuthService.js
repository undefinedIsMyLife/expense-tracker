import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

export class AuthService {
  // Register new user
  static async register(email, password, name) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const user = new User({ email, password, name });
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      token
    };
  }

  // Login user
  static async login(email, password) {
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id.toString());

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      token
    };
  }

  // Get user by ID
  static async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
