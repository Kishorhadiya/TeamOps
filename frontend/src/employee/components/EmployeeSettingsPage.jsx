import React, { useState, useEffect } from 'react';
import { User, Lock, ShieldCheck, Save, Mail, Phone, Camera, Key, Briefcase } from 'lucide-react';

export default function EmployeeSettingsPage({ showToast, employeeUser, setEmployeeUser }) {
  const [activeSubTab, setActiveSubTab] = useState('profile');

  // Form State
  const [profileData, setProfileData] = useState({
    name: 'Alex Rivers',
    email: 'alex.rivers@company.com',
    phone: '+1 (555) 432-8765',
    role: 'Full Stack Engineer',
    department: 'Engineering',
    bio: 'Software engineer building performant web applications and cloud integrations.',
    avatar: ''
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);

  // Synchronize profile data with logged in employeeUser prop
  useEffect(() => {
    if (employeeUser) {
      setProfileData(prev => ({
        ...prev,
        name: employeeUser.username || employeeUser.name || prev.name,
        email: employeeUser.email || prev.email,
        role: employeeUser.role || prev.role,
        department: employeeUser.dept || prev.department,
        phone: employeeUser.phone || prev.phone,
      }));
    }
  }, [employeeUser]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      const updatedEmployee = {
        ...employeeUser,
        username: profileData.name,
        name: profileData.name,
        email: profileData.email,
        role: profileData.role,
        dept: profileData.department,
        phone: profileData.phone
      };

      if (setEmployeeUser) setEmployeeUser(updatedEmployee);

      setSaving(false);
      if (showToast) showToast('Employee profile updated successfully!');
    }, 500);
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (securityData.newPassword && securityData.newPassword !== securityData.confirmPassword) {
      if (showToast) showToast('Error: New passwords do not match');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      if (showToast) showToast('Password updated successfully!');
    }, 500);
  };

  const getInitials = () => {
    const nameStr = (profileData.name || employeeUser?.username || employeeUser?.name || 'Alex Rivers').trim();
    const parts = nameStr.split(/\s+/).filter(Boolean);
    if (parts.length >= 2 && parts[0] && parts[1]) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nameStr.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Page Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Profile & Account Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage your personal contact info, profile picture, and account password.</p>
        </div>
        <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
          <ShieldCheck size={14} /> Active Employee
        </span>
      </div>

      {/* Settings Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Navigation Sidebar */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 h-fit">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'profile' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User size={16} />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveSubTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'security' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Lock size={16} />
            <span>Security & Password</span>
          </button>
        </div>

        {/* Right Form Content Area */}
        <div className="md:col-span-3 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs">
          
          {/* TAB 1: PROFILE DETAILS */}
          {activeSubTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">My Employee Profile</h3>
              </div>

              {/* Avatar Preview */}
              <div className="flex items-center gap-5">
                <div className="relative group">
                  {profileData.avatar ? (
                    <img 
                      src={profileData.avatar} 
                      alt="Avatar" 
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center border-2 border-blue-500 shadow-md">
                      {getInitials()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={20} />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{profileData.name}</h4>
                  <p className="text-xs text-slate-500">{profileData.role} • {profileData.department}</p>
                  <p className="text-[11px] text-blue-600 font-medium mt-1">Provide image URL below to set custom photo</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="email" 
                      required 
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Job Title / Role</label>
                  <input 
                    type="text" 
                    value={profileData.role}
                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                    className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Avatar Image URL</label>
                <input 
                  type="url" 
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-medium transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Bio</label>
                <textarea 
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-medium transition-all resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeSubTab === 'security' && (
            <form onSubmit={handleSaveSecurity} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Update Password</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Current Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-medium transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                      className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                      className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-medium transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Key size={16} />
                  <span>{saving ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
