import React, { useState } from 'react';
import { Clock, Plus, CheckCircle, XCircle, Search, Calendar, User, FileText } from 'lucide-react';

export default function LeavePage({ 
  leaveRequests = [], 
  handleApproveLeave, 
  handleRejectLeave, 
  setIsAddLeaveOpen, 
  showToast,
  employees = []
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = leaveRequests.filter((req) => {
    const matchesSearch = (req.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (req.type || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Leave Management</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Review, approve, and manage staff time-off applications</p>
        </div>

        <button
          onClick={() => setIsAddLeaveOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus size={16} /> Request Leave
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
            placeholder="Search by staff name or type..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">Leave Type</th>
                <th className="py-3.5 px-6">Duration / Dates</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={req.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.name || 'E')}&background=3b82f6&color=fff`}
                        alt={req.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{req.name || 'Employee'}</span>
                        <span className="text-[10px] text-slate-400">{req.role || 'Staff'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">{req.type}</td>
                    <td className="py-4 px-6 font-mono text-[11px] text-slate-600">{req.dates}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        req.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApproveLeave(req.id)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition-colors border border-emerald-200 text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectLeave(req.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition-colors border border-rose-200 text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-xs">
                    No leave applications matching the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
