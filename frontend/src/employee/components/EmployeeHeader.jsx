import React, { useState } from 'react';
import { Search, Bell, Settings, LogOut, Menu, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export default function EmployeeHeader({ 
  activeTab, 
  searchQuery, 
  setSearchQuery, 
  notifications = [], 
  setNotifications, 
  onLogout, 
  setActiveTab, 
  employeeUser,
  clockedIn,
  onToggleSidebar 
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getInitials = () => {
    const name = (employeeUser?.username || employeeUser?.name || employeeUser?.email || 'Alex Rivers').trim();
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2 && parts[0] && parts[1]) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-200/60 sticky top-0 z-20 shadow-xs">
      
      {/* Left: Mobile Hamburger & Active Tab Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">{activeTab}</h1>
          <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block font-medium">Employee Self-Service Workspace</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, leaves, events..." 
            className="pl-10 pr-4 py-2 bg-slate-100/80 border border-slate-200/60 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none w-48 sm:w-64 lg:w-80 transition-all shadow-inner"
          />
        </div>

        {/* Live Attendance Status Indicator Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50">
          <span className={`w-2 h-2 rounded-full ${clockedIn ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
          <span className="text-[11px] font-bold text-slate-700">
            {clockedIn ? 'Clocked In' : 'Off Clock'}
          </span>
        </div>

        {/* Notification Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 sm:p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/60"
          >
            <Bell size={18} />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 rounded-full text-[10px] text-white font-bold flex items-center justify-center border border-white">
                {notifications.filter(n => n.unread).length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-800">Notifications</h4>
                <button 
                  onClick={() => setNotifications && setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                  className="text-[11px] text-blue-600 hover:underline font-semibold"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-slate-50 ${n.unread ? 'bg-blue-50/40' : ''}`}>
                      <p className="text-xs text-slate-700 font-medium">{n.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">No new notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Top Right */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 border border-slate-200/80 p-1 sm:p-1.5 sm:pr-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
              {getInitials()}
            </div>
            <span className="text-xs font-bold text-slate-700 hidden sm:block truncate max-w-[120px]">
              {employeeUser?.username || employeeUser?.name || 'Employee'}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 truncate">{employeeUser?.username || employeeUser?.name || 'Employee'}</p>
                <p className="text-[11px] text-slate-400 truncate">{employeeUser?.email || 'employee@teamops.com'}</p>
              </div>
              <button 
                onClick={() => { setActiveTab('Settings'); setShowProfileMenu(false); }}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition-colors"
              >
                <Settings size={15} className="text-slate-400" /> Profile & Settings
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button 
                onClick={() => { onLogout(); setShowProfileMenu(false); }}
                className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-bold transition-colors"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
