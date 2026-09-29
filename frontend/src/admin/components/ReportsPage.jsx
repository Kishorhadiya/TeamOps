import React from 'react';
import { Download } from 'lucide-react';

export default function ReportsPage({ showToast }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Reports & HR Analytics</h2>
          <p className="text-xs text-slate-500">Monthly overview of employee productivity, attendance, and headcount.</p>
        </div>
        <button 
          onClick={() => showToast('Report PDF downloaded!')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
        >
          <Download size={15} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Monthly Attendance</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">96.4%</h3>
          <p className="text-xs text-emerald-600 font-bold mt-1">+2.1% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Average Turnover</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">1.2%</h3>
          <p className="text-xs text-emerald-600 font-bold mt-1">-0.5% lower</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Open Positions</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">8</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">Active recruiting</p>
        </div>
      </div>
    </div>
  );
}
