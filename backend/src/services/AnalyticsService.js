import { Transaction } from '../models/Transaction.js';
import mongoose from 'mongoose';

export class AnalyticsService {
  // Get comprehensive analytics using MongoDB aggregation
  static async getAnalytics(userId, { startDate, endDate } = {}) {
   const userObjectId = new mongoose.Types.ObjectId(userId);

    const matchStage = { 
    $match: { userId: userObjectId } 
    };

    // Add date range filter if provided
    if (startDate || endDate) {
      matchStage.$match.date = {};
      if (startDate) matchStage.$match.date.$gte = new Date(startDate);
      if (endDate) matchStage.$match.date.$lte = new Date(endDate);
    }

    const pipeline = [
      matchStage,
      {
        $facet: {
          // Total balance, income, and expense
          summary: [
            {
              $group: {
                _id: null,
                totalIncome: {
                  $sum: {
                    $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
                  }
                },
                totalExpense: {
                  $sum: {
                    $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
                  }
                }
              }
            },
            {
              $project: {
                _id: 0,
                totalIncome: 1,
                totalExpense: 1,
                balance: { $subtract: ['$totalIncome', '$totalExpense'] }
              }
            }
          ],
          // Category breakdown
          categoryBreakdown: [
            {
              $group: {
                _id: {
                  type: '$type',
                  category: '$category'
                },
                amount: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            },
            {
              $sort: { amount: -1 }
            },
            {
              $project: {
                _id: 0,
                type: '$_id.type',
                category: '$_id.category',
                amount: 1,
                count: 1
              }
            }
          ],
          // Monthly trend
          monthlyTrend: [
            {
              $group: {
                _id: {
                  year: { $year: '$date' },
                  month: { $month: '$date' }
                },
                income: {
                  $sum: {
                    $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
                  }
                },
                expense: {
                  $sum: {
                    $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
                  }
                }
              }
            },
            {
              $sort: { '_id.year': 1, '_id.month': 1 }
            },
            {
              $project: {
                _id: 0,
                date: {
                  $dateFromParts: {
                    year: '$_id.year',
                    month: '$_id.month',
                    day: 1
                  }
                },
                income: 1,
                expense: 1
              }
            }
          ]
        }
      }
    ];

    const result = await Transaction.aggregate(pipeline);
    
    return {
      summary: result[0].summary[0] || { balance: 0, totalIncome: 0, totalExpense: 0 },
      categoryBreakdown: result[0].categoryBreakdown,
      monthlyTrend: result[0].monthlyTrend
    };
  }
}
