import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  CheckSquare, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Search,
  Sparkles,
  Filter,
  Tag
} from 'lucide-react';

export default function TasksPage({ 
  tasks = [], 
  setTasks, 
  setIsAddTaskOpen, 
  showToast, 
  employees = [] 
}) {
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [filterPriority, setFilterPriority] = useState('All');
  const [search, setSearch] = useState('');

  const [taskForm, setTaskForm] = useState({
    title: '',
    assignee: '',
    dueDate: '',
    priority: 'Medium',
    status: 'To Do'
  });

  const priorities = [
    { value: 'High', label: 'High Priority', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { value: 'Medium', label: 'Medium Priority', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'Low', label: 'Low Priority', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ];

  const handleSubmitTaskInline = (e) => {
    e.preventDefault();
    if (!taskForm.title) return;

    const assignedName = taskForm.assignee || (employees.length > 0 ? employees[0].name : 'Developer');

    const created = {
      id: Date.now(),
      title: taskForm.title,
      dueDate: taskForm.dueDate || 'Due Soon',
      status: taskForm.status || 'To Do',
      assignee: assignedName,
      priority: taskForm.priority || 'Medium',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(assignedName)}&background=6366f1&color=fff&bold=true`
    };

    if (setTasks) setTasks([created, ...tasks]);
    setTaskForm({ title: '', assignee: '', dueDate: '', priority: 'Medium', status: 'To Do' });
    setShowInlineForm(false);
    if (showToast) showToast(`Task "${created.title}" assigned to ${assignedName}!`);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesPrio = filterPriority === 'All' || t.priority?.toLowerCase() === filterPriority.toLowerCase();
    const matchesSearch = !search || t.title?.toLowerCase().includes(search.toLowerCase()) || t.assignee?.toLowerCase().includes(search.toLowerCase());
    return matchesPrio && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Sprint Tasks & Assignments</h2>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-[11px] rounded-full border border-indigo-200">
              {tasks.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Assign deliverables, review sprint work, and monitor completion progress.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowInlineForm(!showInlineForm)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200"
          >
            {showInlineForm ? 'Hide Form' : 'Quick Task'}
          </button>

          <button 
            onClick={() => setIsAddTaskOpen ? setIsAddTaskOpen(true) : setShowInlineForm(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer transform active:scale-95"
          >
            <Plus size={16} />
            <span>Create & Assign</span>
          </button>
        </div>
      </div>

      {/* INLINE TASK CREATION FORM */}
      {showInlineForm && (
        <div className="bg-gradient-to-br from-white to-indigo-50/30 p-6 rounded-3xl border border-indigo-200 shadow-xl animate-fadeIn">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-indigo-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <CheckSquare size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Assign New Sprint Task</h3>
                <p className="text-[11px] text-slate-500">Quickly create a task and assign to team members</p>
              </div>
            </div>
            <button 
              onClick={() => setShowInlineForm(false)} 
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleSubmitTaskInline} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Title */}
            <div className="lg:col-span-2">
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <CheckSquare size={13} className="text-indigo-600" /> Task Title *
              </label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Implement API rate limiter and CORS security headers"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="w-full text-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium text-slate-800 transition-all"
              />
            </div>

            {/* Assignee */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-indigo-600" /> Assign To Developer
              </label>
              <select 
                value={taskForm.assignee}
                onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-800 transition-all"
              >
                <option value="">-- Select Developer --</option>
                {(employees && employees.length > 0 ? employees : [
                  { id: 1, name: 'Alex Johnson', email: 'alex.j@company.com' },
                  { id: 2, name: 'Sarah Williams', email: 'sarah.w@company.com' },
                  { id: 3, name: 'Michael Chen', email: 'michael.c@company.com' },
                  { id: 4, name: 'Jessica Miller', email: 'jessica.m@company.com' },
                  { id: 5, name: 'David Kim', email: 'david.k@company.com' }
                ]).map((e) => (
                  <option key={e.id} value={e.name}>
                    {e.name || e.username} • {e.role || 'Developer'} ({e.email || 'team@company.com'})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <AlertCircle size={13} className="text-indigo-600" /> Priority
              </label>
              <select 
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-800 transition-all"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar size={13} className="text-indigo-600" /> Due Date
              </label>
              <input 
                type="date" 
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-800 transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>Assign Task</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Priority Filters & Search Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['All', 'High', 'Medium', 'Low'].map(prio => {
            const count = prio === 'All' ? tasks.length : tasks.filter(t => t.priority?.toLowerCase() === prio.toLowerCase()).length;
            const isActive = filterPriority === prio;
            return (
              <button
                key={prio}
                onClick={() => setFilterPriority(prio)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{prio}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search tasks or assignees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200/80 text-center">
            <CheckSquare size={38} className="mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No tasks found</h4>
            <p className="text-xs text-slate-400 mt-1">Assign a new task to developers using the buttons above.</p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isHigh = t.priority === 'High';
            const isMedium = t.priority === 'Medium';
            const avatar = t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.assignee || 'Dev')}&background=6366f1&color=fff&bold=true`;

            return (
              <div 
                key={t.id} 
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex justify-between items-center hover:shadow-lg hover:border-indigo-300 transition-all group"
              >
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border ${
                      isHigh ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      isMedium ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {t.priority || 'Normal'} Priority
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {t.status || 'To Do'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {t.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 font-medium">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar size={13} /> {t.dueDate || 'Due Soon'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>Assigned to <strong className="text-slate-800">{t.assignee}</strong></span>
                  </div>
                </div>

                <img 
                  src={avatar} 
                  alt={t.assignee} 
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0" 
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
