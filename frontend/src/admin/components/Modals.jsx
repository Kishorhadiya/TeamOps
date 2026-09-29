import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Briefcase, 
  Building, 
  Lock, 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  CheckSquare, 
  Sparkles, 
  UserPlus, 
  Send, 
  CalendarOff,
  AlertCircle,
  FileText,
  CalendarCheck,
  CheckCircle2
} from 'lucide-react';

// ── 1. Add Employee Modal
export function AddEmployeeModal({ isOpen, onClose, onSubmit, newEmp, setNewEmp }) {
  if (!isOpen) return null;

  const rolesPreset = [
    'Senior Frontend Dev', 
    'Fullstack Engineer', 
    'Backend Developer', 
    'UI/UX Designer', 
    'Product Manager', 
    'DevOps Engineer'
  ];

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(newEmp.name || 'New Employee')}&background=3b82f6&color=fff&size=128&bold=true`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 transform transition-all">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <UserPlus size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Add New Team Member</h3>
              <p className="text-xs text-blue-100">Register employee credentials and assign department</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Avatar Preview Card */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <img 
              src={avatarUrl} 
              alt="Avatar preview" 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div>
              <div className="text-xs font-bold text-slate-800">
                {newEmp.name || 'Member Profile'}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {newEmp.role || 'Role not assigned'} • {newEmp.dept || 'Engineering'}
              </div>
              <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
                Active Employee
              </span>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User size={14} className="text-blue-600" /> Full Name *
            </label>
            <input 
              type="text" 
              required 
              value={newEmp.name}
              onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
              placeholder="e.g. Alexander Wright" 
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-800 transition-all" 
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Mail size={14} className="text-blue-600" /> Work Email *
            </label>
            <input 
              type="email" 
              required 
              value={newEmp.email || ''}
              onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
              placeholder="alexander@company.com" 
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-800 transition-all" 
            />
          </div>

          {/* Job Role */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Briefcase size={14} className="text-blue-600" /> Job Title / Role *
            </label>
            <input 
              type="text" 
              required 
              value={newEmp.role}
              onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
              placeholder="e.g. Senior Frontend Developer" 
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-800 transition-all" 
            />
            {/* Quick role presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {rolesPreset.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setNewEmp({ ...newEmp, role: r })}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[10px] font-semibold text-slate-600 rounded-md transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Department & Default Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building size={14} className="text-blue-600" /> Department
              </label>
              <select 
                value={newEmp.dept || 'Engineering'}
                onChange={(e) => setNewEmp({ ...newEmp, dept: e.target.value })}
                className="w-full text-xs px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-800 transition-all"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">UI/UX Design</option>
                <option value="Product">Product Management</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing">Marketing & Sales</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock size={14} className="text-blue-600" /> Initial Password
              </label>
              <input 
                type="text" 
                value={newEmp.password || 'welcome@123'}
                onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })}
                placeholder="welcome@123" 
                className="w-full text-xs px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-800 transition-all font-mono" 
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <UserPlus size={15} />
              <span>Save & Register</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── 2. Request Leave Modal (Admin Side)
export function RequestLeaveModal({ isOpen, onClose, onSubmit, newLeave, setNewLeave, employees = [] }) {
  if (!isOpen) return null;

  const leaveTypes = [
    { id: 'Vacation', label: 'Vacation', icon: '🌴', desc: 'Annual paid leave' },
    { id: 'Sick Leave', label: 'Sick / Medical', icon: '💊', desc: 'Health recovery' },
    { id: 'Personal', label: 'Personal Time', icon: '☕', desc: 'Family & errands' },
    { id: 'Maternity', label: 'Maternity/Paternity', icon: '👶', desc: 'Parental care' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <CalendarOff size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Apply / Log Leave</h3>
              <p className="text-xs text-blue-100">Record a leave request on behalf of an employee</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          
          {/* Employee Picker */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User size={14} className="text-blue-600" /> Select Employee *
            </label>
            <select 
              value={newLeave.name}
              onChange={(e) => setNewLeave({ ...newLeave, name: e.target.value })}
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-800 transition-all"
            >
              {employees.map((e) => (
                <option key={e.id} value={e.name}>
                  {e.name} {e.role ? `(${e.role})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Leave Type Cards */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-2 block">
              Leave Category *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {leaveTypes.map((lt) => {
                const isSelected = newLeave.type === lt.id;
                return (
                  <button
                    type="button"
                    key={lt.id}
                    onClick={() => setNewLeave({ ...newLeave, type: lt.id })}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xl">{lt.icon}</span>
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                        {lt.label}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">{lt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dates Range */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} className="text-blue-600" /> Date Range *
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. 2026-10-10 to 2026-10-15"
              value={newLeave.dates}
              onChange={(e) => setNewLeave({ ...newLeave, dates: e.target.value })}
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-800 transition-all" 
            />
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FileText size={14} className="text-blue-600" /> Reason / Notes
            </label>
            <textarea 
              rows={2}
              placeholder="Optional notes or reason for leave..."
              value={newLeave.reason || ''}
              onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              className="w-full text-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-800 resize-none transition-all" 
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Send size={15} />
              <span>Submit Leave</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── 3. Add Event Modal
export function AddEventModal({ isOpen, onClose, onSubmit, newEvent, setNewEvent }) {
  if (!isOpen) return null;

  const categories = [
    { label: 'Team Meeting', value: 'Meeting', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Workshop', value: 'Workshop', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { label: 'Strategy Sync', value: 'Strategy', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Company Social', value: 'Social', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'All Hands', value: 'All Hands', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <CalendarCheck size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Schedule Company Event</h3>
              <p className="text-xs text-blue-100">Broadcast meeting, workshop, or team sync to all employees</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-600" /> Event Title *
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. Q4 Product Roadmap & Vision Sync"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-800 transition-all" 
            />
          </div>

          {/* Category Pills */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-2 block">
              Event Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const isSelected = (newEvent.category || 'Meeting') === c.value;
                return (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => setNewEvent({ ...newEvent, category: c.value })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : `${c.color} hover:opacity-80`
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-blue-600" /> Event Date *
              </label>
              <input 
                type="date" 
                required
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full text-xs px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-800 transition-all" 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock size={14} className="text-blue-600" /> Time
              </label>
              <input 
                type="text" 
                value={newEvent.time || '10:00 AM'}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                placeholder="e.g. 10:00 AM - 11:30 AM"
                className="w-full text-xs px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-800 transition-all" 
              />
            </div>
          </div>

          {/* Location / Meeting link */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-600" /> Location / Meeting URL
            </label>
            <input 
              type="text" 
              value={newEvent.location || ''}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              placeholder="e.g. Main Conference Room A / Zoom Link"
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-800 transition-all" 
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <CheckCircle2 size={15} />
              <span>Broadcast Event</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── 4. Create Task Modal
export function CreateTaskModal({ isOpen, onClose, onSubmit, newTask, setNewTask, employees = [] }) {
  if (!isOpen) return null;

  const fallbackList = [
    { id: 1, name: 'Alex Johnson', role: 'Fullstack Developer', dept: 'Engineering', email: 'alex.j@company.com' },
    { id: 2, name: 'Sarah Williams', role: 'Frontend Engineer', dept: 'Engineering', email: 'sarah.w@company.com' },
    { id: 3, name: 'Michael Chen', role: 'Backend Developer', dept: 'Engineering', email: 'michael.c@company.com' },
    { id: 4, name: 'Jessica Miller', role: 'UI/UX Designer', dept: 'Design', email: 'jessica.m@company.com' },
    { id: 5, name: 'David Kim', role: 'DevOps Engineer', dept: 'Operations', email: 'david.k@company.com' }
  ];

  const employeeList = (employees && employees.length > 0) ? employees : fallbackList;

  const priorities = [
    { value: 'High', label: 'High Priority', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { value: 'Medium', label: 'Medium Priority', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'Low', label: 'Low Priority', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ];

  const quickDates = [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
    { label: 'In 3 Days', days: 3 },
    { label: 'Next Week', days: 7 }
  ];

  const handleSetQuickDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setNewTask({ ...newTask, dueDate: d.toISOString().slice(0, 10) });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <CheckSquare size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Assign New Task</h3>
              <p className="text-xs text-indigo-100">Assign sprint deliverables and action items to developers</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          
          {/* Task Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <CheckSquare size={14} className="text-indigo-600" /> Task Title / Objective *
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. Implement OAuth login and password recovery flow"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium text-slate-800 transition-all" 
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User size={14} className="text-indigo-600" /> Assign To Developer *
            </label>
            <select
              required
              value={newTask.userid || ''}
              onChange={(e) => {
                const selectedEmp = employeeList.find(emp => String(emp.id) === String(e.target.value) || emp.name === e.target.value);
                setNewTask({
                  ...newTask,
                  userid: e.target.value,
                  assignee: selectedEmp?.name || selectedEmp?.username || e.target.value
                });
              }}
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 font-medium text-slate-800 transition-all"
            >
              <option value="">-- Choose Team Member / Developer --</option>
              {employeeList.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name || emp.username} • {emp.role || 'Developer'} ({emp.email || 'team@company.com'})
                </option>
              ))}
            </select>
          </div>

          {/* Priority Chips */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-2 block">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorities.map((p) => {
                const isSelected = (newTask.priority || 'Medium') === p.value;
                return (
                  <button
                    type="button"
                    key={p.value}
                    onClick={() => setNewTask({ ...newTask, priority: p.value })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : `${p.color} hover:opacity-80`
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date & Shortcuts */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} className="text-indigo-600" /> Due Date
            </label>
            <input 
              type="date" 
              value={newTask.dueDate || ''}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 font-medium text-slate-800 transition-all" 
            />
            {/* Quick date shortcuts */}
            <div className="flex gap-2 mt-2">
              {quickDates.map((qd) => (
                <button
                  type="button"
                  key={qd.label}
                  onClick={() => handleSetQuickDate(qd.days)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[11px] font-semibold text-slate-600 rounded-lg transition-colors"
                >
                  {qd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <CheckSquare size={15} />
              <span>Assign Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
