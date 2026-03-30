import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);

    try {
      const response = await apiClient.register(formData.email, formData.password, formData.name);
      if (!response.data) {
        setError(response.message || 'Signup failed');
        return;
      }
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0d1117] flex items-center justify-center px-4 overflow-hidden">
      {/* Background Blobs (matching Home/Login) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M10 5.5h4m-4 3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">ExpenseTracker</h1>
          <p className="text-slate-400 text-sm">Manage your finances with ease</p>
        </div>


        <form onSubmit={handleSubmit} className="bg-[#161b22]/70 backdrop-blur-xl rounded-3xl border border-white/10 p-10 shadow-2xl">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="John Doe" required
                className="w-full px-4 py-3 bg-[#0d1117] border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@email.com" required
                className="w-full px-4 py-3 bg-[#0d1117] border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required
                className="w-full px-4 py-3 bg-[#0d1117] border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required
                className="w-full px-4 py-3 bg-[#0d1117] border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all" />
            </div>
          </div>

          {error && <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 text-center">{error}</div>}

          <button type="submit" disabled={loading}
            className="w-full mt-8 bg-pink-500 hover:bg-pink-600 active:scale-[0.98] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-pink-500/25">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-400 hover:text-pink-300 font-semibold underline-offset-4 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}