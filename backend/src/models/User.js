import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false 
    },
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    // Fixed: These are now inside the main schema object
    categories: {
      income: {
        type: [String],
        default: ['salary', 'freelance', 'investment', 'bonus', 'other']
      },
      expense: {
        type: [String],
        default: ['food', 'transport', 'entertainment', 'utilities', 'health', 'shopping', 'other']
      }
    },
    profilePicture: {
      type: String,
      default: '' 
    }
  }, 
  { timestamps: true } // Second object is for options like timestamps
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

userSchema.pre('save', function(next) {
  if (this.isModified('categories')) {
    this.categories.income = this.categories.income.map(c => c.toLowerCase().trim());
    this.categories.expense = this.categories.expense.map(c => c.toLowerCase().trim());
  }
  next();
});

export const User = mongoose.model('User', userSchema);