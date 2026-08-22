'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Trophy, HelpCircle } from 'lucide-react';
import { PLANS } from '@/lib/sample-data';

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{
          backgroundColor: 'var(--accent-primary)/10',
          borderColor: 'var(--accent-primary)/30',
          color: 'var(--accent-primary)'
        }}>
          Transparent SaaS Pricing
        </span>
        <h1 className="font-cormorant text-4xl sm:text-6xl font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>
          Simple One-Time Pricing 💳
        </h1>
        <p className="text-base sm:text-lg" style={{ color: 'var(--text-muted)' }}>
          No monthly subscriptions or hidden charges. Pay once per birthday website, keep it live for your recipient!
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all border ${plan.popular ? 'shadow-xl scale-105' : 'shadow-sm'}`}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: plan.popular ? 'var(--accent-primary)' : 'var(--border-subtle)'
            }}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-extrabold shadow-lg flex items-center gap-1" style={{
                background: 'linear-gradient(to right, var(--accent-primary), var(--accent-cta))',
                color: '#FFFFFF'
              }}>
                <Trophy className="w-3.5 h-3.5" style={{ color: 'var(--accent-premium)' }} /> MOST POPULAR
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold" style={{ color: 'var(--text-heading)' }}>{plan.name}</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black" style={{ color: 'var(--text-heading)' }}>₹{plan.price}</span>
                <span className="line-through text-sm" style={{ color: 'var(--text-muted)' }}>₹{plan.originalPrice}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{
                  color: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)'
                }}>SAVE 50%</span>
              </div>

              <ul className="space-y-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href={`/builder?plan=${plan.id}`}
                className={`w-full py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${plan.popular ? 'shadow-xl' : 'shadow-sm'}`}
                style={{
                  background: plan.popular ? 'linear-gradient(to right, var(--accent-primary), var(--accent-cta))' : 'var(--bg-secondary)',
                  color: plan.popular ? '#FFFFFF' : 'var(--text-heading)'
                }}
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
          <h2 className="font-cormorant text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Frequently Asked Questions</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Everything you need to know about CelebrationCraft SaaS.</p>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl border space-y-2" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <h4 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
              <HelpCircle className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> How long does the birthday website stay online?
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Depending on your plan, websites remain live from 30 days up to lifetime access with zero hosting fees.
            </p>
          </div>

          <div className="p-6 rounded-2xl border space-y-2" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <h4 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
              <HelpCircle className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> Can I edit the website after paying?
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Yes! You can log into your User Dashboard at any time to edit message text, swap photos, change background music, or update template themes.
            </p>
          </div>

          <div className="p-6 rounded-2xl border space-y-2" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <h4 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
              <HelpCircle className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> Which payment gateways are supported?
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              We support Razorpay India, accepting Google Pay, PhonePe, Paytm, all UPI IDs, Debit/Credit Cards, and Netbanking.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
