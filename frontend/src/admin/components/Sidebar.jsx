import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  FileText, 
  Settings, 
  User, 
  Clock, 
  LogOut,
  X,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  employeeCount, 
  pendingLeaveCount, 
  eventCount, 
  taskCount, 
  onLogout, 
  adminUser,
  isOpen = false,
  onClose
}) {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, badge: null },
    { name: 'Employees', icon: Users, badge: employeeCount },
    { name: 'Leave', icon: Clock, badge: pendingLeaveCount },
    { name: 'Events', icon: CalendarIcon, badge: eventCount },
    { name: 'Tasks', icon: CheckSquare, badge: taskCount },
    { name: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed left-0 top-0 bottom-0 h-screen w-64 bg-[#1A2035] text-white flex flex-col justify-between shadow-2xl z-50 transition-transform duration-300 ease-in-out font-sans ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/5 bg-[#141A2E]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">TeamOps Admin</span>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile Info */}
          <div className="px-6 py-4 flex items-center gap-3.5 border-b border-white/5 bg-white/[0.02]">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center border border-white/10 shadow-inner">
                {adminUser?.username ? adminUser.username.slice(0, 2).toUpperCase() : (adminUser?.email ? adminUser.email.slice(0, 2).toUpperCase() : 'AH')}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1A2035]" />
            </div>
            <div className="overflow-hidden">
              <h3 className="text-xs font-bold text-white leading-tight truncate">
                {adminUser?.email ? adminUser.email.split('@')[0] : 'Alex Harper'}
              </h3>
              <p className="text-[10px] text-blue-400 mt-0.5 font-medium">Administrator</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Admin Menu
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-white/5 bg-[#141A2E]/60">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600/90 transition-all border border-rose-500/20"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
