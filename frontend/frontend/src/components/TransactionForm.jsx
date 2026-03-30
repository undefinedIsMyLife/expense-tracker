import { useState, useEffect, useRef } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function TransactionForm({ onSubmit, onCancel, categories = { income: [], expense: [] }, loading, token }) {
  // Use optional chaining and fallbacks to prevent "Cannot read property of undefined"
  const incomeCats = categories?.income || [];
  const expenseCats = categories?.expense || [];

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    customCategory: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [useCustom, setUseCustom] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Sync initial category when type changes or categories load
  useEffect(() => {
    const available = formData.type === 'income' ? incomeCats : expenseCats;
    if (available.length > 0 && !useCustom && !formData.category) {
      setFormData(prev => ({ ...prev, category: available[0] }));
    }
  }, [formData.type, categories, useCustom]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { 
      ...formData,
      // If using custom, override the category field with the custom input
      category: useCustom ? formData.customCategory : formData.category 
    };
    
    if (!finalData.category) {
      alert("Please select or enter a category");
      return;
    }
    onSubmit(finalData);
  };

  const handleCSVImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Please select a valid CSV file');
      return;
    }

    setCsvLoading(true);
    try {
      const formDataFile = new FormData();
      formDataFile.append('file', file);

      const response = await fetch(`${API_BASE_URL}/transactions/import-csv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataFile
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to import CSV');
      }

      const result = await response.json();
      alert(`✅ ${result.data.count} transactions imported successfully!`);
      
      // Trigger parent refresh
      if (onSubmit) {
        onSubmit({ refetch: true });
      }
    } catch (error) {
      alert(`❌ Import failed: ${error.message}`);
    } finally {
      setCsvLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-[#161b22] border border-white/10 rounded-3xl p-6 w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-200">
      {/* Close Button */}
      <button 
        type="button"
        onClick={onCancel} 
        className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <h2 className="text-lg font-bold mb-5 text-white">Add Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Compact Toggle */}
        <div className="flex bg-[#0d1117] p-1 rounded-xl border border-white/5">
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setFormData({ ...formData, type: t, category: (t === 'income' ? incomeCats[0] : expenseCats[0]) || '' });
                setUseCustom(false);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                formData.type === t ? 'bg-pink-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Title (e.g. Weekly Groceries)"
          className="w-full bg-[#0d1117] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-pink-500/50 outline-none transition-all"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        {/* Amount Input */}
        <div className="relative">
          <span className="absolute left-4 top-2.5 text-slate-500 text-sm">₹</span>
          <input
            type="number"
            placeholder="0.00"
            className="w-full bg-[#0d1117] border border-white/5 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-pink-500/50 outline-none"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          {!useCustom ? (
            <select
              className="w-full bg-[#0d1117] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white outline-none cursor-pointer hover:border-white/10"
              value={formData.category}
              onChange={(e) => {
                if (e.target.value === "ADD_CUSTOM") {
                  setUseCustom(true);
                } else {
                  setFormData({ ...formData, category: e.target.value });
                }
              }}
            >
              {(formData.type === 'income' ? incomeCats : expenseCats).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="ADD_CUSTOM" className="text-pink-400">+ Add Custom...</option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                autoFocus
                placeholder="New Category Name"
                className="flex-1 bg-[#0d1117] border border-pink-500/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                value={formData.customCategory}
                onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
              />
              <button 
                type="button"
                onClick={() => setUseCustom(false)}
                className="px-3 bg-white/5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Back
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <input 
            type="date" 
            className="bg-transparent text-[11px] text-slate-500 uppercase font-bold tracking-wider outline-none hover:text-slate-300 transition-colors"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={loading || csvLoading}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-pink-500/20 active:scale-[0.98]"
        >
          {loading ? 'Processing...' : 'Save Transaction'}
        </button>

        {/* Hidden CSV file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleCSVImport}
          className="hidden"
        />

        {/* CSV Import Link */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={csvLoading}
            className="text-slate-500 text-xs hover:text-pink-500 underline transition-all disabled:opacity-50"
          >
            {csvLoading ? '⏳ Importing CSV...' : '📥 Import from CSV'}
          </button>
        </div>
      </form>
    </div>
  );
}