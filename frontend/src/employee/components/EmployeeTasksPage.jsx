import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Filter, 
  Tag, 
  Search 
} from 'lucide-react';

export default function EmployeeTasksPage({
  tasks = [],
  setTasks,
  setIsAddTaskOpen,
  showToast,
  employeeUser
}) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const toggleTaskStatus = (id) => {
    if (!setTasks) return;
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Completed' ? 'In Progress' : 'Completed';
        if (showToast) showToast(`Task marked as ${nextStatus}`);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title?.toLowerCase().includes(search.toLowerCase()) ||
                          t.priority?.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'All') return true;
    if (filter === 'High Priority') return t.priority?.toLowerCase() === 'high';
    return t.status?.toLowerCase() === filter.toLowerCase();
  });

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const progressPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Assigned Tasks</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track and manage your sprint deliverables, action items, and personal tasks.</p>
        </div>

        <button
          onClick={() => setIsAddTaskOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Overview Progress Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-bold text-slate-500">Overall Progress</span>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">
              {completedCount} of {tasks.length} Tasks Completed
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-extrabold border border-blue-200">
            {progressPercent}% Complete
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['All', 'In Progress', 'To Do', 'Completed', 'High Priority'].map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isHigh = task.priority === 'High';

            return (
              <div 
                key={task.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted 
                    ? 'bg-slate-50/70 border-slate-200/70 opacity-80' 
                    : 'bg-white border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                        isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-blue-500 bg-white'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 size={14} />}
                    </button>
                    <div>
                      <h4 className={`text-sm font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                        <Calendar size={13} /> {task.dueDate || 'Due Soon'}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                    isHigh ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                    'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {task.priority || 'Normal'}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {task.status || 'In Progress'}
                  </span>

                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    {isCompleted ? 'Mark Pending' : 'Mark Done'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 p-12 bg-white rounded-2xl border border-slate-200 text-center">
            <CheckSquare size={36} className="mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No tasks found</h4>
            <p className="text-xs text-slate-400 mt-1">Try switching filters or add a new task.</p>
          </div>
        )}
      </div>

    </div>
  );
}
