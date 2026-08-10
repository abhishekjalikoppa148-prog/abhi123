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
    <footer className="bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/50 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/50">
          
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-all border border-purple-500/40 bg-slate-950 p-0.5">
                <Image
                  src="/logo.png"
                  alt="Birthday SaaS Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-gradient-rose">
                Celebration<span className="text-rose-500">Craft</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              The premier paid Birthday Website SaaS platform. Create personalized surprise websites with music, photos, interactive candles, fireworks, and custom domain links in under 5 minutes.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-500 text-xs">
              <span className="flex items-center gap-1 glass-morph px-2 py-1 rounded-full"><Lock className="w-3.5 h-3.5 text-emerald-400" /> SSL Encrypted</span>
              <span className="flex items-center gap-1 glass-morph px-2 py-1 rounded-full"><CreditCard className="w-3.5 h-3.5 text-rose-400" /> Razorpay Secured</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider text-gradient-purple">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-white transition-colors">Home Page</Link></li>
              <li><Link href="/builder" className="hover:text-white transition-colors flex items-center gap-1">Create Website <Sparkles className="w-3 h-3 text-amber-400" /></Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing Plans</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">Order Receipts</Link></li>
            </ul>
          </div>

          {/* Templates */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider text-gradient-rose">Popular Themes</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/builder?template=romantic" className="hover:text-rose-400 transition-colors">Romantic Heart ❤️</Link></li>
              <li><Link href="/builder?template=bestfriend" className="hover:text-purple-400 transition-colors">Bestie Party 🎉</Link></li>
              <li><Link href="/builder?template=family" className="hover:text-amber-400 transition-colors">Family Warmth 🏡</Link></li>
              <li><Link href="/builder?template=cute" className="hover:text-pink-400 transition-colors">Cute Teddy 🧸</Link></li>
              <li><Link href="/builder?template=modern" className="hover:text-cyan-400 transition-colors">Modern Cyber 🌌</Link></li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider text-gradient-gold">Security & Portal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login" className="hover:text-white transition-colors">Login / Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/admin" className="hover:text-amber-400 transition-colors flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-amber-400" /> Admin Dashboard</Link></li>
              <li className="text-slate-500 pt-2">Customer Support: support@celebrationcraft.com</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} CelebrationCraft SaaS Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline animate-pulse" />
            <span>for unforgettable birthday surprises.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
