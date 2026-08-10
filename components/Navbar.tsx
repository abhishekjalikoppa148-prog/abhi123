'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Cake, User as UserIcon, LogOut, Shield, Gift, Sparkles, LayoutDashboard, Menu, X } from 'lucide-react';
import { getCurrentUser, logoutUser, getDailyUsageInfo, DailyUsageInfo, DAILY_FREE_LIMIT } from '@/lib/store';
import { User } from '@/lib/types';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dailyUsage, setDailyUsage] = useState<DailyUsageInfo>({ date: '', count: 0, max: DAILY_FREE_LIMIT, remaining: DAILY_FREE_LIMIT, isLimitReached: false });

  useEffect(() => {
    setUser(getCurrentUser());
    setDailyUsage(getDailyUsageInfo());
  }, [pathname]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setDropdownOpen(false);
    router.push('/');
  };

  if (pathname.startsWith('/birthday/')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/50 shadow-lg shadow-rose-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-rose-500/30 group-hover:scale-105 group-hover:shadow-rose-500/50 transition-all duration-300 border border-purple-500/40 bg-slate-950 p-0.5">
            <Image 
              src="/logo.png" 
              alt="Birthday SaaS Logo" 
              width={40} 
              height={40} 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-gradient-rose">
              Celebration<span className="text-rose-500">Craft</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase -mt-1">Birthday SaaS Platform</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link 
            href="/" 
            className={`hover:text-white transition-colors ${pathname === '/' ? 'text-gradient-rose font-semibold' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/#features" 
            className="hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link 
            href="/#templates" 
            className="hover:text-white transition-colors"
          >
            Templates
          </Link>
          <Link 
            href="/pricing" 
            className={`hover:text-white transition-colors ${pathname === '/pricing' ? 'text-gradient-rose font-semibold' : ''}`}
          >
            Features & FAQ
          </Link>
          <Link 
            href="/builder" 
            className="magnetic-btn flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Website</span>
            <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${dailyUsage.isLimitReached ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'}`}>
              {dailyUsage.isLimitReached ? '3/3 Pay' : `${dailyUsage.count}/3 Free`}
            </span>
          </Link>
        </nav>

        {/* Right Action Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="magnetic-btn flex items-center gap-2.5 p-1.5 pr-3 rounded-full glass-luxury hover:border-rose-500/50 transition-all text-sm font-medium text-slate-200 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-lg shadow-rose-500/30">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                {user.role === 'admin' && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                    Admin
                  </span>
                )}
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-luxury border border-slate-700/50 shadow-2xl p-2 z-50 animate-fade-in-up">
                  <div className="px-3 py-2 border-b border-slate-700/50">
                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-rose-400" />
                      User Dashboard
                    </Link>

                    <Link
                      href="/builder"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <Gift className="w-4 h-4 text-purple-400" />
                      Create Birthday Website
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-cyan-400" />
                      Profile Settings
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-amber-300 hover:bg-amber-500/10 rounded-xl transition-colors font-medium border border-amber-500/20 my-1"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        Admin Dashboard
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/builder"
                className="magnetic-btn ripple px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-sm font-semibold shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 animate-gradient"
              >
                Create Website Free 🎁
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl glass-morph text-slate-300 hover:text-white hover:bg-white/10 transition-all"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-luxury border-b border-slate-800/50 px-4 py-4 space-y-3 animate-fade-in-up">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white py-2 font-medium"
          >
            Home
          </Link>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white py-2 font-medium"
          >
            Features
          </Link>
          <Link
            href="/#templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white py-2 font-medium"
          >
            Templates
          </Link>

          {user ? (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-rose-400 font-medium py-1.5"
              >
                Dashboard
              </Link>
              <Link
                href="/builder"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-200 font-medium py-1.5"
              >
                Create Website
              </Link>
              <button
                onClick={handleLogout}
                className="block text-rose-500 font-medium py-1.5"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                href="/builder"
                onClick={() => setMobileMenuOpen(false)}
                className="magnetic-btn w-full text-center py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold shadow-lg shadow-rose-500/25 animate-gradient"
              >
                Create Website Free 🎁
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
