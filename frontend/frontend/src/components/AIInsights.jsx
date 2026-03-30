import { useEffect, useState } from 'react';

export default function AIInsights({ analytics }) {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (!analytics) return;

    const newInsights = [];
    const { summary, categoryBreakdown } = analytics;

    // Insight 1: Category spending
    if (categoryBreakdown && categoryBreakdown.length > 0) {
      const expenseCategories = categoryBreakdown.filter(c => c.type === 'expense');
      const totalExpense = summary?.totalExpense || 1;

      expenseCategories.forEach(cat => {
        const percentage = Math.round((cat.amount / totalExpense) * 100);
        if (percentage > 15) {
          newInsights.push({
            type: 'category',
            message: `💰 You spent ${percentage}% of your expenses on ${cat.category}`,
            emoji: '📊'
          });
        }
      });
    }

    // Insight 2: Income vs Expense ratio
    const income = summary?.totalIncome || 0;
    const expense = summary?.totalExpense || 0;
    if (income > 0) {
      const ratio = Math.round((expense / income) * 100);
      if (ratio > 50) {
        newInsights.push({
          type: 'ratio',
          message: `⚠️ You spent ${ratio}% of your income this month`,
          emoji: '📈'
        });
      } else if (ratio < 30) {
        newInsights.push({
          type: 'ratio',
          message: `🎉 Great job! You saved ${100 - ratio}% of your income`,
          emoji: '✨'
        });
      }
    }

    // Insight 3: Balance status
    if (summary?.balance < 0) {
      newInsights.push({
        type: 'balance',
        message: `⚠️ Your balance is negative. Consider reducing expenses.`,
        emoji: '💔'
      });
    } else if (summary?.balance > expense * 2) {
      newInsights.push({
        type: 'balance',
        message: `✅ Healthy balance! You have good savings.`,
        emoji: '💚'
      });
    }

    setInsights(newInsights.slice(0, 3)); // Show top 3 insights
  }, [analytics]);

  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">💡 Smart Insights</h3>
      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg bg-slate-50 border-l-4 border-pink-500 flex items-start gap-3"
          >
            <span className="text-lg">{insight.emoji}</span>
            <p className="text-sm text-slate-700">{insight.message}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-4">
        Note: For advanced AI insights, connect your ChatGPT API key in settings
      </p>
    </div>
  );
}
