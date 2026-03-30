import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TransactionsTable from '../components/TransactionsTable';

export default function TransactionsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllTransactions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAllTransactions();
  }, [token]);

  // Filter logic for the search bar
  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans p-8">
      {/* Background Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-125 h-125 bg-pink-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-300 mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="text-slate-400 hover:text-pink-500 flex items-center gap-2 mb-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold">All Transactions</h1>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input 
              type="text"
              placeholder="Search description or category..."
              className="w-full bg-[#161b22] border border-white/10 rounded-2xl px-5 py-3 pl-12 focus:outline-none focus:border-pink-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-4 top-3.5 text-slate-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {/* Full Table Card */}
        <div className="bg-[#161b22]/70 backdrop-blur-xl rounded-4xl border border-white/10 p-6 overflow-hidden">
          <TransactionsTable 
            transactions={filteredTransactions} 
            loading={loading}
            onDelete={fetchAllTransactions} // Refresh list after delete
          />
          
          {filteredTransactions.length === 0 && !loading && (
            <div className="text-center py-20 text-slate-500">
              <p className="text-lg">No transactions found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}