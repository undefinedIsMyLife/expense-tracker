import mongoose from 'mongoose';

const TRANSACTION_TYPES = ['income', 'expense'];
const CATEGORIES = {
  income: ['salary', 'freelance', 'investment', 'bonus', 'other'],
  expense: ['food', 'transport', 'entertainment', 'utilities', 'health', 'shopping', 'other']
};

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true // Index for faster queries
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0']
    },
    type: {
      type: String,
      enum: {
        values: TRANSACTION_TYPES,
        message: 'Type must be either "income" or "expense"'
      },
      required: [true, 'Transaction type is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required']
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true // Index for date range queries
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    }
  },
  { timestamps: true }
);

// Compound index for userId + date for efficient analytics queries
transactionSchema.index({ userId: 1, date: 1 });

/* Validate category based on type
transactionSchema.pre('validate', function (next) {
  if (this.type && this.category) {
    const validCategories = CATEGORIES[this.type];
    if (!validCategories.includes(this.category)) {
      this.invalidate('category', `Category must be one of: ${validCategories.join(', ')}`);
    }
  }
  next();
});*/

export const Transaction = mongoose.model('Transaction', transactionSchema);
export { TRANSACTION_TYPES, CATEGORIES };
