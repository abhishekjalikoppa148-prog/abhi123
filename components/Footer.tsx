'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Heart, Shield, Lock, CreditCard, Sparkles } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/birthday/')) {
    return null;
  }

  return (
    <footer className="backdrop-blur-xl pt-16 pb-12 text-sm transition-colors duration-300 relative overflow-hidden" style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      color: 'var(--text-heading)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden transition-all border p-0.5 group-hover:scale-105" style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                boxShadow: 'var(--shadow-soft)'
              }}>
                <Image
                  src="/logo.png"
                  alt="Birthday SaaS Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="font-cormorant font-bold text-lg tracking-tight" style={{ color: 'var(--text-heading)' }}>
                Celebration<span style={{ color: 'var(--accent-primary)' }}>Craft</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              The premier Birthday Website SaaS platform. Create personalized surprise websites with music, photos, interactive candles, fireworks, and custom domain links in under 5 minutes.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1 px-2 py-1 rounded-full border" style={{
                backgroundColor: 'var(--accent-primary)/15',
                borderColor: 'var(--accent-primary)/30'
              }}><Lock className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> SSL Encrypted</span>
              <span className="flex items-center gap-1 px-2 py-1 rounded-full border" style={{
                backgroundColor: 'var(--accent-primary)/15',
                borderColor: 'var(--accent-primary)/30'
              }}><CreditCard className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> Razorpay Secured</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-heading)' }}>Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-heading)' }}>Home Page</Link></li>
              <li><Link href="/builder" className="hover:text-[var(--accent-primary)] transition-colors flex items-center gap-1" style={{ color: 'var(--text-heading)' }}>Create Website <Sparkles className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} /></Link></li>
              <li><Link href="/pricing" className="hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-heading)' }}>Pricing Plans</Link></li>
              <li><Link href="/dashboard" className="hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-heading)' }}>User Dashboard</Link></li>
              <li><Link href="/orders" className="hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-heading)' }}>Order Receipts</Link></li>
            </ul>
          </div>

          {/* Templates */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-heading)' }}>Popular Themes</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/builder?template=romantic" className="hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-heading)' }}>Romantic Heart ❤️</Link></li>
              <li><Link href="/builder?template=bestfriend" className="hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-heading)' }}>Bestie Party 🎉</Link></li>
              <li><Link href="/builder?template=family" className="hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-heading)' }}>Family Warmth 🏡</Link></li>
              <li><Link href="/builder?template=cute" className="hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-heading)' }}>Cute Teddy 🧸</Link></li>
              <li><Link href="/builder?template=modern" className="hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-heading)' }}>Modern Cyber 🌌</Link></li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-heading)' }}>Security & Portal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login" className="hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-heading)' }}>Login / Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-heading)' }}>Create Account</Link></li>
              <li><Link href="/admin" className="hover:text-[var(--accent-premium)] transition-colors flex items-center gap-1" style={{ color: 'var(--text-heading)' }}><Shield className="w-3.5 h-3.5" style={{ color: 'var(--accent-premium)' }} /> Admin Dashboard</Link></li>
              <li className="pt-2" style={{ color: 'var(--text-muted)' }}>Customer Support: support@celebrationcraft.com</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} CelebrationCraft SaaS Inc. All rights reserved.</p>
          <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 inline animate-pulse" style={{ color: 'var(--accent-cta)', fill: 'var(--accent-cta)' }} />
            <span>for unforgettable birthday surprises.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
