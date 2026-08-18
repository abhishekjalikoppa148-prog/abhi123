'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Cake, User as UserIcon, LogOut, Shield, Gift, Sparkles, LayoutDashboard, Menu, X } from 'lucide-react';
import { getDailyUsageInfo, DailyUsageInfo, DAILY_FREE_LIMIT } from '@/lib/store';
import { useAuth } from '@/components/auth/AuthProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dailyUsage, setDailyUsage] = useState<DailyUsageInfo>({ date: '', count: 0, max: DAILY_FREE_LIMIT, remaining: DAILY_FREE_LIMIT, isLimitReached: false });

  useEffect(() => {
    setDailyUsage(getDailyUsageInfo());
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  if (pathname.startsWith('/birthday/')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-20px bg-[#071225]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.12)] shadow-sm shadow-blue-500/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/30 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300 border border-[rgba(255,255,255,0.12)] bg-[rgba(15,31,61,0.5)] p-0.5">
            <Image 
              src="/logo.png" 
              alt="Birthday SaaS Logo" 
              width={40} 
              height={40} 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-[#F8FAFC] drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]">
              Celebration<span className="text-[#60A5FA]">Craft</span>
            </span>
            <span className="text-[10px] text-[#CBD5E1] tracking-wider font-semibold uppercase -mt-1">Birthday SaaS Platform</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#CBD5E1]">
          <Link 
            href="/" 
            className={`hover:text-[#60A5FA] transition-colors ${pathname === '/' ? 'text-[#60A5FA] font-semibold' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/#features" 
            className="hover:text-[#60A5FA] transition-colors"
          >
            Features
          </Link>
          <Link 
            href="/#templates" 
            className="hover:text-[#60A5FA] transition-colors"
          >
            Templates
          </Link>
          <Link 
            href="/pricing" 
            className={`hover:text-[#60A5FA] transition-colors ${pathname === '/pricing' ? 'text-[#60A5FA] font-semibold' : ''}`}
          >
            Features & FAQ
          </Link>
          <Link 
            href="/builder" 
            className="magnetic-btn flex items-center gap-1.5 text-[#60A5FA] hover:text-[#3B82F6] font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Website</span>
            <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${dailyUsage.isLimitReached ? 'bg-[#E8C878]/20 text-[#E8C878] border-[#E8C878]/40' : 'bg-[#2563EB]/20 text-[#60A5FA] border-[#2563EB]/40'}`}>
              {dailyUsage.isLimitReached ? '3/3 Pay' : `${dailyUsage.count}/3 Free`}
            </span>
          </Link>
        </nav>

        {/* Right Action Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="magnetic-btn flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[rgba(15,31,61,0.5)] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(59,130,246,0.4)] transition-all text-sm font-medium text-[#F8FAFC] cursor-pointer shadow-sm shadow-blue-500/10"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-xs font-bold text-white uppercase shadow-md shadow-blue-500/30">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                {user.role === 'admin' && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/40 rounded">
                    Admin
                  </span>
                )}
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[rgba(15,31,61,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.12)] shadow-xl shadow-blue-500/20 p-2 z-50 animate-fade-in-up">
                  <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.12)]">
                    <p className="text-xs text-[#94A3B8] font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-[#F8FAFC] truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-[#CBD5E1] hover:text-[#60A5FA] hover:bg-[rgba(59,130,246,0.1)] rounded-xl transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#60A5FA]" />
                      User Dashboard
                    </Link>

                    <Link
                      href="/builder"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-[#CBD5E1] hover:text-[#60A5FA] hover:bg-[rgba(59,130,246,0.1)] rounded-xl transition-colors"
                    >
                      <Gift className="w-4 h-4 text-[#60A5FA]" />
                      Create Birthday Website
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-[#CBD5E1] hover:text-[#60A5FA] hover:bg-[rgba(59,130,246,0.1)] rounded-xl transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#60A5FA]" />
                      Profile Settings
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[#60A5FA] hover:bg-[rgba(59,130,246,0.1)] rounded-xl transition-colors font-medium border border-[#2563EB]/30 my-1"
                      >
                        <Shield className="w-4 h-4 text-[#60A5FA]" />
                        Admin Dashboard
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-[rgba(255,255,255,0.12)]">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium cursor-pointer"
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
                className="px-4 py-2 text-sm font-medium text-[#CBD5E1] hover:text-[#60A5FA] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/builder"
                className="magnetic-btn ripple px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#60A5FA] text-white text-sm font-semibold shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 animate-gradient"
              >
                Create Website Free 🎁
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-[rgba(15,31,61,0.5)] border border-[rgba(255,255,255,0.12)] text-[#CBD5E1] hover:text-[#60A5FA] hover:bg-[rgba(59,130,246,0.1)] transition-all"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[rgba(15,31,61,0.95)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.12)] px-4 py-4 space-y-3 animate-fade-in-up">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#CBD5E1] hover:text-[#60A5FA] py-2 font-medium"
          >
            Home
          </Link>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#CBD5E1] hover:text-[#60A5FA] py-2 font-medium"
          >
            Features
          </Link>
          <Link
            href="/#templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#CBD5E1] hover:text-[#60A5FA] py-2 font-medium"
          >
            Templates
          </Link>

          {user ? (
            <div className="pt-3 border-t border-[rgba(255,255,255,0.12)] space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#60A5FA] font-medium py-1.5"
              >
                Dashboard
              </Link>
              <Link
                href="/builder"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#F8FAFC] font-medium py-1.5"
              >
                Create Website
              </Link>
              <button
                onClick={handleLogout}
                className="block text-red-400 font-medium py-1.5"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-[rgba(255,255,255,0.12)] flex flex-col gap-2">
              <Link
                href="/builder"
                onClick={() => setMobileMenuOpen(false)}
                className="magnetic-btn w-full text-center py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-semibold shadow-md shadow-blue-500/25 animate-gradient"
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
