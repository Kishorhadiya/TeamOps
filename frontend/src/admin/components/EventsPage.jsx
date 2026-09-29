import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Tag, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  CalendarCheck,
  Search,
  Filter
} from 'lucide-react';

export default function EventsPage({ 
  events = [], 
  setEvents, 
  handleCreateEvent, 
  handleDeleteEvent, 
  setIsAddEventOpen, 
  showToast 
}) {
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');

  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '10:00 AM',
    category: 'Meeting',
    location: 'Conference Room A'
  });

  const categories = ['All', 'Meeting', 'Workshop', 'Strategy', 'Social', 'All Hands'];

  const categoryBadges = {
    Meeting: 'bg-blue-50 text-blue-700 border-blue-200',
    Workshop: 'bg-purple-50 text-purple-700 border-purple-200',
    Strategy: 'bg-amber-50 text-amber-700 border-amber-200',
    Social: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'All Hands': 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const handleSubmitEventInline = (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) return;

    if (handleCreateEvent) {
      handleCreateEvent(e, eventForm);
    } else {
      const created = {
        id: Date.now(),
        title: eventForm.title,
        date: eventForm.date,
        time: eventForm.time,
        category: eventForm.category,
        location: eventForm.location
      };
      setEvents([...events, created]);
      if (showToast) showToast(`Event "${created.title}" added to schedule!`);
    }

    setEventForm({ title: '', date: '', time: '10:00 AM', category: 'Meeting', location: 'Conference Room A' });
    setShowInlineForm(false);
  };

  const filteredEvents = events.filter((ev) => {
    const matchesCat = filterCategory === 'All' || ev.category?.toLowerCase() === filterCategory.toLowerCase();
    const matchesSearch = !search || ev.title?.toLowerCase().includes(search.toLowerCase()) || ev.location?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Events & Company Schedule</h2>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[11px] rounded-full border border-blue-200">
              {events.length} Scheduled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Schedule and broadcast company workshops, all-hands syncs, and team gatherings.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowInlineForm(!showInlineForm)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200"
          >
            {showInlineForm ? 'Hide Form' : 'Quick Schedule'}
          </button>

          <button 
            onClick={() => setIsAddEventOpen ? setIsAddEventOpen(true) : setShowInlineForm(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer transform active:scale-95"
          >
            <Plus size={16} />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      {/* PREMIUM INLINE EVENT CREATION FORM */}
      {showInlineForm && (
        <div className="bg-gradient-to-br from-white to-blue-50/30 p-6 rounded-3xl border border-blue-200 shadow-xl animate-fadeIn">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-blue-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <CalendarIcon size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Schedule New Company Event</h3>
                <p className="text-[11px] text-slate-500">Save event directly to PostgreSQL database</p>
              </div>
            </div>
            <button 
              onClick={() => setShowInlineForm(false)} 
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleSubmitEventInline} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Title */}
            <div className="lg:col-span-2">
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Sparkles size={13} className="text-blue-600" /> Event Title *
              </label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Q4 Product Roadmap & Vision Sync"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="w-full text-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-800 transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag size={13} className="text-blue-600" /> Category
              </label>
              <select 
                value={eventForm.category}
                onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-800 transition-all"
              >
                <option value="Meeting">Team Meeting</option>
                <option value="Workshop">Workshop & Training</option>
                <option value="Strategy">Strategy Session</option>
                <option value="Social">Social Event</option>
                <option value="All Hands">Company All Hands</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <CalendarIcon size={13} className="text-blue-600" /> Date *
              </label>
              <input 
                type="date" 
                required 
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-800 transition-all"
              />
            </div>

            {/* Time */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock size={13} className="text-blue-600" /> Time
              </label>
              <input 
                type="text" 
                placeholder="e.g. 10:00 AM"
                value={eventForm.time}
                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-800 transition-all"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin size={13} className="text-blue-600" /> Location / Meeting Link
              </label>
              <input 
                type="text" 
                placeholder="e.g. Room 402 or Google Meet link"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-800 transition-all"
              />
            </div>

            {/* Actions */}
            <div className="col-span-full flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowInlineForm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>Save to Database</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => {
            const isActive = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200/80 text-center">
            <CalendarCheck size={38} className="mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No events found</h4>
            <p className="text-xs text-slate-400 mt-1">Click "Schedule Event" above to create and broadcast an event.</p>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const badgeClass = categoryBadges[ev.category] || 'bg-slate-50 text-slate-700 border-slate-200';

            return (
              <div 
                key={ev.id} 
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-lg hover:border-blue-300 transition-all group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${badgeClass}`}>
                      {ev.category || 'Meeting'}
                    </span>
                    <span className="text-xs text-slate-500 font-bold flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md">
                      <Clock size={12} /> {ev.time || '10:00 AM'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                    {ev.title}
                  </h3>

                  <div className="space-y-1.5 mt-3 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5">
                      <CalendarIcon size={14} className="text-blue-500" />
                      <span className="font-semibold text-slate-700">{ev.date}</span>
                    </p>
                    {ev.location && (
                      <p className="flex items-center gap-1.5 text-slate-400 truncate">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => {
                      if (handleDeleteEvent) {
                        handleDeleteEvent(ev.id, ev.title);
                      } else {
                        setEvents(events.filter(e => e.id !== ev.id));
                        if (showToast) showToast(`Removed event "${ev.title}"`);
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1.5 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete Event</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
