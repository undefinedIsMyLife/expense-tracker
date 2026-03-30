import { TransactionService } from '../services/TransactionService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import fs from 'fs';
import csv from 'csv-parser';
import { fallbackParser } from '../utils/fallbackParser.js';
import { parseBatchWithHuggingFace } from '../services/GeminiService.js';


/** Transaction Controller- it handles incoming requests related to transactions, processes them (including CSV parsing and AI parsing), and interacts with the TransactionService for database operations */
export const transactionController = {

  createTransaction: asyncHandler(async (req, res) => {
    const { title, amount, type, category, date, description } = req.body;

    if (!title || !amount || !type || !category || !date) {
      return res.status(400).json({
        message: 'Title, amount, type, category, and date are required'
      });
    }

    const transaction = await TransactionService.createTransaction(req.user.userId, {
      title,
      amount,
      type,
      category,
      date: new Date(date),
      description
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      data: { transaction }
    });
  }),

  // ✅ Fetch with filters (Now supports higher limits for "Maximize" view)
  getTransactions: asyncHandler(async (req, res) => {
    const result = await TransactionService.getTransactions(req.user.userId, req.query);
    res.status(200).json({ data: result });
  }),

  // ✅ Dynamic Categories (FETCH FROM DB, NOT HARDCODED)
  getUniqueCategories: asyncHandler(async (req, res) => {
    const categories = await TransactionService.getUniqueCategories(req.user.userId);
    res.status(200).json({ data: categories });
  }),

  getTransactions: asyncHandler(async (req, res) => {
    const { page, limit, category, startDate, endDate, type } = req.query;

    const result = await TransactionService.getTransactions(req.user.userId, {
      page,
      limit,
      category,
      startDate,
      endDate,
      type
    });

    res.status(200).json({
      message: 'Transactions fetched successfully',
      data: result
    });
  }),

  deleteTransaction: asyncHandler(async (req, res) => {
    const { id } = req.params;

    await TransactionService.deleteTransaction(req.user.userId, id);

    res.status(200).json({
      message: 'Transaction deleted successfully'
    });
  }),

  importTransactions: asyncHandler(async (req, res) => {
    const { transactions } = req.body;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({
        message: 'Transactions array is required and must not be empty'
      });
    }

    const result = await TransactionService.importTransactions(req.user.userId, transactions);

    res.status(201).json({
      message: `${result.length} transactions imported successfully`,
      data: { count: result.length }
    });
  }),

  getCategories: asyncHandler(async (req, res) => {
    const categories = TransactionService.getCategories();
    res.status(200).json({
      message: 'Categories fetched successfully',
      data: { categories }
    });
  }),
// can deleted till hee from get transaction 
  importCSV: asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No CSV file uploaded' });
  }

  const filePath = req.file.path;
  const rawRows = [];

  const cleanAmount = (val) => {
    if (!val) return 0;
    return parseFloat(val.toString().replace(/[^0-9.]/g, ""));
  };

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => { rawRows.push(row); })
    .on('end', async () => {
      try {
        fs.unlinkSync(filePath);

        // ✅ Step 1: Group rows into transaction objects
        const grouped = [];
        let current = null;

        for (const row of rawRows) {
          const values = Object.values(row);
          const [date, details, type, amount] = values;

          if (date && date.match(/[A-Z][a-z]{2}/)) {
            if (current) grouped.push(current);
            current = { text: `${date} ${details}`, type, amount };
          } else if (current && details) {
            current.text += " " + details;
          }
        }
        if (current) grouped.push(current);

        // ✅ Step 2: Optimized Batch Parsing
        const finalTransactions = [];
        const CHUNK_SIZE = 8; 

        for (let i = 0; i < grouped.length; i += CHUNK_SIZE) {
          const chunk = grouped.slice(i, i + CHUNK_SIZE);
          const complexTexts = chunk.map(t => t.text);

          let batchParsedResults = [];
          if (complexTexts.length > 0) {
            batchParsedResults = await parseBatchWithHuggingFace(complexTexts) || [];
            // Delay to protect your free-tier rate limit
            await new Promise(resolve => setTimeout(resolve, 1200));
          }

          // Combine results
          for (const t of chunk) {
            let parsed = null;

            if (t.text.length > 40) {
              // Get the corresponding result from the batch array
              parsed = batchParsedResults.shift();
            } 
            
            if (!parsed) {
              parsed = fallbackParser(t.text);
            }

            let amount = cleanAmount(t.amount) || parsed?.amount;
            if (!amount || amount <= 0) continue;

            finalTransactions.push({
              title: (parsed?.description || t.text).slice(0, 100),
              amount,
              type: t.type?.toLowerCase().includes("credit") ? "income" : "expense",
              category: parsed?.category || "misc",
              date: parsed?.date ? new Date(parsed.date) : new Date(),
              description: "Imported via Batch CSV"
            });
          }
        }

        // ✅ Step 3: Database Import
        if (finalTransactions.length === 0) {
          return res.status(400).json({ message: 'No valid transactions found' });
        }

        const result = await TransactionService.importTransactions(req.user.userId, finalTransactions);

        res.status(201).json({
          message: `${result.length} transactions imported successfully`,
          data: { count: result.length, transactions: result }
        });

      } catch (error) {
        console.error("Import Error:", error);
        res.status(500).json({ message: "Import failed" });
      }
    });
})
};