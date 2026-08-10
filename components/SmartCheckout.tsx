'use client';

import { useState } from 'react';
import { CheckCircle2, Lock, Zap, ShieldCheck, Clock } from 'lucide-react';
import { PLANS } from '@/lib/sample-data';

interface SmartCheckoutProps {
  templateName: string;
  photoCount: number;
  hasMusic: boolean;
  hasAIMessage: boolean;
  selectedPlanId: string;
  onPlanChange: (planId: string) => void;
  onPayment: () => void;
  couponCode?: string;
  onCouponApply?: (code: string) => void;
}

export default function SmartCheckout({
  templateName,
  photoCount,
  hasMusic,
  hasAIMessage,
  selectedPlanId,
  onPlanChange,
  onPayment,
  couponCode = '',
  onCouponApply
}: SmartCheckoutProps) {
  const [couponInput, setCouponInput] = useState(couponCode);
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const selectedPlan = PLANS.find(p => p.id === selectedPlanId) || PLANS[0];

  const handleCouponApply = () => {
    if (couponInput.trim()) {
      setCouponApplied(true);
      // Simulate coupon discount (in production, validate server-side)
      setDiscount(selectedPlan.price * 0.2); // 20% discount
      onCouponApply?.(couponInput);
    }
  };

  const originalPrice = selectedPlan.originalPrice;
  const couponDiscount = couponApplied ? discount : 0;
  const finalPrice = Math.max(0, selectedPlan.price - couponDiscount);

  return (
    <div className="w-full max-w-2xl mx-auto glass-luxury rounded-3xl p-8 space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white">Your Birthday Website</h2>
        <p className="text-slate-400 text-sm">Review your order before payment</p>
      </div>

      {/* Order Summary */}
      <div className="space-y-4 p-6 rounded-2xl bg-slate-950 border border-slate-800">
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Template</span>
            <span className="text-white font-semibold">{templateName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Photos</span>
            <span className="text-white font-semibold">{photoCount} photos</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Music</span>
            <span className="text-white font-semibold">{hasMusic ? 'Yes' : 'No'}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">AI Message</span>
            <span className="text-white font-semibold">{hasAIMessage ? 'Yes' : 'No'}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Plan</span>
            <span className="text-white font-semibold">{selectedPlan.name}</span>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Original</span>
            <span className="text-slate-300 line-through">₹{originalPrice}</span>
          </div>
          
          {couponApplied && (
            <div className="flex justify-between items-center">
              <span className="text-emerald-400">Discount</span>
              <span className="text-emerald-400">-₹{Math.round(couponDiscount)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <span className="text-white font-bold text-lg">Total</span>
            <span className="text-white font-black text-2xl">₹{finalPrice}</span>
          </div>
        </div>

      </div>

      {/* Coupon Input */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-white">Have a coupon?</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter coupon code"
            disabled={couponApplied}
            className="flex-1 px-4 py-3 rounded-xl glass-luxury text-white text-sm focus:border-rose-500 focus:outline-none disabled:opacity-50"
          />
          {!couponApplied ? (
            <button
              onClick={handleCouponApply}
              disabled={!couponInput.trim()}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors disabled:opacity-50"
            >
              Apply
            </button>
          ) : (
            <button
              onClick={() => { setCouponApplied(false); setDiscount(0); }}
              className="px-6 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm"
            >
              Applied ✓
            </button>
          )}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-emerald-400" /> Secure payment
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" /> Instant publishing
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400" /> No coding required
        </span>
      </div>

      {/* Payment Button */}
      <button
        onClick={onPayment}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-black text-lg shadow-2xl shadow-rose-500/30 flex items-center justify-center gap-3 transition-all hover:scale-105"
      >
        Create My Birthday Website →
      </button>

    </div>
  );
}
