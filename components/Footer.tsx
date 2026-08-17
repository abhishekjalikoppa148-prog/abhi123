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
    <footer className="bg-[#1E3A8A] backdrop-blur-xl border-t border-blue-800 pt-16 pb-12 text-slate-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-blue-800">
          
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all border border-blue-400/40 bg-white p-0.5">
                <Image
                  src="/logo.png"
                  alt="Birthday SaaS Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Celebration<span className="text-blue-400">Craft</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-300">
              The premier paid Birthday Website SaaS platform. Create personalized surprise websites with music, photos, interactive candles, fireworks, and custom domain links in under 5 minutes.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400 text-xs">
              <span className="flex items-center gap-1 bg-blue-900/50 px-2 py-1 rounded-full border border-blue-700"><Lock className="w-3.5 h-3.5 text-blue-400" /> SSL Encrypted</span>
              <span className="flex items-center gap-1 bg-blue-900/50 px-2 py-1 rounded-full border border-blue-700"><CreditCard className="w-3.5 h-3.5 text-blue-400" /> Razorpay Secured</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-blue-300 transition-colors">Home Page</Link></li>
              <li><Link href="/builder" className="hover:text-blue-300 transition-colors flex items-center gap-1">Create Website <Sparkles className="w-3 h-3 text-blue-400" /></Link></li>
              <li><Link href="/pricing" className="hover:text-blue-300 transition-colors">Pricing Plans</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-300 transition-colors">User Dashboard</Link></li>
              <li><Link href="/orders" className="hover:text-blue-300 transition-colors">Order Receipts</Link></li>
            </ul>
          </div>

          {/* Templates */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Popular Themes</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/builder?template=romantic" className="hover:text-blue-300 transition-colors">Romantic Heart ❤️</Link></li>
              <li><Link href="/builder?template=bestfriend" className="hover:text-blue-300 transition-colors">Bestie Party 🎉</Link></li>
              <li><Link href="/builder?template=family" className="hover:text-blue-300 transition-colors">Family Warmth 🏡</Link></li>
              <li><Link href="/builder?template=cute" className="hover:text-blue-300 transition-colors">Cute Teddy 🧸</Link></li>
              <li><Link href="/builder?template=modern" className="hover:text-blue-300 transition-colors">Modern Cyber 🌌</Link></li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Security & Portal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login" className="hover:text-blue-300 transition-colors">Login / Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-blue-300 transition-colors">Create Account</Link></li>
              <li><Link href="/admin" className="hover:text-blue-300 transition-colors flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-blue-400" /> Admin Dashboard</Link></li>
              <li className="text-slate-400 pt-2">Customer Support: support@celebrationcraft.com</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-300">© {new Date().getFullYear()} CelebrationCraft SaaS Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-blue-400 fill-blue-400 inline animate-pulse" />
            <span>for unforgettable birthday surprises.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
