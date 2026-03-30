import { useState } from 'react';

export default function DateFilter({ onFilter }) {
  const [showFilter, setShowFilter] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: new Date().toISOString().split('T')[0]
  });

  const handleApplyFilter = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    onFilter({
      startDate: dateRange.startDate || thirtyDaysAgo.toISOString().split('T')[0],
      endDate: dateRange.endDate
    });
    setShowFilter(false);
  };

  const handleQuickFilter = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    onFilter({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
    setShowFilter(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
      >
        📅 Filter
      </button>

      {showFilter && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-4 z-40">
          <h3 className="text-sm font-600 text-slate-800 mb-3">Filter by Date</h3>

          {/* Quick filters */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => handleQuickFilter(7)}
              className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
            >
              Last 7 days
            </button>
            <button
              onClick={() => handleQuickFilter(30)}
              className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
            >
              Last 30 days
            </button>
            <button
              onClick={() => handleQuickFilter(90)}
              className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
            >
              Last 90 days
            </button>
            <button
              onClick={() => handleQuickFilter(365)}
              className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
            >
              This year
            </button>
          </div>

          {/* Custom date range */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div>
              <label className="block text-xs font-500 text-slate-700 mb-1">From</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-xs font-500 text-slate-700 mb-1">To</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <button
              onClick={handleApplyFilter}
              className="w-full px-3 py-2 text-sm font-medium bg-pink-500 text-white rounded hover:bg-pink-600 transition"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
