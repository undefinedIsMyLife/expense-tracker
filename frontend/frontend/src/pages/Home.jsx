import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white overflow-hidden font-sans">
      
      {/* --- BACKGROUND ORBS --- */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-pink-500/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-128 bg-teal-500/10 rounded-full blur-[150px] animate-bounce" style={{ animationDuration: '12s' }}></div>

      {/* --- NAVBAR --- */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M10 5.5h4m-4 3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">ExpenseTracker</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Analytics</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-5 py-2.5 bg-[#161b22] border border-white/10 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl">
            Sign in
          </Link>
          <Link to="/signup" className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-pink-500/25">
            Get Started
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION (SPLIT LAYOUT) --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT COLUMN: TEXT & LOGO */}
          <div className="text-left">
            <div className="inline-block mb-6">
              <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M10 5.5h4m-4 3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-linear-to-b from-white to-slate-500 bg-clip-text text-transparent">
              Track anytime, <br /> anywhere.
            </h1>
            <p className="max-w-lg text-slate-400 text-lg mb-10 leading-relaxed">
              The most intuitive way to manage your expenses. 
              Connect your accounts, categorize spending, and grow your savings with AI-powered insights.
            </p>
            <div className="flex gap-4">
               <Link to="/signup" className="px-8 py-4 bg-pink-600 hover:bg-pink-500 rounded-2xl font-bold transition-all shadow-lg shadow-pink-500/25">
                 Start Tracking
               </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE CARD */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-[#161b22]/80 backdrop-blur-2xl border border-white/10 p-2 rounded-4xl shadow-2xl transition-transform hover:scale-[1.02] duration-500">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-bold text-slate-400">Quick Preview</span>
                    <span className="text-xs bg-teal-500/10 text-teal-400 px-2 py-1 rounded-lg border border-teal-500/20">Live Stats</span>
                </div>
                
                <div className="bg-[#0d1117] p-4 rounded-2xl mb-1 border border-white/5">
                    <p className="text-xs text-slate-500 mb-1">Monthly Income</p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-medium text-white">₹50,000</span>
                      <div className="bg-slate-800 px-3 py-1.5 rounded-xl text-sm flex items-center gap-2 border border-white/5">
                        💰 INR
                      </div>
                    </div>
                </div>

                <div className="flex justify-center -my-3 relative z-10">
                    <div className="bg-[#161b22] p-2 rounded-xl border-4 border-[#0d1117] text-pink-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                    </div>
                </div>

                <div className="bg-[#0d1117] p-4 rounded-2xl mt-1 border border-white/5 mb-6">
                    <p className="text-xs text-slate-500 mb-1">Total Spending</p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-medium text-slate-500">₹12,400</span>
                      <div className="bg-pink-500/10 text-pink-500 px-3 py-1.5 rounded-xl text-sm flex items-center gap-2 border border-pink-500/20">
                        🍕 Food
                      </div>
                    </div>
                </div>

                <button className="w-full py-4 bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 font-bold rounded-2xl transition-all border border-pink-500/20">
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 max-w-7xl mx-auto px-8 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-500 text-sm">
          © 2026 ExpenseTracker. All rights reserved.
        </div>
        <div className="flex gap-8 text-slate-500 text-sm font-medium">
          <a href="#" className="hover:text-pink-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-pink-500 transition-colors">Terms</a>
          <a href="#" className="hover:text-pink-500 transition-colors">Discord</a>
          <a href="#" className="hover:text-pink-500 transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  );
}