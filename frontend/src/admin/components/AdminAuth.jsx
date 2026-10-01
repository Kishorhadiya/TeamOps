import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2
} from 'lucide-react';
import { adminLogin, adminSignup, clearError } from '../store/slices/authSlice';
import AuthNavbar from '../../components/AuthNavbar';
import driverHeroImg from '../../assets/driver_hero.jpg';

export default function AdminAuth() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Screen mode: 'login' | 'signup' | 'forgot'
  const [mode, setMode] = useState('login');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Local state
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Submit Handler for Admin Login & Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(null);
    dispatch(clearError());

    if (mode === 'signup') {
      if (!name.trim()) {
        setLocalError('Please enter administrator name');
        return;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
      if (!agreeTerms) {
        setLocalError('Please agree to the Terms and Conditions');
        return;
      }

      const result = await dispatch(adminSignup({ email: email.trim().toLowerCase(), password }));
      if (adminSignup.fulfilled.match(result)) {
        setSuccess('Admin account created successfully! Please sign in.');
        setMode('login');
      }
      return;
    }

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setLocalError('Please enter your administrator email and password');
        return;
      }

      const result = await dispatch(adminLogin({ email: email.trim().toLowerCase(), password }));
      if (adminLogin.fulfilled.match(result)) {
        setSuccess('Signin successful! Redirecting to admin dashboard...');
      }
    }
  };

  const currentError = localError || error;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-gray-900 selection:bg-[#2A9DFF] selection:text-white">
      {/* Top Navbar */}
      <AuthNavbar activePortal="admin" />

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-gray-100 overflow-hidden transition-all">
          
          {/* ========================================================= */}
          {/* 1. ADMIN LOGIN SCREEN (Matches Figma "Welcome!" Screen) */}
          {/* ========================================================= */}
          {mode === 'login' && (
            <div>
              {/* Driver Hero Image Banner with Gradient Fade to White */}
              <div className="relative w-full h-52 sm:h-60 overflow-hidden bg-gray-100">
                <img 
                  src={driverHeroImg} 
                  alt="TeamOps Admin" 
                  className="w-full h-full object-cover object-center"
                />
                {/* Smooth white gradient overlay fading from middle to bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
              </div>

              {/* Form Container */}
              <div className="px-7 sm:px-9 pt-2 pb-9">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Welcome!
                  </h1>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#2A9DFF] border border-[#2A9DFF]/20">
                    Admin Portal
                  </span>
                </div>

                {currentError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-600 font-medium">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{currentError}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-700 font-medium">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#2A9DFF] focus:ring-2 focus:ring-[#2A9DFF]/20"
                    />
                  </div>

                  {/* Password Field with Eye Toggle */}
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3.5 pr-11 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#2A9DFF] focus:ring-2 focus:ring-[#2A9DFF]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="pt-0.5 text-left">
                    <button
                      type="button"
                      onClick={() => {
                        setLocalError(null);
                        setSuccess(null);
                        setMode('forgot');
                      }}
                      className="text-xs font-semibold text-[#2A9DFF] hover:text-[#1E88E5] transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Primary Login Button (Figma Sky Blue Pill) */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-[#2A9DFF] hover:bg-[#1E88E5] active:scale-[0.99] text-white font-bold text-sm rounded-full shadow-md shadow-[#2A9DFF]/25 hover:shadow-lg hover:shadow-[#2A9DFF]/35 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <span>Login</span>
                    )}
                  </button>
                </form>

                {/* Footer Link: Not a member? Register now */}
                <div className="mt-8 text-center">
                  <p className="text-xs text-gray-500 font-medium">
                    Not a member?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setLocalError(null);
                        setSuccess(null);
                        setMode('signup');
                      }}
                      className="font-semibold text-[#2A9DFF] hover:underline"
                    >
                      Register now
                    </button>
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. ADMIN SIGN UP SCREEN (Matches Figma "Sign up" Screen) */}
          {/* ========================================================= */}
          {mode === 'signup' && (
            <div className="px-7 sm:px-9 py-8">
              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  setLocalError(null);
                  setSuccess(null);
                  setMode('login');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-5"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Sign up
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                  Create an admin account to get started
                </p>
              </div>

              {currentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-600 font-medium">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{currentError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Admin Name */}
                <div>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#2A9DFF] focus:ring-2 focus:ring-[#2A9DFF]/20"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#2A9DFF] focus:ring-2 focus:ring-[#2A9DFF]/20"
                  />
                </div>

                {/* Password with Eye Toggle and Hint */}
                <div>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3.5 pr-11 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#2A9DFF] focus:ring-2 focus:ring-[#2A9DFF]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5 pl-1">
                    Minimum 6 characters. At least one number
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-3.5 pr-11 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#2A9DFF] focus:ring-2 focus:ring-[#2A9DFF]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input 
                    type="checkbox"
                    id="adminTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#2A9DFF] border-gray-300 focus:ring-[#2A9DFF] cursor-pointer"
                  />
                  <label htmlFor="adminTerms" className="text-xs text-gray-600 leading-snug cursor-pointer select-none">
                    I've read and agree with the{' '}
                    <span className="text-[#2A9DFF] font-semibold hover:underline">Terms and Conditions</span>
                    {' '}and the{' '}
                    <span className="text-[#2A9DFF] font-semibold hover:underline">Privacy Policy</span>.
                  </label>
                </div>

                {/* Sign up Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-[#2A9DFF] hover:bg-[#1E88E5] active:scale-[0.99] text-white font-bold text-sm rounded-full shadow-md shadow-[#2A9DFF]/25 hover:shadow-lg hover:shadow-[#2A9DFF]/35 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Admin Account...</span>
                    </div>
                  ) : (
                    <span>Sign up</span>
                  )}
                </button>
              </form>

              {/* Footer Link: Already have an account? Log in */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 font-medium">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setLocalError(null);
                      setSuccess(null);
                      setMode('login');
                    }}
                    className="font-semibold text-[#2A9DFF] hover:underline"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. FORGOT PASSWORD SCREEN */}
          {/* ========================================================= */}
          {mode === 'forgot' && (
            <div className="px-7 sm:px-9 py-8">
              {/* Back Button */}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-5"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Reset Password
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Enter your administrator email address to reset your password.
                </p>
              </div>

              {success ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={28} />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Reset instructions sent to {email}
                  </p>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full py-3 px-4 bg-[#2A9DFF] text-white font-bold text-sm rounded-full"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!email) {
                      setLocalError('Please enter your email');
                      return;
                    }
                    setSuccess('Reset link has been dispatched');
                  }} 
                  className="space-y-4"
                >
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#2A9DFF] focus:ring-2 focus:ring-[#2A9DFF]/20"
                  />

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-[#2A9DFF] hover:bg-[#1E88E5] text-white font-bold text-sm rounded-full shadow-md shadow-[#2A9DFF]/25 hover:shadow-lg transition-all"
                  >
                    Send Reset Link
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-gray-200/80 bg-white text-center text-xs text-gray-400">
        © 2026 TeamOps Systems. All rights reserved.
      </footer>
    </div>
  );
}
