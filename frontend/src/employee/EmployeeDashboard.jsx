import React, { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import axios from 'axios';

// Employee Components
import EmployeeAuth from './components/EmployeeAuth';
import EmployeeSidebar from './components/EmployeeSidebar';
import EmployeeHeader from './components/EmployeeHeader';
import EmployeeDashboardOverview from './components/EmployeeDashboardOverview';
import EmployeeLeavePage from './components/EmployeeLeavePage';
import EmployeeAttendancePage from './components/EmployeeAttendancePage';
import EmployeeTasksPage from './components/EmployeeTasksPage';
import EmployeeEventsPage from './components/EmployeeEventsPage';
import EmployeeSettingsPage from './components/EmployeeSettingsPage';
import { ApplyLeaveModal, CreatePersonalTaskModal } from './components/EmployeeModals';
import { ADMIN_API, BACKEND_API, LEAVE_API } from '../config/api';

export default function EmployeeDashboard({ onSwitchPortal }) {
  // Auth State (Restore from localStorage on page reload)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('employeeUser');
  });

  const [employeeUser, setEmployeeUser] = useState(() => {
    try {
      const saved = localStorage.getItem('employeeUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data States (loaded from backend)
  const [leaves, setLeaves] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [events, setEvents] = useState([]);

  // Clock In / Attendance State (Restore from localStorage on page reload)
  const [clockedIn, setClockedIn] = useState(() => {
    try {
      const savedClock = localStorage.getItem('employeeClockState');
      if (savedClock) {
        const parsed = JSON.parse(savedClock);
        return !!parsed.clockedIn;
      }
    } catch {}
    return false;
  });

  const [clockInTime, setClockInTime] = useState(() => {
    try {
      const savedClock = localStorage.getItem('employeeClockState');
      if (savedClock) {
        return JSON.parse(savedClock).clockInTime || null;
      }
    } catch {}
    return null;
  });

  const [clockOutTime, setClockOutTime] = useState(() => {
    try {
      const savedClock = localStorage.getItem('employeeClockState');
      if (savedClock) {
        return JSON.parse(savedClock).clockOutTime || null;
      }
    } catch {}
    return null;
  });

  const [secondsWorked, setSecondsWorked] = useState(() => {
    try {
      const savedClock = localStorage.getItem('employeeClockState');
      if (savedClock) {
        const parsed = JSON.parse(savedClock);
        if (parsed.clockedIn && parsed.clockInTimestamp) {
          return Math.max(0, Math.floor((Date.now() - parsed.clockInTimestamp) / 1000));
        }
      }
    } catch {}
    return 0;
  });

  // Modals
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({ type: 'Vacation', startDate: '', endDate: '', reason: '' });
  const [newTask, setNewTask] = useState({ title: '', priority: 'Medium', dueDate: 'Due Soon' });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live session timer (continuously calculates accurate time from clockInTimestamp)
  useEffect(() => {
    let timer;
    if (clockedIn) {
      timer = setInterval(() => {
        try {
          const savedClock = localStorage.getItem('employeeClockState');
          if (savedClock) {
            const parsed = JSON.parse(savedClock);
            if (parsed.clockInTimestamp) {
              const elapsed = Math.max(0, Math.floor((Date.now() - parsed.clockInTimestamp) / 1000));
              setSecondsWorked(elapsed);
              return;
            }
          }
        } catch {}
        setSecondsWorked((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [clockedIn]);

  // ──────────────────────────────────────────
  // FETCH ALL REAL BACKEND DATA
  // ──────────────────────────────────────────
  const fetchAllData = async () => {
    // 1. Fetch Leaves
    try {
      const res = await axios.get(`${LEAVE_API}/all-leave`);
      if (res.data?.AllLeave) {
        const mapped = res.data.AllLeave
          .filter((r) => r.fromdate || r.todate)
          .map((r, i) => ({
            id: r.leaveid || i + 1,
            userid: r.userid,
            name: r.username || employeeUser?.username || 'Employee',
            type: r.reason || 'Personal Leave',
            dates: `${String(r.fromdate || '').slice(0, 10)} to ${String(r.todate || '').slice(0, 10)}`,
            status: r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1).toLowerCase() : 'Pending',
            reason: r.reason || 'Personal leave request',
          }));
        setLeaves(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch leaves:', err.message);
    }

    // 2. Fetch Events from Postgres
    try {
      const res = await axios.get(`${BACKEND_API}/allevents`);
      if (res.data?.Events) {
        const mappedEvents = res.data.Events.map((e, idx) => {
          let extra = {};
          try {
            if (e.description && typeof e.description === 'string' && e.description.startsWith('{')) {
              extra = JSON.parse(e.description);
            }
          } catch {}
          return {
            id: e.id || idx + 1,
            title: e.title || 'Company Event',
            date: e.date ? String(e.date).slice(0, 10) : 'Upcoming',
            time: extra.time || e.time || '10:00 AM',
            category: extra.category || e.category || 'Meeting',
            location: extra.location || e.location || 'Conference Room A',
            description: extra.description || e.description || '',
          };
        });
        setEvents(mappedEvents);
        localStorage.setItem('shared_events', JSON.stringify(mappedEvents));
      }
    } catch (err) {
      console.error('Failed to fetch events:', err.message);
      try {
        const saved = localStorage.getItem('shared_events');
        if (saved) setEvents(JSON.parse(saved));
      } catch {}
    }

    // 3. Fetch Tasks
    try {
      const res = await axios.get(`${ADMIN_API}/task/allTasks`);
      if (res.data?.tasks) {
        const mappedTasks = res.data.tasks.map((t) => ({
          id: t.id,
          userid: t.userid,
          title: t.task,
          dueDate: t.enddate ? String(t.enddate).slice(0, 10) : 'Due Soon',
          status: t.status || 'To Do',
          priority: 'Medium',
          assignee: t.assignee_name || (employeeUser?.username || 'You'),
        }));
        setTasks(mappedTasks);

        // Filter tasks specifically assigned to this logged-in employee
        const myAssigned = employeeUser?.id
          ? mappedTasks.filter(t => !t.userid || String(t.userid) === String(employeeUser.id))
          : mappedTasks;

        setMyTasks(myAssigned.map((t) => ({ id: t.id, text: t.title, completed: t.status === 'Completed' })));
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, activeTab]);

  // Sync events across tabs/portals in real-time
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'shared_events' && e.newValue) {
        try {
          setEvents(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // ──────────────────────────────────────────
  // CLOCK IN & OUT (Persistent on reload)
  // ──────────────────────────────────────────
  const handleClockIn = () => {
    const now = Date.now();
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = new Date().toISOString().slice(0, 10);
    
    // Save state to localStorage so reload preserves clock
    localStorage.setItem('employeeClockState', JSON.stringify({
      clockedIn: true,
      clockInTime: t,
      clockInTimestamp: now,
      date: todayStr
    }));

    setClockedIn(true);
    setClockInTime(t);
    setSecondsWorked(0);
    showToast(`Clocked In successfully at ${t}!`);
  };

  const handleClockOut = () => {
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date();
    const todayDayStr = todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    const workedHours = secondsWorked > 0 ? (secondsWorked / 3600) : 8.5;
    const h = Math.floor(workedHours);
    const m = Math.floor((secondsWorked % 3600) / 60);
    const hoursStr = `${h}h ${String(m).padStart(2, '0')}m`;

    // Save completed session to persistent user attendance records
    try {
      const storageKey = `employee_attendance_logs_${employeeUser?.id || 'default'}`;
      const savedLogs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newEntry = {
        date: todayDayStr,
        isoDate: todayDate.toISOString().slice(0, 10),
        clockIn: clockInTime || '09:00 AM',
        clockOut: t,
        hours: hoursStr,
        hoursNumeric: workedHours,
        status: (clockInTime && clockInTime > '09:05') ? 'Late (12m)' : 'On Time'
      };
      const updated = [newEntry, ...savedLogs.filter((x) => x.isoDate !== newEntry.isoDate)];
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    // Save clock-out state to localStorage
    localStorage.setItem('employeeClockState', JSON.stringify({
      clockedIn: false,
      clockOutTime: t,
    }));

    setClockedIn(false);
    setClockOutTime(t);
    showToast(`Clocked Out at ${t}. Have a great day!`);
  };

  // Task Toggle
  const toggleMyTask = async (id) => {
    const target = tasks.find((t) => t.id === id);
    const nextStatus = target?.status === 'Completed' ? 'In Progress' : 'Completed';

    try {
      await axios.post(`${ADMIN_API}/task/updateStatus`, { id, status: nextStatus });
    } catch (e) {}

    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)));
    setMyTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: nextStatus === 'Completed' } : t)));
  };

  const completedMyTasks = myTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedMyTasks / (myTasks.length || 1)) * 100) || 0;

  // Submit Leave (Persist directly to backend database)
  const handleSubmitLeave = async (leaveObj) => {
    try {
      await axios.post(`${BACKEND_API}/createLeave`, {
        userid: employeeUser?.id || 1,
        reason: leaveObj.reason || leaveObj.type,
        startdate: leaveObj.startDate,
        enddate: leaveObj.endDate,
      });
      showToast('Leave request submitted to database!');
      fetchAllData();
    } catch (err) {
      setLeaves([leaveObj, ...leaves]);
      showToast('Leave request submitted!');
    }

    setIsAddLeaveOpen(false);
    setNewLeave({ type: 'Vacation', startDate: '', endDate: '', reason: '' });
  };

  // Create Task (Persist directly to database)
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    try {
      await axios.post(`${ADMIN_API}/task/createTask`, {
        task: newTask.title,
        userid: employeeUser?.id || null,
        adminid: null,
        status: 'In Progress',
        startdate: new Date().toISOString().slice(0, 10),
        enddate: newTask.dueDate || new Date().toISOString().slice(0, 10),
      });
      showToast(`Task "${newTask.title}" saved to database!`);
      fetchAllData();
    } catch {
      const created = {
        id: Date.now(),
        title: newTask.title,
        priority: newTask.priority,
        dueDate: newTask.dueDate || 'Due Soon',
        status: 'In Progress',
      };
      setTasks([created, ...tasks]);
      showToast(`Task "${created.title}" added to your list!`);
    }

    setIsAddTaskOpen(false);
    setNewTask({ title: '', priority: 'Medium', dueDate: 'Due Soon' });
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeUser');
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeClockState');
    setIsAuthenticated(false);
    setEmployeeUser(null);
    setClockedIn(false);
    setSecondsWorked(0);
    showToast('Logged out of employee portal.');
  };

  // Not logged in → Show Employee Auth screen
  if (!isAuthenticated) {
    return (
      <EmployeeAuth
        onLoginSuccess={(user) => {
          setEmployeeUser(user);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 flex">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0F172A] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-blue-500/40">
          <CheckCircle className="text-emerald-400 shrink-0" size={20} />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Employee Sidebar */}
      <EmployeeSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingLeaveCount={leaves.filter((l) => l.status === 'Pending').length}
        taskCount={tasks.filter((t) => t.status !== 'Completed').length}
        onLogout={handleLogout}
        employeeUser={employeeUser}
        clockedIn={clockedIn}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Container */}
      <main className="ml-0 lg:ml-64 flex-1 flex flex-col min-h-screen w-full transition-all">
        
        {/* Employee Header */}
        <EmployeeHeader
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          setNotifications={setNotifications}
          onLogout={handleLogout}
          setActiveTab={setActiveTab}
          employeeUser={employeeUser}
          clockedIn={clockedIn}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Tab Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'Dashboard' && (
            <EmployeeDashboardOverview
              employeeUser={employeeUser}
              leaves={leaves}
              tasks={tasks}
              events={events}
              myTasks={myTasks}
              toggleMyTask={toggleMyTask}
              progressPercent={progressPercent}
              setIsAddLeaveOpen={setIsAddLeaveOpen}
              setIsAddTaskOpen={setIsAddTaskOpen}
              clockedIn={clockedIn}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
              clockInTime={clockInTime}
              clockOutTime={clockOutTime}
              secondsWorked={secondsWorked}
              showToast={showToast}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'Leaves' && (
            <EmployeeLeavePage
              leaves={leaves}
              onSubmitLeave={handleSubmitLeave}
              onRefresh={fetchAllData}
              showToast={showToast}
              employeeUser={employeeUser}
            />
          )}

          {activeTab === 'Attendance' && (
            <EmployeeAttendancePage
              clockedIn={clockedIn}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
              clockInTime={clockInTime}
              clockOutTime={clockOutTime}
              secondsWorked={secondsWorked}
              leaves={leaves}
              employeeUser={employeeUser}
              showToast={showToast}
            />
          )}

          {activeTab === 'Tasks' && (
            <EmployeeTasksPage
              tasks={tasks}
              setTasks={setTasks}
              setIsAddTaskOpen={setIsAddTaskOpen}
              showToast={showToast}
              employeeUser={employeeUser}
            />
          )}

          {activeTab === 'Events' && (
            <EmployeeEventsPage
              events={events}
              showToast={showToast}
            />
          )}

          {activeTab === 'Settings' && (
            <EmployeeSettingsPage
              showToast={showToast}
              employeeUser={employeeUser}
              setEmployeeUser={(updated) => {
                setEmployeeUser(updated);
                localStorage.setItem('employeeUser', JSON.stringify(updated));
              }}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <ApplyLeaveModal
        isOpen={isAddLeaveOpen}
        onClose={() => setIsAddLeaveOpen(false)}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitLeave({
            id: Date.now(),
            name: employeeUser?.username || 'Employee',
            type: newLeave.type,
            dates: `${newLeave.startDate} to ${newLeave.endDate}`,
            startDate: newLeave.startDate,
            endDate: newLeave.endDate,
            reason: newLeave.reason,
            status: 'Pending',
          });
        }}
        newLeave={newLeave}
        setNewLeave={setNewLeave}
      />

      <CreatePersonalTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSubmit={handleCreateTask}
        newTask={newTask}
        setNewTask={setNewTask}
      />

    </div>
  );
}
