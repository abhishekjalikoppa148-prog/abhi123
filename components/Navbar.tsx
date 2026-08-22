'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Cake, User as UserIcon, LogOut, Shield, Gift, Sparkles, LayoutDashboard, Menu, X } from 'lucide-react';
import { getDailyUsageInfo, DailyUsageInfo, DAILY_FREE_LIMIT } from '@/lib/store';
import { useAuth } from '@/components/auth/AuthProvider';
import ThemeSwitcher from '@/components/ThemeSwitcher';

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
    <header className="sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300" style={{ backgroundColor: 'var(--glass-bg)', borderBottom: '1px solid var(--glass-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden transition-all duration-300 border p-0.5 group-hover:scale-105" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-soft)' }}>
            <Image 
              src="/logo.png" 
              alt="Birthday SaaS Logo" 
              width={40} 
              height={40} 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-cormorant font-bold text-lg tracking-tight" style={{ color: 'var(--text-heading)' }}>
              Celebration<span style={{ color: 'var(--accent-primary)' }}>Craft</span>
            </span>
            <span className="text-[10px] tracking-wider font-semibold uppercase -mt-1" style={{ color: 'var(--text-muted)' }}>Birthday SaaS Platform</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
          <Link 
            href="/templates" 
            className="hover:text-[var(--accent-primary)] transition-colors"
          >
            Templates
          </Link>
          <Link 
            href="/#features" 
            className="hover:text-[var(--accent-primary)] transition-colors"
          >
            Features
          </Link>
          <Link 
            href="/pricing" 
            className="hover:text-[var(--accent-primary)] transition-colors"
          >
            Pricing
          </Link>
          <Link 
            href="/#how-it-works" 
            className="hover:text-[var(--accent-primary)] transition-colors"
          >
            How It Works
          </Link>
          <Link 
            href="/#gallery" 
            className="hover:text-[var(--accent-primary)] transition-colors"
          >
            Gallery
          </Link>
        </nav>

        {/* Right Action Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search Icon */}
          <button className="p-2 rounded-xl transition-all hover:scale-105 cursor-pointer" style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-heading)'
          }}>
            <LayoutDashboard className="w-5 h-5" />
          </button>
          
          <ThemeSwitcher />
          
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="magnetic-btn flex items-center gap-2.5 p-1.5 pr-3 rounded-full transition-all text-sm font-medium cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-heading)',
                  boxShadow: 'var(--shadow-soft)'
                }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shadow-md" style={{
                  background: 'linear-gradient(to right, var(--accent-primary), var(--accent-cta))',
                  boxShadow: '0 4px 12px rgba(217, 140, 154, 0.3)'
                }}>
                  {user.name ? user.name[0] : 'U'}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                {user.role === 'admin' && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded" style={{
                    backgroundColor: 'var(--accent-premium)/20',
                    color: 'var(--accent-premium)',
                    borderColor: 'var(--accent-premium)/40'
                  }}>
                    Admin
                  </span>
                )}
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl backdrop-blur-xl shadow-xl p-2 z-50 animate-fade-in-up" style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)'
                }}>
                  <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Signed in as</p>
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-heading)' }}>{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-colors hover:bg-[rgba(217,140,154,0.1)]"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      <LayoutDashboard className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                      User Dashboard
                    </Link>

                    <Link
                      href="/builder"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-colors hover:bg-[rgba(217,140,154,0.1)]"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      <Gift className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                      Create Birthday Website
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-colors hover:bg-[rgba(217,140,154,0.1)]"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      <UserIcon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                      Profile Settings
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-colors font-medium border my-1 hover:bg-[rgba(201,164,92,0.1)]"
                        style={{
                          color: 'var(--accent-premium)',
                          borderColor: 'var(--accent-premium)/30'
                        }}
                      >
                        <Shield className="w-4 h-4" style={{ color: 'var(--accent-premium)' }} />
                        Admin Dashboard
                      </Link>
                    )}
                  </div>

                  <div className="pt-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-colors font-medium cursor-pointer hover:bg-[rgba(231,111,97,0.1)]"
                      style={{ color: 'var(--accent-cta)' }}
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
                className="px-4 py-2 text-sm font-medium transition-colors hover:text-[var(--accent-primary)]"
                style={{ color: 'var(--text-heading)' }}
              >
                Login
              </Link>
              <Link
                href="/builder"
                className="magnetic-btn ripple px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: 'var(--text-heading)',
                  color: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-medium)'
                }}
              >
                Create Website Free 🎁
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl transition-all hover:bg-[rgba(217,140,154,0.1)]"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-heading)'
          }}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden backdrop-blur-xl px-4 py-4 space-y-3 animate-fade-in-up" style={{
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-medium transition-colors hover:text-[var(--accent-primary)]"
            style={{ color: 'var(--text-heading)' }}
          >
            Home
          </Link>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-medium transition-colors hover:text-[var(--accent-primary)]"
            style={{ color: 'var(--text-heading)' }}
          >
            Features
          </Link>
          <Link
            href="/#templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-medium transition-colors hover:text-[var(--accent-primary)]"
            style={{ color: 'var(--text-heading)' }}
          >
            Templates
          </Link>

          {user ? (
            <div className="pt-3 space-y-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-medium py-1.5 transition-colors"
                style={{ color: 'var(--accent-primary)' }}
              >
                Dashboard
              </Link>
              <Link
                href="/builder"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-medium py-1.5 transition-colors hover:text-[var(--accent-primary)]"
                style={{ color: 'var(--text-heading)' }}
              >
                Create Website
              </Link>
              <button
                onClick={handleLogout}
                className="block text-[#E76F61] font-medium py-1.5"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-[rgba(217,140,154,0.2)] flex flex-col gap-2">
              <Link
                href="/builder"
                onClick={() => setMobileMenuOpen(false)}
                className="magnetic-btn w-full text-center py-2 rounded-xl bg-[#43283A] text-white font-semibold shadow-md shadow-[rgba(67,40,58,0.2)]"
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
