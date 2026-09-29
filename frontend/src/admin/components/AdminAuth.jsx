import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  KeyRound,
  Sparkles,
  Briefcase
} from 'lucide-react';
import { adminLogin, adminSignup, clearError } from '../store/slices/authSlice';
import AuthNavbar from '../../components/AuthNavbar';

export default function AdminAuth() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFillDemo = () => {
    setLocalError(null);
    setSuccess(null);
    dispatch(clearError());
    setEmail('admin@gmail.com');
    setPassword('admin123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(null);
    dispatch(clearError());

    if (isSignUp && password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (isSignUp) {
      const result = await dispatch(adminSignup({ email, password }));
      if (adminSignup.fulfilled.match(result)) {
        setSuccess('Admin account created successfully!');
      }
    } else {
      const result = await dispatch(adminLogin({ email, password }));
      if (adminLogin.fulfilled.match(result)) {
        setSuccess('Signin successful! Redirecting to admin dashboard...');
      }
    }
  };

  const currentError = localError || error;

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Responsive Navbar */}
      <AuthNavbar activePortal="admin" />

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-all">
          
          {/* Left Side Visual Banner */}
          <div className="bg-[#1A2035] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-xl mb-5 shadow-lg shadow-blue-600/30">
                <ShieldCheck size={24} className="text-white" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
                <Sparkles size={13} className="text-blue-400" /> Admin Control & Governance
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                TeamOps Admin Portal
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Centralized dashboard to manage employees, review & approve leaves, dispatch task assignments, and organize enterprise schedules.
              </p>
            </div>

            <div className="space-y-3 relative z-10 my-6">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                <ShieldCheck className="text-emerald-400 shrink-0" size={18} />
                <div>
                  <h4 className="text-xs font-bold text-white">PostgreSQL Enterprise Auth</h4>
                  <p className="text-[11px] text-slate-400">Secured via adminauth controller and JWT sessions</p>
                </div>
              </div>
            </div>

            {/* Quick Demo Autofill Button */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">Need quick testing?</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all active:scale-95 shadow-sm"
              >
                <Zap size={13} className="text-amber-400" />
                <span>Fill Demo Admin</span>
              </button>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Right Side Form */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            
            {/* Tab Switcher Pills */}
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-6 border border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setLocalError(null);
                  setSuccess(null);
                  dispatch(clearError());
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  !isSignUp
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Admin Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setLocalError(null);
                  setSuccess(null);
                  dispatch(clearError());
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSignUp
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Register Admin
              </button>
            </div>

            <div className="mb-5">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {isSignUp ? 'Create Admin Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {isSignUp 
                  ? 'Register your admin credentials for team oversight and settings' 
                  : 'Enter your administrator credentials to sign in'}
              </p>
            </div>

            {currentError && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-700 font-semibold animate-pulse">
                <AlertCircle size={17} className="shrink-0" />
                <span>{currentError}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-700 font-semibold">
                <CheckCircle2 size={17} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Admin Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@teamops.com"
                    className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                    <input 
                      type="password" 
                      required 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 font-medium transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing...</span>
                  </div>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Administrator Account' : 'Sign In to Dashboard'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Switchers & Links */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <button 
                type="button" 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setLocalError(null);
                  setSuccess(null);
                  dispatch(clearError());
                }}
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                {isSignUp ? 'Already registered? Sign In' : 'Need an admin account? Register'}
              </button>

              <a 
                href="/"
                className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60"
              >
                <Briefcase size={14} className="text-blue-600" />
                <span>Employee Portal →</span>
              </a>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400">
        © 2026 TeamOps Systems. PostgreSQL Enterprise Architecture.
      </footer>
    </div>
  );
}
