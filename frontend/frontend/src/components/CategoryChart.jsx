import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const INCOME_COLORS = ['#2dd4bf', '#0ea5e9', '#6366f1', '#0d9488'];
const EXPENSE_COLORS = ['#f43f5e', '#fb923c', '#facc15', '#ec4899'];

export default function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex items-center justify-center h-80">
        <p className="text-slate-500">No transactions recorded</p>
      </div>
    );
  }

  // 1. Calculate Totals & Net Balance
  const totalIncome = data
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const totalExpense = data
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const totalVolume = totalIncome + totalExpense;

  // 2. Process Data: Group < 1% and Assign Dynamic Colors
  const processedData = data.reduce((acc, curr) => {
    const percentage = (curr.amount / totalVolume) * 100;
    const key = percentage < 1 ? 'Others' : curr.category;

    if (!acc[key]) {
      acc[key] = { category: key, amount: 0, type: curr.type };
    }
    acc[key].amount += curr.amount;
    return acc;
  }, {});

  const chartData = Object.values(processedData)
    .sort((a, b) => b.type.localeCompare(a.type) || b.amount - a.amount)
    .map((item, index) => ({
      ...item,
      fill: item.category === 'Others' 
        ? '#64748b' 
        : (item.type === 'income' ? INCOME_COLORS[index % 4] : EXPENSE_COLORS[index % 4])
    }));

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold text-slate-200">Financial Overview</h3>
        <div className="flex gap-4 text-xs font-medium">
          <span className="text-teal-400">● Income</span>
          <span className="text-rose-500">● Expense</span>
        </div>
      </div>

      <div className="h-87.5 w-120 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={3}
              dataKey="amount"
              nameKey="category"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill} 
                  // Visual border to emphasize the type
                  stroke={entry.type === 'income' ? '#115e59' : '#9f1239'} 
                  strokeWidth={1}
                />
              ))}
            </Pie>

            {/* Central Stats Summary */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" dy="-4em" fontSize="12" fill="#94a3b8" fontWeight="500">
                NET BALANCE
              </tspan>
              <tspan 
                x="50%" 
                dy="1.6em" 
                fontSize="24" 
                fontWeight="bold" 
                fill={netBalance >= 0 ? '#2dd4bf' : '#f43f5e'}
              >
                {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString()}
              </tspan>
            </text>

            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
              itemStyle={{ fontSize: '12px' }}
              formatter={(value, name, props) => [
                `₹${value.toLocaleString()}`, 
                `${props.payload.type.toUpperCase()}: ${name}`
              ]}
            />
            
            <Legend 
              verticalAlign="bottom" 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingTop: '30px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Summary Bar */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
        <div className="text-center">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Total Income</p>
          <p className="text-teal-400 font-bold">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="text-center border-l border-slate-800">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Total Expense</p>
          <p className="text-rose-500 font-bold">₹{totalExpense.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}