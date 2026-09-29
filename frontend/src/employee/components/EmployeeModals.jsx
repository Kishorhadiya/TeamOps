import React, { useState } from 'react';
import { 
  X, 
  CalendarOff, 
  CheckSquare, 
  Plus, 
  Send, 
  Calendar, 
  Clock, 
  FileText, 
  Sparkles,
  Info,
  Tag,
  CheckCircle2
} from 'lucide-react';

// ── 1. Apply Leave Modal (Employee)
export function ApplyLeaveModal({ isOpen, onClose, onSubmit, newLeave, setNewLeave }) {
  if (!isOpen) return null;

  const leaveCategories = [
    { id: 'Vacation', title: 'Vacation / Annual', icon: '🌴', desc: 'Paid time off & holidays', color: 'border-blue-500 bg-blue-50/60 text-blue-950' },
    { id: 'Sick', title: 'Sick / Medical', icon: '💊', desc: 'Health & doctor recovery', color: 'border-rose-500 bg-rose-50/60 text-rose-950' },
    { id: 'Casual', title: 'Casual Leave', icon: '☕', desc: 'Short personal errands', color: 'border-amber-500 bg-amber-50/60 text-amber-950' },
    { id: 'Maternity/Paternity', title: 'Parental Leave', icon: '👶', desc: 'Maternity & paternity care', color: 'border-purple-500 bg-purple-50/60 text-purple-950' },
    { id: 'Emergency', title: 'Emergency', icon: '🚨', desc: 'Urgent unplanned events', color: 'border-red-500 bg-red-50/60 text-red-950' },
  ];

  const calculateDays = () => {
    if (!newLeave.startDate || !newLeave.endDate) return null;
    const start = new Date(newLeave.startDate);
    const end = new Date(newLeave.endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const daysCount = calculateDays();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <CalendarOff size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Apply for Leave</h3>
              <p className="text-xs text-blue-100">Submit a time-off application for administrative review</p>
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
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Leave Category Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-2 block">
              Choose Leave Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {leaveCategories.map((c) => {
                const isSelected = (newLeave.type || 'Vacation') === c.id;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setNewLeave({ ...newLeave, type: c.id })}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? `${c.color} shadow-sm ring-2 ring-blue-500/20`
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xl mb-1">{c.icon}</span>
                    <div className="text-xs font-bold truncate">{c.title}</div>
                    <div className="text-[10px] text-slate-400 font-medium truncate">{c.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-blue-600" /> Start Date *
              </label>
              <input
                type="date"
                required
                value={newLeave.startDate || ''}
                onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                className="w-full text-xs px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-800 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-blue-600" /> End Date *
              </label>
              <input
                type="date"
                required
                value={newLeave.endDate || ''}
                onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                className="w-full text-xs px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Live Duration Calculation Banner */}
          {daysCount !== null && (
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Info size={16} className="text-blue-600 shrink-0" />
                <span>Total Requested Duration:</span>
              </div>
              <span className="px-3 py-1 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-xs">
                {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          )}

          {/* Reason Textarea */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FileText size={14} className="text-blue-600" /> Reason for Leave *
            </label>
            <textarea
              rows={3}
              required
              value={newLeave.reason || ''}
              onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              placeholder="Please provide details regarding your leave request..."
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-800 resize-none transition-all"
            />
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5">
            {['Annual family vacation', 'Medical recovery & doctor sync', 'Personal family emergency', 'Attending workshop'].map((sug) => (
              <button
                type="button"
                key={sug}
                onClick={() => setNewLeave({ ...newLeave, reason: sug })}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[10px] font-semibold text-slate-600 rounded-lg transition-colors"
              >
                + {sug}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Send size={15} />
              <span>Submit Leave Request</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// ── 2. Create Personal Task Modal (Employee)
export function CreatePersonalTaskModal({ isOpen, onClose, onSubmit, newTask, setNewTask }) {
  if (!isOpen) return null;

  const priorities = [
    { value: 'High', label: 'High Priority', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { value: 'Medium', label: 'Medium Priority', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'Low', label: 'Low Priority', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ];

  const presets = [
    'Review PR & merge backend endpoints',
    'Write unit tests for authentication',
    'Sync with UI designer regarding layout',
    'Update API documentation'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <CheckSquare size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">New Work Task</h3>
              <p className="text-xs text-indigo-100">Add an action item to your personal checklist</p>
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
              <CheckSquare size={14} className="text-indigo-600" /> Task Description / Action *
            </label>
            <input
              type="text"
              required
              value={newTask.title || ''}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="e.g. Implement user profile avatar upload"
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium text-slate-800 transition-all"
            />
          </div>

          {/* Presets */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Suggestions</span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setNewTask({ ...newTask, title: p })}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[10px] font-semibold text-slate-600 rounded-lg transition-colors truncate max-w-full"
                >
                  + {p}
                </button>
              ))}
            </div>
          </div>

          {/* Priority & Due Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Priority</label>
              <select
                value={newTask.priority || 'Medium'}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full text-xs px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 font-medium text-slate-800 transition-all"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-indigo-600" /> Due Date
              </label>
              <input
                type="date"
                value={newTask.dueDate || ''}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full text-xs px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 font-medium text-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Plus size={15} />
              <span>Create Task</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
