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
    <footer className="bg-[#071225] backdrop-blur-xl border-t border-[rgba(255,255,255,0.12)] pt-16 pb-12 text-[#CBD5E1] text-sm transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[rgba(255,255,255,0.12)]">
          
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/40 transition-all border border-[rgba(255,255,255,0.12)] bg-[rgba(15,31,61,0.5)] p-0.5">
                <Image
                  src="/logo.png"
                  alt="Birthday SaaS Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#F8FAFC]">
                Celebration<span className="text-[#60A5FA]">Craft</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#CBD5E1]">
              The premier Birthday Website SaaS platform. Create personalized surprise websites with music, photos, interactive candles, fireworks, and custom domain links in under 5 minutes.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#94A3B8] text-xs">
              <span className="flex items-center gap-1 bg-[rgba(37,99,235,0.2)] px-2 py-1 rounded-full border border-[rgba(59,130,246,0.3)]"><Lock className="w-3.5 h-3.5 text-[#60A5FA]" /> SSL Encrypted</span>
              <span className="flex items-center gap-1 bg-[rgba(37,99,235,0.2)] px-2 py-1 rounded-full border border-[rgba(59,130,246,0.3)]"><CreditCard className="w-3.5 h-3.5 text-[#60A5FA]" /> Razorpay Secured</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[#F8FAFC] font-semibold text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-[#60A5FA] transition-colors">Home Page</Link></li>
              <li><Link href="/builder" className="hover:text-[#60A5FA] transition-colors flex items-center gap-1">Create Website <Sparkles className="w-3 h-3 text-[#60A5FA]" /></Link></li>
              <li><Link href="/pricing" className="hover:text-[#60A5FA] transition-colors">Pricing Plans</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#60A5FA] transition-colors">User Dashboard</Link></li>
              <li><Link href="/orders" className="hover:text-[#60A5FA] transition-colors">Order Receipts</Link></li>
            </ul>
          </div>

          {/* Templates */}
          <div className="space-y-3">
            <h4 className="text-[#F8FAFC] font-semibold text-xs uppercase tracking-wider">Popular Themes</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/builder?template=romantic" className="hover:text-[#60A5FA] transition-colors">Romantic Heart ❤️</Link></li>
              <li><Link href="/builder?template=bestfriend" className="hover:text-[#60A5FA] transition-colors">Bestie Party 🎉</Link></li>
              <li><Link href="/builder?template=family" className="hover:text-[#60A5FA] transition-colors">Family Warmth 🏡</Link></li>
              <li><Link href="/builder?template=cute" className="hover:text-[#60A5FA] transition-colors">Cute Teddy 🧸</Link></li>
              <li><Link href="/builder?template=modern" className="hover:text-[#60A5FA] transition-colors">Modern Cyber 🌌</Link></li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <h4 className="text-[#F8FAFC] font-semibold text-xs uppercase tracking-wider">Security & Portal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login" className="hover:text-[#60A5FA] transition-colors">Login / Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-[#60A5FA] transition-colors">Create Account</Link></li>
              <li><Link href="/admin" className="hover:text-[#60A5FA] transition-colors flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-[#60A5FA]" /> Admin Dashboard</Link></li>
              <li className="text-[#94A3B8] pt-2">Customer Support: support@celebrationcraft.com</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-[#CBD5E1]">© {new Date().getFullYear()} CelebrationCraft SaaS Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[#94A3B8]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#E8C878] fill-[#E8C878] inline animate-pulse" />
            <span>for unforgettable birthday surprises.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
