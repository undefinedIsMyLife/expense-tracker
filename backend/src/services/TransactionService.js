import { Transaction } from '../models/Transaction.js';

/**
 * 🔹 Utility: Safe date parsing
 */
const parseDateSafe = (dateStr) => {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? new Date() : date;
};

export class TransactionService {
  /**
   * ✅ Create a single transaction (Manual Entry)
   */
  static async createTransaction(userId, data) {
    const transaction = new Transaction({
      ...data,
      userId,
      date: parseDateSafe(data.date),
      amount: Number(data.amount) || 0
    });
    return await transaction.save();
  }

  /**
   * 🚀 Final Bulk Insert (For CSV Imports)
   * Takes the ALREADY parsed data from the controller and saves it.
   */
  static async importTransactions(userId, transactions) {
    const finalData = transactions.map(t => ({
      ...t,
      userId,
      date: parseDateSafe(t.date)
    }));
    return await Transaction.insertMany(finalData);
  }

  /**
   * ✅ Get transactions with pagination + filters
   */
  static async getTransactions(userId, { page = 1, limit = 10, category, startDate, endDate, type }) {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    
    const filter = { userId };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ date: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Transaction.countDocuments(filter)
    ]);

    return {
      transactions,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) }
    };
  }

  /**
   * ✅ Get Unique Categories Dynamically (The "Rahul" Fix)
   * This scans your database and finds every category currently in use.
   */
  static async getUniqueCategories(userId) {
    const income = await Transaction.distinct("category", { userId, type: "income" });
    const expense = await Transaction.distinct("category", { userId, type: "expense" });
    return { income, expense };
  }

  static async deleteTransaction(userId, id) {
    const result = await Transaction.findOneAndDelete({ _id: id, userId });
    if (!result) throw new Error("Transaction not found");
    return result;
  }
}