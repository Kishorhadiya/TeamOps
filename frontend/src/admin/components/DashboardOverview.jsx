import React, { useState, useEffect } from 'react';
import { 
  User, Clock, Plus, MoreVertical,
  ChevronLeft, ChevronRight,
  LogIn, LogOut, Database, Activity
} from 'lucide-react';
import { LEAVE_API } from '../../config/api';

export default function DashboardOverview({ 
  leaveRequests = [], 
  events = [], 
  tasks = [], 
  myTasks = [],
  toggleMyTask, 
  progressPercent,
  handleApproveLeave, 
  handleRejectLeave,
  setIsAddLeaveOpen, 
  setIsAddEventOpen, 
  setIsAddTaskOpen,
  employees = [], 
  showToast
}) {
  // Persistent clock state across reload
  const [clockedIn, setClockedIn] = useState(() => {
    try {
      const saved = localStorage.getItem('adminClockState');
      if (saved) return !!JSON.parse(saved).clockedIn;
    } catch {}
    return false;
  });

  const [clockInTime, setClockInTime] = useState(() => {
    try {
      const saved = localStorage.getItem('adminClockState');
      if (saved) return JSON.parse(saved).clockInTime || null;
    } catch {}
    return null;
  });

  const [clockOutTime, setClockOutTime] = useState(() => {
    try {
      const saved = localStorage.getItem('adminClockState');
      if (saved) return JSON.parse(saved).clockOutTime || null;
    } catch {}
    return null;
  });

  const [secondsWorked, setSecondsWorked] = useState(() => {
    try {
      const saved = localStorage.getItem('adminClockState');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.clockedIn && parsed.clockInTimestamp) {
          return Math.max(0, Math.floor((Date.now() - parsed.clockInTimestamp) / 1000));
        }
      }
    } catch {}
    return 0;
  });

  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());
  const [liveDate, setLiveDate] = useState(
    new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  );

  // Backend stats
  const [backendStats, setBackendStats] = useState({
    activeEmployees: employees?.length || 0,
    pendingLeave: leaveRequests?.filter(r => r.status === 'Pending').length || 0,
  });

  // Sync stats when props change
  useEffect(() => {
    setBackendStats({
      activeEmployees: employees?.length || 0,
      pendingLeave: leaveRequests?.filter(r => r.status === 'Pending').length || 0,
    });
  }, [employees, leaveRequests]);

  // Fetch real stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${LEAVE_API}/stats`);
        if (res.ok) {
          const data = await res.json();
          setBackendStats({
            activeEmployees: data.activeEmployees || employees?.length || 0,
            pendingLeave: data.pendingLeave ?? leaveRequests?.filter(r => r.status === 'Pending').length ?? 0,
          });
        }
      } catch {
        // keep current values
      }
    };
    fetchStats();
    const t = setInterval(fetchStats, 15000);
    return () => clearInterval(t);
  }, []);

  // Live clock + session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
      setLiveDate(new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
      if (clockedIn) {
        try {
          const saved = localStorage.getItem('adminClockState');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.clockInTimestamp) {
              setSecondsWorked(Math.max(0, Math.floor((Date.now() - parsed.clockInTimestamp) / 1000)));
              return;
            }
          }
        } catch {}
        setSecondsWorked(s => s + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [clockedIn]);

  const handleClockIn = () => {
    const now = Date.now();
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    localStorage.setItem('adminClockState', JSON.stringify({
      clockedIn: true,
      clockInTime: t,
      clockInTimestamp: now,
    }));
    setClockedIn(true);
    setClockInTime(t);
    setSecondsWorked(0);
    if (showToast) showToast(`Clocked In at ${t}`);
  };

  const handleClockOut = () => {
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    localStorage.setItem('adminClockState', JSON.stringify({
      clockedIn: false,
      clockOutTime: t,
    }));
    setClockedIn(false);
    setClockOutTime(t);
    if (showToast) showToast(`Clocked Out at ${t}`);
  };

  const formatDuration = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(sec).padStart(2,'0')}s`;
  };

  return (
    <div className="space-y-6">

      {/* CLOCK IN & CLOCK OUT WIDGET */}
      <div className="bg-white rounded-3xl p-6 text-slate-800 shadow-md border border-slate-200/80 relative overflow-hidden">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Live Digital Clock Section */}
          <div className="flex items-center gap-5 w-full lg:w-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
              <Clock className={`w-8 h-8 ${clockedIn ? 'text-emerald-500 animate-pulse' : 'text-blue-600'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-mono">{liveTime}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 ${
                  clockedIn 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-700 border border-amber-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${clockedIn ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
                  {clockedIn ? 'Clocked In' : 'Not Clocked In'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">{liveDate} • Daily Shift Portal</p>
              {clockInTime && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Shift Start: <span className="text-emerald-600 font-semibold">{clockInTime}</span> 
                  {clockOutTime && <> | Last Exit: <span className="text-rose-600 font-semibold">{clockOutTime}</span></>}
                </p>
              )}
            </div>
          </div>

          {/* Shift Session Timer Display */}
          <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 text-center w-full lg:w-auto">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Today's Session Duration</span>
            <div className="text-xl font-bold font-mono text-blue-600 mt-0.5">
              {formatDuration(secondsWorked)}
            </div>
          </div>

          {/* PERFECT CLOCK IN & CLOCK OUT BUTTONS */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
            
            {/* Clock In Button (BLUE) */}
            <button
              onClick={handleClockIn}
              disabled={clockedIn}
              className={`flex-1 lg:flex-initial px-6 py-3.5 rounded-2xl font-bold text-xs tracking-wide shadow-md flex items-center justify-center gap-2.5 transition-all duration-300 ${
                clockedIn 
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <LogIn size={18} className={clockedIn ? 'text-slate-400' : 'text-white'} />
              <span>CLOCK IN</span>
            </button>

            {/* Clock Out Button */}
            <button
              onClick={handleClockOut}
              disabled={!clockedIn}
              className={`flex-1 lg:flex-initial px-6 py-3.5 rounded-2xl font-bold text-xs tracking-wide shadow-md flex items-center justify-center gap-2.5 transition-all duration-300 ${
                !clockedIn 
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 hover:shadow-rose-600/50 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <LogOut size={18} className={!clockedIn ? 'text-slate-400' : 'text-white'} />
              <span>CLOCK OUT</span>
            </button>

          </div>

        </div>
      </div>

      {/* TOP METRIC CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Active Employees Card (Backend Real-Time) */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/70 p-6 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
              <User size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-500 tracking-wide uppercase">Active Employees</p>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                  <Database size={10} /> Real-Time Backend
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                {backendStats.activeEmployees}
              </h3>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mt-1">
                <Activity size={14} />
                <span>Live Synchronized with PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Pending Leave Card (Backend Real-Time) */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/70 p-6 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
              <Clock size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-500 tracking-wide uppercase">Pending Leave</p>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold border border-amber-200 flex items-center gap-1">
                  <Database size={10} /> Real-Time Backend
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                {backendStats.pendingLeave}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                {leaveRequests.filter(r => r.status === 'Pending').length} Pending Requests awaiting review
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* MIDDLE ROW CARDS: Leave Management & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEAVE MANAGEMENT CARD (Spans 2 cols) */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/70 p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Leave Management</h2>
                <p className="text-xs text-slate-500">Approve or reject real-time pending staff leaves.</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAddLeaveOpen(true)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Plus size={14} /> Request Leave
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Employee</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Dates</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaveRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 flex items-center gap-3">
                        <img src={req.avatar} alt={req.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                        <span className="text-sm font-semibold text-slate-800">{req.name}</span>
                      </td>
                      <td className="py-3.5 text-sm text-slate-600">{req.type}</td>
                      <td className="py-3.5 text-sm text-slate-600">{req.dates}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                          req.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleApproveLeave(req.id)}
                            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors border border-emerald-200"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectLeave(req.id)}
                            className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors border border-rose-200"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* UPCOMING EVENTS CARD */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/70 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Events</h2>
              <button className="text-slate-400 hover:text-slate-600 p-1"><MoreVertical size={18} /></button>
            </div>

            {/* Calendar Month Selector */}
            <div className="flex justify-between items-center bg-slate-50 px-4 py-2.5 rounded-xl mb-4 border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Calendar: October 2026</span>
              <div className="flex gap-1">
                <button className="p-1 text-slate-500 hover:bg-white rounded border border-slate-200/60 shadow-2xs"><ChevronLeft size={14} /></button>
                <button className="p-1 text-slate-500 hover:bg-white rounded border border-slate-200/60 shadow-2xs"><ChevronRight size={14} /></button>
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-center shadow-2xs">
                      <span className="text-xs font-bold text-slate-800 block">{ev.date}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{ev.title}</h4>
                      <span className="text-xs text-slate-400">{ev.category}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setIsAddEventOpen(true)}
            className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add New Event
          </button>

        </div>

      </div>

      {/* BOTTOM ROW CARDS: Task Management, My Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* TASK MANAGEMENT CARD */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/70 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Task Management</h2>
              <button className="text-slate-400 hover:text-slate-600 p-1"><MoreVertical size={18} /></button>
            </div>

            <div className="space-y-3.5">
              {tasks.slice(0, 3).map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{t.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{t.dueDate}</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        t.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                  <img src={t.avatar} alt={t.assignee} className="w-7 h-7 rounded-full object-cover border border-slate-200" title={t.assignee} />
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setIsAddTaskOpen(true)}
            className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Create Task
          </button>
        </div>

        {/* MY TASKS CHECKLIST CARD */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/70 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">My Tasks</h2>
              <button className="text-slate-400 hover:text-slate-600 p-1"><MoreVertical size={18} /></button>
            </div>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Checklist</p>

            <div className="space-y-3">
              {myTasks.map((t) => (
                <label 
                  key={t.id} 
                  onClick={() => toggleMyTask(t.id)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                >
                  <input 
                    type="checkbox" 
                    checked={t.completed} 
                    onChange={() => {}}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className={`text-xs font-medium leading-relaxed ${t.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {t.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
              <span>Task Completion</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
