'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Mail, Lock, Bell, LogOut, Trash2, CheckCircle2, Shield } from 'lucide-react';
import { getCurrentUser, setCurrentUser, logoutUser } from '@/lib/store';
import { User } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const curr = getCurrentUser();
    if (!curr) {
      router.push('/login');
      return;
    }
    setUser(curr);
    setName(curr.name);
    setEmail(curr.email);
    setNotifications(curr.notificationsEnabled !== false);
  }, [router]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated: User = {
      ...user,
      name,
      email,
      notificationsEnabled: notifications
    };
    setCurrentUser(updated);
    setUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? All created birthday websites will be removed.')) {
      logoutUser();
      router.push('/');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Profile & Account Settings 👤</h1>
          <p className="text-xs text-slate-400">Manage your personal information, security, and notification preferences.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
          User ID: {user.id}
        </span>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Account profile updated successfully!
        </div>
      )}

      {/* Main Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Avatar Card */}
        <div className="p-6 rounded-3xl glass-luxury text-center space-y-4 card-3d">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 p-1 mx-auto shadow-xl">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl font-black text-white uppercase">
              {name ? name[0] : 'U'}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white text-lg">{name}</h3>
            <p className="text-xs text-slate-400">{email}</p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            {user.role === 'admin' && (
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Super Admin
              </span>
            )}
            <button
              onClick={handleLogout}
              className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-rose-500/20"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Right Settings Form */}
        <div className="md:col-span-2 space-y-6 p-6 rounded-3xl glass-luxury">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Personal Information
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Password Security */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Security & Password
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Notification Preferences
              </h3>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-slate-200 font-medium">Email alerts when someone views my birthday website</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="rounded accent-rose-500"
                />
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="text-xs text-rose-500 hover:text-rose-400 font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Account
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20"
              >
                Save Profile Changes
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
