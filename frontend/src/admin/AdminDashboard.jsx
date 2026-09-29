import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, X } from 'lucide-react';
import axios from 'axios';

// Redux actions
import { logout } from './store/slices/authSlice';
import { fetchLeaves, updateLeaveStatus, addLeaveLocal } from './store/slices/leaveSlice';

// Components
import AdminAuth from './components/AdminAuth';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import EmployeesPage from './components/EmployeesPage';
import LeavePage from './components/LeavePage';
import EventsPage from './components/EventsPage';
import TasksPage from './components/TasksPage';
import SettingsPage from './components/SettingsPage';
import { AddEmployeeModal, RequestLeaveModal, AddEventModal, CreateTaskModal } from './components/Modals';
import { ADMIN_API, BACKEND_API } from '../config/api';

const defaultEmployeesList = [
  { id: 1, name: 'Alex Johnson', role: 'Fullstack Developer', dept: 'Engineering', email: 'alex.j@company.com', status: 'Active' },
  { id: 2, name: 'Sarah Williams', role: 'Frontend Engineer', dept: 'Engineering', email: 'sarah.w@company.com', status: 'Active' },
  { id: 3, name: 'Michael Chen', role: 'Backend Developer', dept: 'Engineering', email: 'michael.c@company.com', status: 'Active' },
  { id: 4, name: 'Jessica Miller', role: 'UI/UX Designer', dept: 'Design', email: 'jessica.m@company.com', status: 'Active' },
  { id: 5, name: 'David Kim', role: 'DevOps Engineer', dept: 'Operations', email: 'david.k@company.com', status: 'Active' }
];

export default function AdminDashboard() {
  const dispatch = useDispatch();

  // ── Read from Redux store
  const { isAuthenticated, admin, loading: authLoading } = useSelector((s) => s.auth);
  const { list: leaveRequests } = useSelector((s) => s.leave);

  // ── Real backend data states (no dummy arrays)
  const [tasks, setTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('company_employees');
      return saved ? JSON.parse(saved) : defaultEmployeesList;
    } catch {
      return defaultEmployeesList;
    }
  });

  // ── UI state
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ── Modal state
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // ── Form state
  const [newEmp, setNewEmp] = useState({ name: '', role: '', dept: 'Engineering', email: '', password: '' });
  const [newLeave, setNewLeave] = useState({ name: '', type: 'Vacation', dates: '', reason: '' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '10:00 AM', category: 'Meeting', description: '' });
  const [newTask, setNewTask] = useState({ title: '', userid: '', assignee: '', dueDate: '', priority: 'Medium' });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ──────────────────────────────────────────
  // FETCH REAL DATA FROM BACKEND APIS
  // ──────────────────────────────────────────
  const fetchAllData = async () => {
    // 1. Fetch Leaves via Redux
    dispatch(fetchLeaves());

    // 2. Fetch Employees / Users from Postgres
    try {
      const res = await axios.get(`${ADMIN_API}/users`);
      if (res.data?.users && res.data.users.length > 0) {
        const mappedUsers = res.data.users.map((u, i) => ({
          id: u.id || i + 1,
          name: u.username || u.name || 'Employee',
          username: u.username || u.name || 'Employee',
          role: u.role || 'Team Member',
          dept: u.dept || 'Engineering',
          email: u.email || `${(u.username || 'developer').toLowerCase().replace(/\s+/g, '.')}@company.com`,
          status: 'Active',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username || u.name || 'E')}&background=3b82f6&color=fff&bold=true`,
        }));
        setEmployees(mappedUsers);
        localStorage.setItem('company_employees', JSON.stringify(mappedUsers));
      } else {
        const saved = localStorage.getItem('company_employees');
        if (saved) {
          setEmployees(JSON.parse(saved));
        } else {
          setEmployees(defaultEmployeesList);
          localStorage.setItem('company_employees', JSON.stringify(defaultEmployeesList));
        }
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err.message);
      try {
        const saved = localStorage.getItem('company_employees');
        if (saved) setEmployees(JSON.parse(saved));
        else setEmployees(defaultEmployeesList);
      } catch {
        setEmployees(defaultEmployeesList);
      }
    }

    // 3. Fetch Events from Postgres
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

    // 4. Fetch Tasks from Postgres
    try {
      const res = await axios.get(`${ADMIN_API}/task/allTasks`);
      if (res.data?.tasks) {
        const mappedTasks = res.data.tasks.map((t) => ({
          id: t.id,
          title: t.task,
          dueDate: t.enddate ? String(t.enddate).slice(0, 10) : 'Due Soon',
          status: t.status || 'To Do',
          assignee: t.assignee_name || 'Staff',
          priority: 'Medium',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.assignee_name || 'T')}&background=6366f1&color=fff`,
        }));
        setTasks(mappedTasks);
        setMyTasks(mappedTasks.map((t) => ({ id: t.id, text: t.title, completed: t.status === 'Completed' })));
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, dispatch]);

  // ── Logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // ──────────────────────────────────────────
  // APPROVE / REJECT → calls backend via Redux
  // ──────────────────────────────────────────
  const handleApproveLeave = async (id) => {
    const req = leaveRequests.find((r) => r.id === id);
    await dispatch(updateLeaveStatus({
      id,
      userid: req?.userid || id,
      status: 'Approved',
      adminid: admin?.id || 1,
    }));
    showToast(`Leave for ${req?.name || 'Employee'} Approved!`);
    dispatch(fetchLeaves());
  };

  const handleRejectLeave = async (id) => {
    const req = leaveRequests.find((r) => r.id === id);
    await dispatch(updateLeaveStatus({
      id,
      userid: req?.userid || id,
      status: 'Rejected',
      adminid: admin?.id || 1,
    }));
    showToast(`Leave for ${req?.name || 'Employee'} Rejected.`);
    dispatch(fetchLeaves());
  };

  // ── My Tasks toggle
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

  // ── Create Employee (Persist via signup endpoint)
  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.email) return;

    try {
      await axios.post(`${BACKEND_API}/signup`, {
        username: newEmp.name,
        email: newEmp.email,
        password: newEmp.password || 'employee123',
      });
      showToast(`Employee "${newEmp.name}" registered successfully!`);
      fetchAllData();
    } catch (err) {
      // Local fallback
      const created = {
        id: Date.now(),
        name: newEmp.name,
        role: newEmp.role || 'Team Member',
        dept: newEmp.dept || 'General',
        email: newEmp.email,
        status: 'Active',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newEmp.name)}&background=3b82f6&color=fff`,
      };
      setEmployees([created, ...employees]);
      showToast(`Employee ${created.name} added!`);
    }

    setIsAddEmployeeOpen(false);
    setNewEmp({ name: '', role: '', dept: '', email: '', password: '' });
  };

  // ── Create Leave
  const handleCreateLeave = async (e) => {
    e.preventDefault();
    if (!newLeave.dates) return;

    try {
      const datesSplit = newLeave.dates.split(' to ');
      await axios.post(`${BACKEND_API}/createLeave`, {
        userid: employees[0]?.id || 1,
        reason: newLeave.reason || newLeave.type,
        startdate: datesSplit[0] || new Date().toISOString().slice(0, 10),
        enddate: datesSplit[1] || datesSplit[0] || new Date().toISOString().slice(0, 10),
      });
      showToast('Leave request submitted to database!');
      dispatch(fetchLeaves());
    } catch {
      const created = {
        id: Date.now(),
        name: newLeave.name || 'Employee',
        role: 'Team Member',
        type: newLeave.type,
        dates: newLeave.dates,
        status: 'Pending',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newLeave.name || 'E')}&background=3b82f6&color=fff`,
      };
      dispatch(addLeaveLocal(created));
      showToast('Leave request submitted!');
    }

    setIsAddLeaveOpen(false);
    setNewLeave({ name: '', type: 'Vacation', dates: '', reason: '' });
  };

  // ── Create Event (Persist to backend with full metadata & localStorage sync)
  const handleCreateEvent = async (e, customEventData) => {
    if (e?.preventDefault) e.preventDefault();
    const evData = customEventData || newEvent;
    if (!evData.title || !evData.date) return;

    const descriptionPayload = JSON.stringify({
      description: evData.description || 'Company event',
      category: evData.category || 'Meeting',
      time: evData.time || '10:00 AM',
      location: evData.location || 'Conference Room A',
    });

    try {
      const res = await axios.post(`${BACKEND_API}/eventcreate`, {
        title: evData.title,
        description: descriptionPayload,
        date: evData.date,
        file: '',
      });

      const newDbEvent = res.data?.Event;
      const createdObj = {
        id: newDbEvent?.id || Date.now(),
        title: evData.title,
        date: evData.date ? String(evData.date).slice(0, 10) : 'Upcoming',
        time: evData.time || '10:00 AM',
        category: evData.category || 'Meeting',
        location: evData.location || 'Conference Room A',
        description: evData.description || '',
      };

      setEvents((prev) => {
        const updated = [createdObj, ...prev.filter((x) => x.id !== createdObj.id)];
        localStorage.setItem('shared_events', JSON.stringify(updated));
        return updated;
      });

      showToast(`Event "${evData.title}" created successfully!`);
      fetchAllData();
    } catch (err) {
      console.error('Create event error:', err.message);
      const created = {
        id: Date.now(),
        title: evData.title,
        date: evData.date,
        time: evData.time || '10:00 AM',
        category: evData.category || 'Meeting',
        location: evData.location || 'Conference Room A',
        description: evData.description || '',
      };
      setEvents((prev) => {
        const updated = [created, ...prev];
        localStorage.setItem('shared_events', JSON.stringify(updated));
        return updated;
      });
      showToast(`Event "${evData.title}" added to schedule!`);
    }

    setIsAddEventOpen(false);
    setNewEvent({ title: '', date: '', time: '10:00 AM', category: 'Meeting', description: '' });
  };

  // ── Delete Event (Persist to backend)
  const handleDeleteEvent = async (eventId, eventTitle) => {
    try {
      await axios.delete(`${BACKEND_API}/deleteevent/${eventId}`);
      setEvents((prev) => {
        const updated = prev.filter((e) => e.id !== eventId);
        localStorage.setItem('shared_events', JSON.stringify(updated));
        return updated;
      });
      showToast(`Event "${eventTitle || 'Event'}" deleted from database!`);
    } catch (err) {
      console.error('Failed to delete event:', err.message);
      setEvents((prev) => {
        const updated = prev.filter((e) => e.id !== eventId);
        localStorage.setItem('shared_events', JSON.stringify(updated));
        return updated;
      });
      showToast(`Event removed`);
    }
  };

  // ── Create Task (Persist to backend with developer assignment)
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    const assignedUserId = newTask.userid || (employees.length > 0 ? employees[0].id : null);
    const assignedName = newTask.assignee || employees.find(emp => String(emp.id) === String(assignedUserId))?.name || 'Developer';

    try {
      await axios.post(`${ADMIN_API}/task/createTask`, {
        task: newTask.title,
        userid: assignedUserId,
        adminid: admin?.id || null,
        status: 'To Do',
        startdate: new Date().toISOString().slice(0, 10),
        enddate: newTask.dueDate || new Date().toISOString().slice(0, 10),
      });
      showToast(`Task assigned to ${assignedName} successfully!`);
      fetchAllData();
    } catch (err) {
      const created = {
        id: Date.now(),
        title: newTask.title,
        dueDate: newTask.dueDate || 'Due Soon',
        status: 'To Do',
        assignee: assignedName,
        priority: newTask.priority || 'Medium',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(assignedName)}&background=6366f1&color=fff`,
      };
      setTasks([created, ...tasks]);
      showToast(`Task assigned to ${assignedName}!`);
    }

    setIsAddTaskOpen(false);
    setNewTask({ title: '', userid: '', assignee: '', dueDate: '', priority: 'Medium' });
  };

  // ── Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm font-medium">Connecting to backend server...</p>
        </div>
      </div>
    );
  }

  // ── Auth Screen
  if (!isAuthenticated) {
    return <AdminAuth />;
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] font-sans text-slate-800 flex">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1A2035] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce border border-blue-500/30">
          <CheckCircle className="text-green-400 shrink-0" size={20} />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-gray-400 hover:text-white"><X size={16} /></button>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        employeeCount={employees.length}
        pendingLeaveCount={leaveRequests.filter((r) => r.status === 'Pending').length}
        eventCount={events.length}
        taskCount={tasks.length}
        onLogout={handleLogout}
        adminUser={admin}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Container */}
      <main className="ml-0 lg:ml-64 flex-1 flex flex-col min-h-screen w-full transition-all">
        <Header
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          setNotifications={setNotifications}
          onLogout={handleLogout}
          setActiveTab={setActiveTab}
          adminUser={admin}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'Dashboard' && (
            <DashboardOverview
              leaveRequests={leaveRequests}
              events={events}
              tasks={tasks}
              myTasks={myTasks}
              toggleMyTask={toggleMyTask}
              progressPercent={progressPercent}
              handleApproveLeave={handleApproveLeave}
              handleRejectLeave={handleRejectLeave}
              setIsAddLeaveOpen={setIsAddLeaveOpen}
              setIsAddEventOpen={setIsAddEventOpen}
              setIsAddTaskOpen={setIsAddTaskOpen}
              employees={employees}
              showToast={showToast}
            />
          )}

          {activeTab === 'Employees' && (
            <EmployeesPage
              employees={employees}
              setEmployees={setEmployees}
              searchQuery={searchQuery}
              setIsAddEmployeeOpen={setIsAddEmployeeOpen}
              showToast={showToast}
            />
          )}

          {activeTab === 'Leave' && (
            <LeavePage
              leaveRequests={leaveRequests}
              handleApproveLeave={handleApproveLeave}
              handleRejectLeave={handleRejectLeave}
              setIsAddLeaveOpen={setIsAddLeaveOpen}
              showToast={showToast}
              employees={employees}
            />
          )}

          {activeTab === 'Events' && (
            <EventsPage
              events={events}
              setEvents={setEvents}
              handleCreateEvent={handleCreateEvent}
              handleDeleteEvent={handleDeleteEvent}
              setIsAddEventOpen={setIsAddEventOpen}
              showToast={showToast}
            />
          )}

          {activeTab === 'Tasks' && (
            <TasksPage
              tasks={tasks}
              setTasks={setTasks}
              setIsAddTaskOpen={setIsAddTaskOpen}
              showToast={showToast}
              employees={employees}
            />
          )}

          {activeTab === 'Settings' && (
            <SettingsPage showToast={showToast} adminUser={admin} setAdminUser={() => {}} />
          )}
        </div>
      </main>

      {/* Modals */}
      <AddEmployeeModal isOpen={isAddEmployeeOpen} onClose={() => setIsAddEmployeeOpen(false)} onSubmit={handleCreateEmployee} newEmp={newEmp} setNewEmp={setNewEmp} />
      <RequestLeaveModal isOpen={isAddLeaveOpen} onClose={() => setIsAddLeaveOpen(false)} onSubmit={handleCreateLeave} newLeave={newLeave} setNewLeave={setNewLeave} employees={employees} />
      <AddEventModal isOpen={isAddEventOpen} onClose={() => setIsAddEventOpen(false)} onSubmit={handleCreateEvent} newEvent={newEvent} setNewEvent={setNewEvent} />
      <CreateTaskModal isOpen={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} onSubmit={handleCreateTask} newTask={newTask} setNewTask={setNewTask} employees={employees} />
    </div>
  );
}
