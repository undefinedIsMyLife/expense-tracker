import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Profile() {
  const { token, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [type, setType] = useState('expense');
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (token) {
      console.log('Profile component mounted/token changed, fetching profile...');
      fetchUserProfile();
    } else {
      console.log('No token available');
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      console.log('Starting profile fetch with token:', token);
      
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Profile response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Profile error:', errorData);
        throw new Error(errorData.message || 'Failed to fetch profile');
      }
      
      const result = await response.json();
      console.log('Complete profile response:', result);
      console.log('User data:', result.data?.user);
      console.log('Categories:', result.data?.categories);
      
      setUserData(result.data?.user);
      if (result.data?.categories) {
        setCategories(result.data.categories);
        console.log('Categories set to:', result.data.categories);
      } else {
        console.warn('No categories in response');
      }
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    setUpdating(true);
    try {
      const updatedCategories = {
        ...categories,
        [type]: [...(categories[type] || []), newCategory.toLowerCase().trim()]
      };

      const response = await fetch(`${API_BASE_URL}/auth/categories`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categories: updatedCategories })
      });

      if (!response.ok) throw new Error('Failed to update categories');

      setCategories(updatedCategories);
      setNewCategory('');
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveCategory = async (categoryToRemove) => {
    setUpdating(true);
    try {
      const updatedCategories = {
        ...categories,
        [type]: categories[type].filter(cat => cat !== categoryToRemove)
      };

      const response = await fetch(`${API_BASE_URL}/auth/categories`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categories: updatedCategories })
      });

      if (!response.ok) throw new Error('Failed to update categories');

      setCategories(updatedCategories);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
        <p className="animate-pulse text-slate-400">Loading profile...</p>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => fetchUserProfile()}
            className="px-4 py-2 bg-pink-500 rounded-lg hover:bg-pink-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Profile Info Card */}
        <div className="bg-[#161b22]/70 backdrop-blur-xl rounded-4xl border border-white/10 p-8 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-linear-to-tr from-pink-500 to-violet-600 p-1">
            <div className="w-full h-full rounded-full bg-[#0d1117] flex items-center justify-center overflow-hidden">
              <img src="/avatar-glass.png" alt="Profile" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{userData?.name || 'User'}</h1>
            <p className="text-slate-400 text-lg">{userData?.email || 'No email'}</p>
          </div>
        </div>

        {/* Category Manager */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#161b22]/70 rounded-4xl border border-white/10 p-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Manage Categories</h3>
            
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-2 bg-slate-900 rounded text-xs text-slate-400 font-mono">
                <p>Categories loaded: {Object.keys(categories).length > 0 ? 'YES' : 'NO'}</p>
                <p>{type} count: {categories[type]?.length || 0}</p>
              </div>
            )}
            
            {/* Tab Buttons */}
            <div className="flex bg-[#0d1117] p-1 rounded-xl mb-6">
              <button 
                onClick={() => setType('expense')} 
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${type === 'expense' ? 'bg-pink-500 text-white' : 'text-slate-500'}`}
              >
                Expense
              </button>
              <button 
                onClick={() => setType('income')} 
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${type === 'income' ? 'bg-blue-500 text-white' : 'text-slate-500'}`}
              >
                Income
              </button>
            </div>
            
            {/* Existing Categories */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {categories[type]?.length > 0 ? (
                  categories[type].map(cat => (
                    <div 
                      key={cat} 
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs lowercase flex items-center gap-2 hover:bg-white/10 transition-all group"
                    >
                      {cat}
                      <button
                        onClick={() => handleRemoveCategory(cat)}
                        disabled={updating}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs">No {type} categories found</p>
                )}
              </div>

              {/* Add New Category */}
              <div className="flex gap-2 mt-4">
                <input 
                  type="text"
                  placeholder={`Add new ${type}...`}
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  className="flex-1 px-3 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-pink-500"
                />
                <button 
                  onClick={handleAddCategory}
                  disabled={updating || !newCategory.trim()}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-slate-600 rounded-lg text-xs font-bold transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#161b22]/70 rounded-4xl border border-white/10 p-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Connected Banks</h3>
            <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-slate-500 hover:border-pink-500/50 hover:text-pink-500 transition-all">
              + Connect Bank
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 rounded-4xl border border-red-500/10 p-8 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-2">Danger Zone</h3>
            <p className="text-xs text-slate-400">Delete your account and all associated data</p>
          </div>
          <button 
            onClick={logout}
            className="px-6 py-2 bg-red-500/10 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/20 transition-all font-bold"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
