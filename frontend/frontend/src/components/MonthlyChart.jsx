import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function MonthlyChart({ monthlyTrend }) {
  if (!monthlyTrend || monthlyTrend.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 h-64 flex items-center justify-center">
        <p className="text-slate-500">No data available</p>
      </div>
    );
  }

  const data = monthlyTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    Income: item.income || 0,
    Expense: item.expense || 0
  }));

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">📊 Monthly Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#1e293b'
            }}
            formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
          />
          <Legend />
          <Bar dataKey="Income" fill="#10b981" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
