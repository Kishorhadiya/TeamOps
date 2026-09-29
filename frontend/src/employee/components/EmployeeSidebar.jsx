import React from 'react';
import { 
  LayoutDashboard, 
  CalendarOff, 
  Clock, 
  CheckSquare, 
  Calendar, 
  Settings, 
  LogOut, 
  Briefcase,
  Sparkles,
  X,
  ChevronRight
} from 'lucide-react';

export default function EmployeeSidebar({
  activeTab,
  setActiveTab,
  pendingLeaveCount = 0,
  taskCount = 0,
  onLogout,
  employeeUser,
  clockedIn,
  isOpen = false,
  onClose
}) {
  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Leaves', label: 'My Leaves', icon: CalendarOff, badge: pendingLeaveCount > 0 ? pendingLeaveCount : null, badgeColor: 'bg-amber-500' },
    { id: 'Attendance', label: 'Attendance', icon: Clock, badge: clockedIn ? 'LIVE' : null, badgeColor: 'bg-emerald-500' },
    { id: 'Tasks', label: 'My Tasks', icon: CheckSquare, badge: taskCount > 0 ? taskCount : null, badgeColor: 'bg-blue-600' },
    { id: 'Events', label: 'Company Events', icon: Calendar },
    { id: 'Settings', label: 'Profile & Settings', icon: Settings },
  ];

  const getInitials = () => {
    const name = (employeeUser?.username || employeeUser?.name || employeeUser?.email || 'Alex Rivers').trim();
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2 && parts[0] && parts[1]) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Responsive Sidebar Container */}
      <aside 
        className={`w-64 bg-[#111827] text-slate-300 flex flex-col justify-between fixed top-0 bottom-0 left-0 z-50 shadow-2xl border-r border-slate-800 font-sans transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand / Logo & Close for Mobile */}
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/80 bg-[#0F172A]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-lg">
                <Briefcase size={20} />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
                  TeamOps <span className="px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">PORTAL</span>
                </span>
                <p className="text-[11px] text-slate-400 font-medium">Employee Self-Service</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Employee Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white ${item.badgeColor || 'bg-blue-500'} shadow-xs`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-[#0F172A]/70 space-y-3">
          {/* Employee Mini Card */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {getInitials()}
            </div>
            <div className="overflow-hidden flex-1">
              <h4 className="text-xs font-bold text-white truncate">{employeeUser?.username || employeeUser?.name || 'Employee User'}</h4>
              <p className="text-[10px] text-blue-400 font-medium truncate">{employeeUser?.role || 'Team Member'}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600/90 transition-all border border-rose-500/20"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
}
