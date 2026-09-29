import React, { useState } from 'react';
import { 
  CalendarOff, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Calendar, 
  FileText,
  AlertCircle,
  RefreshCw,
  Send
} from 'lucide-react';

export default function EmployeeLeavePage({
  leaves = [],
  onSubmitLeave,
  onRefresh,
  showToast,
  employeeUser
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'Vacation',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      if (showToast) showToast('Please select start and end dates');
      return;
    }

    setSubmitting(true);

    const newLeaveObj = {
      id: Date.now(),
      name: employeeUser?.username || employeeUser?.name || 'Employee',
      role: employeeUser?.role || 'Team Member',
      type: formData.type,
      dates: `${formData.startDate} to ${formData.endDate}`,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason || 'Personal leave request',
      status: 'Pending',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeUser?.username || 'E')}&background=3b82f6&color=fff`,
    };

    if (onSubmitLeave) {
      await onSubmitLeave(newLeaveObj);
    }

    setSubmitting(false);
    setShowInlineForm(false);
    setFormData({ type: 'Vacation', startDate: '', endDate: '', reason: '' });
    if (showToast) showToast('Leave application submitted successfully! Awaiting admin review.');
  };

  const filteredLeaves = leaves.filter((leave) => {
    if (filterStatus === 'All') return true;
    return leave.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Leave Applications</h2>
          <p className="text-xs text-slate-500 mt-0.5">Apply for paid time off, medical leave, and track your approval status.</p>
        </div>

        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2 border border-slate-200"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          )}

          <button
            onClick={() => setShowInlineForm(!showInlineForm)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            <span>{showInlineForm ? 'Hide Form' : 'Apply For Leave'}</span>
          </button>
        </div>
      </div>

      {/* 4 Leave Balances */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Annual / Vacation</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-slate-900">12</span>
            <span className="text-xs font-semibold text-slate-400">/ 14 Days</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Available balance</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sick Leave</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-slate-900">6</span>
            <span className="text-xs font-semibold text-slate-400">/ 7 Days</span>
          </div>
          <span className="text-[10px] text-blue-600 font-bold mt-1 block">Medical certificate req.</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Casual Leave</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-slate-900">4</span>
            <span className="text-xs font-semibold text-slate-400">/ 5 Days</span>
          </div>
          <span className="text-[10px] text-indigo-600 font-bold mt-1 block">Short notice leave</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Requests</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-amber-600">{pendingCount}</span>
            <span className="text-xs font-semibold text-slate-400">In Review</span>
          </div>
          <span className="text-[10px] text-amber-600 font-bold mt-1 block">Awaiting admin action</span>
        </div>
      </div>

      {/* INLINE LEAVE APPLICATION FORM */}
      {showInlineForm && (
        <div className="bg-gradient-to-br from-white to-blue-50/30 p-6 rounded-3xl border border-blue-200 shadow-xl animate-fadeIn">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-blue-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <CalendarOff size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Submit New Leave Application</h3>
                <p className="text-[11px] text-slate-500">Apply for time off and send directly for admin approval</p>
              </div>
            </div>
            <button 
              onClick={() => setShowInlineForm(false)}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <XCircle size={16} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            {/* Category Cards */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-2 block">Leave Type *</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'Vacation', label: 'Vacation', icon: '🌴' },
                  { id: 'Sick', label: 'Sick Leave', icon: '💊' },
                  { id: 'Casual', label: 'Casual', icon: '☕' },
                  { id: 'Maternity/Paternity', label: 'Parental', icon: '👶' },
                  { id: 'Emergency', label: 'Emergency', icon: '🚨' },
                ].map((c) => {
                  const isSelected = formData.type === c.id;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setFormData({ ...formData, type: c.id })}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-lg">{c.icon}</span>
                      <span className="text-[11px] truncate">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar size={13} className="text-blue-600" /> Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full text-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar size={13} className="text-blue-600" /> End Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full text-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-800 transition-all"
                />
              </div>
            </div>

            {/* Reason Textarea */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText size={13} className="text-blue-600" /> Reason / Notes for Admin *
              </label>
              <textarea
                rows={2}
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="e.g. Annual family vacation / Out of town for medical checkup..."
                className="w-full text-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-800 resize-none transition-all"
              />
            </div>

            {/* Quick Reason Suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {['Annual family vacation', 'Medical treatment & recovery', 'Family function', 'Personal emergency'].map((sug) => (
                <button
                  type="button"
                  key={sug}
                  onClick={() => setFormData({ ...formData, reason: sug })}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[10px] font-semibold text-slate-600 rounded-md transition-colors"
                >
                  + {sug}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowInlineForm(false)}
                className="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer transform active:scale-95"
              >
                <Send size={14} />
                <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER BUTTONS & HISTORY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Table Header Filter Tabs */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => {
              const isActive = filterStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {status}
                  {status === 'Pending' && pendingCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px]">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredLeaves.length} of {leaves.length} records
          </span>
        </div>

        {/* Leaves Table */}
        <div className="overflow-x-auto">
          {filteredLeaves.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Leave Type</th>
                  <th className="py-3.5 px-6">Duration & Dates</th>
                  <th className="py-3.5 px-6">Reason</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {filteredLeaves.map((leave) => {
                  const isApproved = leave.status === 'Approved';
                  const isPending = leave.status === 'Pending';
                  const isRejected = leave.status === 'Rejected';

                  return (
                    <tr key={leave.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isApproved ? 'bg-emerald-50 text-emerald-600' : isPending ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            <CalendarOff size={16} />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{leave.type || 'Personal Leave'}</span>
                            <span className="text-[11px] text-slate-400">Ref #{leave.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-800">{leave.dates}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 max-w-xs truncate text-slate-600">
                        {leave.reason || 'Personal time off'}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold ${
                          isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          isPending ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isApproved && <CheckCircle2 size={13} />}
                          {isPending && <Clock size={13} />}
                          {isRejected && <XCircle size={13} />}
                          <span>{leave.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <CalendarOff size={36} className="mx-auto text-slate-300 mb-3" />
              <h4 className="text-sm font-bold text-slate-700">No leave records found</h4>
              <p className="text-xs text-slate-400 mt-1">
                {filterStatus !== 'All' ? `No leaves match status "${filterStatus}".` : 'You have not submitted any leave requests.'}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
