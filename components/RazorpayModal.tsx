'use client';

import { useState } from 'react';
import { X, ShieldCheck, CreditCard, QrCode, Building, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Plan, BirthdayWebsite } from '@/lib/types';
import { createAndVerifyOrder } from '@/lib/store';

interface RazorpayModalProps {
  plan: Plan;
  website: BirthdayWebsite;
  onClose: () => void;
  onSuccess: (orderId: string, slug: string) => void;
}

export default function RazorpayModal({ plan, website, onClose, onSuccess }: RazorpayModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayNow = () => {
    setIsProcessing(true);

    // Simulate Razorpay Gateway network verification delay (1.5s)
    setTimeout(() => {
      try {
        const { order, website: updatedSite } = createAndVerifyOrder(website.id, plan.id, paymentMethod);
        setIsProcessing(false);
        setPaymentSuccess(true);

        setTimeout(() => {
          onSuccess(order.id, updatedSite.slug);
        }, 1200);
      } catch (err) {
        setIsProcessing(false);
        alert(`Payment verification error: ${(err as Error).message}`);
      }
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-4 flex items-center justify-between border-b border-indigo-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              R
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Razorpay Secure Checkout</h3>
              <p className="text-[11px] text-blue-200">Merchant ID: mch_celebration_saas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Strip */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Order for: </span>
            <span className="text-slate-200 font-semibold">{website.personName}&apos;s Birthday Website</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400">Total Amount: </span>
            <span className="text-emerald-400 font-extrabold text-sm">₹{plan.price}</span>
          </div>
        </div>

        {/* Modal Content */}
        {!paymentSuccess ? (
          <div className="p-6 space-y-6">
            
            {/* Plan Badge */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {plan.name} Plan
                </span>
                <h4 className="text-sm font-bold text-white mt-1">{plan.description}</h4>
              </div>
              <div className="text-right">
                <span className="line-through text-slate-500 text-xs mr-1">₹{plan.originalPrice}</span>
                <span className="text-lg font-black text-white">₹{plan.price}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Select Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${paymentMethod === 'upi' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200' : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'}`}
                >
                  <QrCode className="w-5 h-5 text-indigo-400" />
                  <span>GPay / PhonePe / UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${paymentMethod === 'card' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200' : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'}`}
                >
                  <CreditCard className="w-5 h-5 text-rose-400" />
                  <span>Credit / Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${paymentMethod === 'netbanking' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200' : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'}`}
                >
                  <Building className="w-5 h-5 text-emerald-400" />
                  <span>Netbanking</span>
                </button>
              </div>
            </div>

            {/* Method Inputs Preview */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Enter VPA / UPI ID:</span>
                  <span className="text-indigo-400 font-mono">user@okhdfcbank</span>
                </div>
                <input
                  type="text"
                  defaultValue="celebration.user@upi"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                />
                <p className="text-[11px] text-slate-400">Or scan UPI QR code directly inside Google Pay, PhonePe, Paytm or Cred.</p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <input
                  type="text"
                  placeholder="Card Number (4532 •••• •••• 8821)"
                  defaultValue="4532 9812 0041 8821"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    defaultValue="08/29"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                  <input
                    type="password"
                    placeholder="CVV (891)"
                    defaultValue="891"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <select className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs">
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>State Bank of India (SBI)</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Verifying Payment with Razorpay...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Pay ₹{plan.price} & Publish Website 🚀</span>
                </>
              )}
            </button>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted Razorpay Sandbox Gateway</span>
            </div>

          </div>
        ) : (
          /* Payment Success View */
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">Payment Verified! 🎉</h3>
            <p className="text-sm text-slate-300">
              Your payment of <span className="text-emerald-400 font-bold">₹{plan.price}</span> has been confirmed. Your unique birthday website is live!
            </p>
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-amber-300 font-semibold">
              <Sparkles className="w-4 h-4 animate-spin" /> Redirecting to unique shareable link...
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
