import React, { useState, useEffect } from 'react';
import { 
  User, Clock, Plus, CheckSquare, Calendar, 
  LogIn, LogOut, Activity, Database, CheckCircle2
} from 'lucide-react';

export default function EmployeeDashboardOverview({
  employeeUser,
  leaves = [],
  tasks = [],
  events = [],
  myTasks = [],
  toggleMyTask,
  progressPercent = 0,
  setIsAddLeaveOpen,
  setIsAddTaskOpen,
  clockedIn,
  onClockIn,
  onClockOut,
  clockInTime,
  clockOutTime,
  secondsWorked,
  showToast,
  setActiveTab
}) {
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());
  const [liveDate, setLiveDate] = useState(
    new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
      setLiveDate(new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(sec).padStart(2,'0')}s`;
  };

  const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;
  const approvedLeaves = leaves.filter((l) => l.status === 'Approved').length;

  return (
    <div className="space-y-6">
      
      {/* Employee Shift & Clock In Widget */}
      <div className="bg-white rounded-3xl p-6 text-slate-800 shadow-md border border-slate-200/80 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Live Digital Clock */}
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
              <p className="text-xs text-slate-500 mt-1 font-medium">{liveDate} • Employee Workday Shift</p>
              {clockInTime && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Shift Start: <span className="text-emerald-600 font-semibold">{clockInTime}</span> 
                  {clockOutTime && <> | Last Exit: <span className="text-rose-600 font-semibold">{clockOutTime}</span></>}
                </p>
              )}
            </div>
          </div>

          {/* Shift Session Timer */}
          <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 text-center w-full lg:w-auto">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Today's Session Duration</span>
            <div className="text-xl font-bold font-mono text-blue-600 mt-0.5">
              {formatDuration(secondsWorked)}
            </div>
          </div>

          {/* Clock In / Out Buttons */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
            <button
              onClick={onClockIn}
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

            <button
              onClick={onClockOut}
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

      {/* Top Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Tasks */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Tasks</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{tasks.length}</h3>
            <p className="text-[11px] text-blue-600 font-semibold mt-0.5">{tasks.filter(t => t.status === 'Completed').length} Completed</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckSquare size={22} />
          </div>
        </div>

        {/* Pending Leaves */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Leaves</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{pendingLeaves}</h3>
            <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Under Admin Review</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>

        {/* Approved Leaves */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Leaves</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{approvedLeaves}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Granted This Year</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Company Events */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Events</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{events.length}</h3>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Corporate Schedule</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar size={22} />
          </div>
        </div>

      </div>

      {/* Middle Grid: Leaves Table & Tasks Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* My Leaves Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">My Leave Applications</h3>
                <p className="text-xs text-slate-500">Real-time status of your requested time-off</p>
              </div>
              <button
                onClick={() => setIsAddLeaveOpen(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} /> Apply Leave
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Type / Reason</th>
                    <th className="pb-3">Duration</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {leaves.length > 0 ? (
                    leaves.slice(0, 4).map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-semibold text-slate-900">{l.type}</td>
                        <td className="py-3 text-slate-500 font-mono text-[11px]">{l.dates}</td>
                        <td className="py-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            l.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                            l.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400 text-xs">
                        No leave requests submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* My Tasks Checklist */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Assigned Tasks</h3>
              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="p-1 rounded-lg text-blue-600 hover:bg-blue-50"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {myTasks.length > 0 ? (
                myTasks.map((t) => (
                  <label
                    key={t.id}
                    onClick={() => toggleMyTask(t.id)}
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className={`text-xs font-medium leading-tight ${t.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {t.text}
                    </span>
                  </label>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">No active tasks</div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
              <span>Task Progress</span>
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
