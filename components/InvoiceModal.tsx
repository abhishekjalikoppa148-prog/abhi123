'use client';

import { X, Printer, ShieldCheck, Download, Cake } from 'lucide-react';
import { Order } from '@/lib/types';

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export default function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const gstAmount = Math.round(order.amount * 0.18);
  const baseAmount = order.amount - gstAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center">
              <Cake className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">CelebrationCraft Invoice</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-rose-400" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 text-slate-300 text-sm font-sans">
          
          {/* Top metadata */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs text-slate-400">Tax Invoice To:</p>
              <h4 className="font-bold text-white text-base">{order.userName}</h4>
              <p className="text-xs text-slate-400">{order.userEmail}</p>
            </div>
            <div className="sm:text-right text-xs space-y-1">
              <p><span className="text-slate-400">Invoice No:</span> <strong className="text-white font-mono">{order.id}</strong></p>
              <p><span className="text-slate-400">Date:</span> <strong className="text-white">{order.createdAt}</strong></p>
              <p><span className="text-slate-400">Payment Ref:</span> <strong className="text-indigo-400 font-mono">{order.paymentId}</strong></p>
              <p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PAYMENT SUCCESSFUL
                </span>
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Website Target</th>
                  <th className="py-2 text-right">Base</th>
                  <th className="py-2 text-right">GST (18%)</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                <tr>
                  <td className="py-3 font-semibold text-white">
                    {order.planName} Subscription
                  </td>
                  <td className="py-3 font-mono text-rose-400">
                    /birthday/{order.websiteSlug}
                  </td>
                  <td className="py-3 text-right">₹{baseAmount}</td>
                  <td className="py-3 text-right">₹{gstAmount}</td>
                  <td className="py-3 text-right font-extrabold text-white text-sm">₹{order.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Breakdown & Total */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-slate-800 text-xs">
            <div className="space-y-1 text-slate-400">
              <p>GSTIN: <strong className="text-slate-200">07AAAAA0000A1Z5</strong> (CelebrationCraft SaaS)</p>
              <p>Payment Gateway: Razorpay India (UPI/Card)</p>
            </div>
            <div className="mt-3 sm:mt-0 p-3 rounded-xl bg-slate-900 border border-slate-800 text-right space-y-1 w-full sm:w-48">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>₹{baseAmount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>18% IGST:</span>
                <span>₹{gstAmount}</span>
              </div>
              <div className="flex justify-between font-extrabold text-white text-sm pt-1 border-t border-slate-800">
                <span>Paid Total:</span>
                <span className="text-emerald-400">₹{order.amount}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authorized Computer Generated Receipt
          </span>
          <span>Thank you for choosing CelebrationCraft!</span>
        </div>

      </div>
    </div>
  );
}
