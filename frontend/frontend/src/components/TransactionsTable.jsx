import { useState } from 'react';
import { formatDate } from '../utils/formatting';

export default function TransactionsTable({ transactions, onDelete, loading }) {
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-center h-48">
          <p className="text-slate-500">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-center h-48">
          <p className="text-slate-500">No transactions yet</p>
        </div>
      </div>
    );
  }

  const displayedTransactions = showAll ? transactions : transactions.slice(0, 5);
  const hasMore = transactions.length > 5;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Type</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">Amount</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedTransactions.map((transaction) => (
              <tr key={transaction._id} className="border-b border-slate-200 hover:border-slate-200 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-800 font-medium">{transaction.title}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <span className="px-6 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium capitalize">
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <span className={`px-3 py-1 rounded text-xs font-medium capitalize ${
                    transaction.type === 'income'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm font-semibold text-right ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onDelete(transaction._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-pink-500 hover:text-pink-600 transition"
          >
            {showAll ? '▲ Show less' : `▼ Show all ${transactions.length} transactions`}
          </button>
        </div>
      )}
    </div>
  );
}
