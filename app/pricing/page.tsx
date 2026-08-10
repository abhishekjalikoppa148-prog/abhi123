'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Trophy, HelpCircle } from 'lucide-react';
import { PLANS } from '@/lib/sample-data';

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
          Transparent SaaS Pricing
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Simple One-Time Pricing 💳
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          No monthly subscriptions or hidden charges. Pay once per birthday website, keep it live for your recipient!
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all ${plan.popular ? 'bg-gradient-to-b from-purple-950/90 via-slate-900 to-slate-900 border-2 border-purple-500 shadow-2xl shadow-purple-500/20 scale-105' : 'bg-slate-900/80 border border-slate-800'}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-extrabold shadow-lg flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-300" /> MOST POPULAR
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white">₹{plan.price}</span>
                <span className="line-through text-slate-500 text-sm">₹{plan.originalPrice}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">SAVE 50%</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href={`/builder?plan=${plan.id}`}
                className={`w-full py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${plan.popular ? 'bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-xl shadow-purple-500/25' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
              >
                <span>Choose {plan.name} Plan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-6 pt-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about CelebrationCraft SaaS.</p>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-rose-400" /> How long does the birthday website stay online?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Depending on your plan, websites remain live from 30 days up to lifetime access with zero hosting fees.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-rose-400" /> Can I edit the website after paying?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes! You can log into your User Dashboard at any time to edit message text, swap photos, change background music, or update template themes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-rose-400" /> Which payment gateways are supported?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We support Razorpay India, accepting Google Pay, PhonePe, Paytm, all UPI IDs, Debit/Credit Cards, and Netbanking.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
