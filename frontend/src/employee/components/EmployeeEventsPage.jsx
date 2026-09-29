import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Check, Sparkles, Plus } from 'lucide-react';

export default function EmployeeEventsPage({ events = [], showToast }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [rsvpd, setRsvpd] = useState({});

  const toggleRsvp = (eventId, eventTitle) => {
    setRsvpd(prev => {
      const next = !prev[eventId];
      if (showToast) {
        showToast(next ? `RSVP confirmed for "${eventTitle}"!` : `Cancelled RSVP for "${eventTitle}"`);
      }
      return { ...prev, [eventId]: next };
    });
  };

  const categories = ['All', 'Meeting', 'Workshop', 'Social'];

  const filteredEvents = events.filter(e => {
    if (filterCategory === 'All') return true;
    return e.category?.toLowerCase() === filterCategory.toLowerCase();
  });

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Company Events & Calendar</h2>
          <p className="text-xs text-slate-500 mt-0.5">Stay connected with company workshops, all-hands syncs, and team gatherings.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-full border border-blue-200">
          <Sparkles size={14} />
          <span>Active Calendar</span>
        </div>
      </div>

      {/* Categories Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const isAttending = rsvpd[event.id];

            return (
              <div 
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase border border-blue-100">
                      {event.category || 'Event'}
                    </span>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Clock size={13} /> {event.time || '10:00 AM'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {event.title}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="font-semibold text-slate-700">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      <span>Main Conference Hall & Zoom</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Users size={14} /> 24 Going
                  </span>

                  <button
                    onClick={() => toggleRsvp(event.id, event.title)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isAttending
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {isAttending ? (
                      <>
                        <Check size={14} />
                        <span>Attending</span>
                      </>
                    ) : (
                      <span>RSVP / Join</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 p-12 bg-white rounded-2xl border border-slate-200 text-center">
            <Calendar size={36} className="mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No events found</h4>
            <p className="text-xs text-slate-400 mt-1">Check back later for company updates.</p>
          </div>
        )}
      </div>

    </div>
  );
}
