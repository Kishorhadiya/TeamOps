import React, { useState } from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Menu, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  Activity,
  Users
} from 'lucide-react';

export default function AuthNavbar({ activePortal = 'employee', onAutoFillDemo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <a 
              href={activePortal === 'admin' ? '/admin' : '/'} 
              className="flex items-center gap-3 group transition-transform active:scale-95"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all">
                {activePortal === 'admin' ? <ShieldCheck size={22} /> : <Briefcase size={22} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    TeamOps
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wide ${
                    activePortal === 'admin' 
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' 
                      : 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                  }`}>
                    {activePortal === 'admin' ? 'Admin Suite' : 'Self-Service'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Enterprise Workforce & Operations Platform
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links & Portal Switcher */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
            <a
              href="/"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePortal === 'employee'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Users size={14} className={activePortal === 'employee' ? 'text-blue-600' : 'text-slate-400'} />
              <span>Employee Portal</span>
            </a>

            <a
              href="/admin"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePortal === 'admin'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <ShieldCheck size={14} className={activePortal === 'admin' ? 'text-blue-600' : 'text-slate-400'} />
              <span>Admin Management</span>
            </a>
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Live System Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>API Online</span>
            </div>

            {/* Portal Switch CTA Button */}
            {activePortal === 'employee' ? (
              <a
                href="/admin"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/10 hover:shadow-slate-900/20 transition-all active:scale-95"
              >
                <ShieldCheck size={15} />
                <span>Admin Login</span>
              </a>
            ) : (
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all active:scale-95"
              >
                <Briefcase size={15} />
                <span>Employee Portal</span>
              </a>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3 shadow-xl animate-fadeIn">
          <div className="flex flex-col gap-2">
            <a
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activePortal === 'employee'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase size={16} className={activePortal === 'employee' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Employee Portal</span>
              </div>
              {activePortal === 'employee' && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white">Current</span>
              )}
            </a>

            <a
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activePortal === 'admin'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className={activePortal === 'admin' ? 'text-blue-600' : 'text-slate-400'} />
                <span>Admin Portal</span>
              </div>
              {activePortal === 'admin' && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white">Current</span>
              )}
            </a>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Connected
            </span>
            <span className="font-semibold text-slate-400">PostgreSQL Backend</span>
          </div>
        </div>
      )}
    </header>
  );
}
