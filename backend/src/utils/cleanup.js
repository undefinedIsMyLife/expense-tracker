import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const run = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB...");

    const userId = new mongoose.Types.ObjectId("69bd52c502e7a0886538a6d6");
    const collection = mongoose.connection.collection('transactions');

    // 1. 🗑️ DELETION LOGIC (Commented out)
    /*
    const deleteResult = await collection.deleteMany({
      category: "misc",
      userId: userId
    });
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} miscellaneous transactions.`);
    */

    // 2. 🔍 FETCH UNIQUE CATEGORIES
    // Returns an array of strings representing every category used by this user
    const uniqueCategories = await collection.distinct("category", { userId: userId });
    console.log("📊 Unique Categories for Rahul:", uniqueCategories);

    // 3. 🔢 FETCH TOTAL TRANSACTION COUNT
    // Returns the total number of transactions currently in the database for this user
    const totalTransactions = await collection.countDocuments({ userId: userId });
    console.log(`📈 Total Transactions for Rahul: ${totalTransactions}`);

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

run();