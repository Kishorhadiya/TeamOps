import React, { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, MapPin, Trash2, Edit2, CheckCircle, Shield } from 'lucide-react';

export default function EmployeesPage({
  employees = [],
  setEmployees,
  searchQuery = '',
  setIsAddEmployeeOpen,
  showToast
}) {
  const [filterDept, setFilterDept] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const effectiveSearch = searchQuery || searchTerm;

  const filtered = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
                          emp.email.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
                          emp.role.toLowerCase().includes(effectiveSearch.toLowerCase());
    const matchesDept = filterDept === 'All' || emp.dept === filterDept;
    return matchesSearch && matchesDept;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove employee ${name}?`)) {
      setEmployees(employees.filter(e => e.id !== id));
      if (showToast) showToast(`Employee ${name} removed`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Employee Directory</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Manage and view all registered workforce members</p>
        </div>

        <button
          onClick={() => setIsAddEmployeeOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter employees..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['All', 'Operations', 'Engineering', 'Marketing', 'Sales'].map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterDept === dept
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=3b82f6&color=fff`}
                    alt={emp.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{emp.name}</h3>
                    <p className="text-xs text-blue-600 font-semibold">{emp.role}</p>
                    <span className="inline-block text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md mt-1">
                      {emp.dept}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  {emp.status || 'Active'}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">ID: #{emp.id}</span>
              <button
                onClick={() => handleDelete(emp.id, emp.name)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                title="Remove Employee"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
