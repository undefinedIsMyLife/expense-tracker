import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SummaryCard from '../components/SummaryCard';
import CategoryChart from '../components/CategoryChart';
import TransactionsTable from '../components/TransactionsTable';
import TransactionForm from '../components/TransactionForm';
import DateFilter from '../components/DateFilter';
import AIInsights from '../components/AIInsights';
import MonthlyChart from '../components/MonthlyChart';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState({
    income: ['salary', 'freelance', 'investment'], 
    expense: ['food', 'transport', 'utilities', 'entertainment']
  });

  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      if (result.data?.categories) {
        setCategories(result.data.categories);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.data) setAnalytics(data.data);
    } catch (error) { console.error('Failed to fetch analytics:', error); }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions?limit=50&page=1&startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.data) setTransactions(data.data.transactions);
    } catch (error) { console.error('Failed to fetch transactions:', error); } finally { setLoading(false); }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Delete?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) { fetchTransactions(); fetchAnalytics(); }
    } finally { setDeleting(false); }
  };

  const handleAddTransaction = async (data) => {
    setSubmitting(true);
    try {
      // Handle CSV import trigger (data.refetch flag)
      if (data.refetch) {
        setShowForm(false);
        fetchTransactions();
        fetchAnalytics();
        return;
      }

      // Handle regular transaction creation
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) { 
        setShowForm(false); 
        fetchTransactions(); 
        fetchAnalytics(); 
      }
    } finally { setSubmitting(false); }
  };

  useEffect(() => {
    fetchCategories(); fetchAnalytics(); fetchTransactions();
  }, [token, dateFilter]);

  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white overflow-x-hidden font-sans pb-12">
      
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-125 h-125 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-125 h-125 bg-teal-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="z-40 bg-[#161b22]/60 backdrop-blur-xl border-b border-white/5 sticky top-0">
        <div className="max-w-400 mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
                <span className="font-bold text-xl">E</span>
             </div>
             <h1 className="text-xl font-bold tracking-tight">ExpenseTracker</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <DateFilter onFilter={setDateFilter} />
            <button 
              onClick={() => setShowForm(true)} 
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded-xl font-bold shadow-lg shadow-pink-500/25 transition-all"
            >
              + Add
            </button>
            
            {/* Profile Menu Container */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full border-2 border-pink-500/30 overflow-hidden hover:border-pink-500 transition-all p-0.5 bg-linear-to-br from-pink-500/20 to-black shadow-lg"
              >
                <img 
                  src="/avatar-glass.png" 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover" 
                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + user?.name }}
                />
              </button>

              {showProfileMenu && (
                <>
                  {/* Invisible backdrop to close menu on click outside */}
                  <div className="fixed inset-0 z-[-1]" onClick={() => setShowProfileMenu(false)}></div>
                  <div className="absolute right-0 mt-3 w-52 bg-[#161b22]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Account</p>
                      <p className="text-sm font-medium truncate">{user?.name}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      onClick={() => setShowProfileMenu(false)}
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-pink-500 hover:text-white transition-colors"
                    >
                      My Profile
                    </Link>
                    <button 
                      onClick={logout} 
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-20 max-w-400 mx-auto px-8 py-8">
        
        {/* ROW 1: SUMMARIES + TABLE */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex flex-col gap-8 mt-7 w-full lg:w-120 shrink-0">
            <SummaryCard title="Total Balance" amount={analytics?.summary?.balance || 0} color="teal" />
            <SummaryCard title="Total Income" amount={analytics?.summary?.totalIncome || 0} color="blue" />
            <SummaryCard title="Total Expense" amount={analytics?.summary?.totalExpense || 0} color="pink" />
          </div>

          <div className="flex-1 bg-[#161b22]/70 backdrop-blur-xl rounded-4xl border border-white/10 p-8 flex flex-col h-130">
  
            {/* HEADER CONTAINER: This fixes the alignment */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Recent Transactions
              </h3>
              
              {/* MAXIMIZE BUTTON: Now pinned to the top right */}
              <button 
                onClick={() => navigate('/transactions')} 
                className="p-2 hover:bg-white/10 rounded-xl border border-white/5 transition-all group flex items-center justify-center"
                title="View All Transactions"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-slate-500 group-hover:text-teal-400 transition-colors"
                >
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <TransactionsTable
                transactions={transactions}
                onDelete={handleDeleteTransaction}
                loading={loading}
              />
            </div>

            {/* FOOTER: Optional 'Show all' text link at the bottom */}
           
          </div>
        </div>

        {/* ROW 2: CHART + INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-5 bg-[#161b22]/70 backdrop-blur-xl rounded-4xl border border-white/10 p-10 flex flex-col items-center">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 self-start">Category Breakdown</h3>
            <div className="w-full flex-1 flex items-center justify-center min-h-87.5">
              <CategoryChart data={analytics?.categoryBreakdown || []} />
            </div>
          </div>
          <div className="lg:col-span-7 bg-[#161b22]/70 backdrop-blur-xl rounded-4xl border border-white/10 p-10">
            <AIInsights analytics={analytics} />
          </div>
        </div>

        {/* ROW 3: MONTHLY TREND */}
        <div className="bg-[#161b22]/70 backdrop-blur-xl rounded-4xl border border-white/10 p-10">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Monthly Cashflow</h3>
          <div className="h-100">
            <MonthlyChart monthlyTrend={analytics?.monthlyTrend || []} />
          </div>
        </div>
      </main>

      {/* Transaction Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in zoom-in duration-200">
            {categories.income?.length > 0 ? (
              <TransactionForm 
                onSubmit={handleAddTransaction} 
                onCancel={() => setShowForm(false)} 
                categories={categories}
                loading={submitting}
                token={token}
              />
            ) : (
              <div className="text-white p-10 bg-[#161b22] rounded-4xl  border border-white/10 text-center">
                <p className="animate-pulse">Fetching categories...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}