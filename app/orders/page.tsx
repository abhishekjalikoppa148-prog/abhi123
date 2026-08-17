'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Eye, CheckCircle2, ShoppingBag } from 'lucide-react';
import { getOrders } from '@/lib/store';
import { useAuth } from '@/components/auth/AuthProvider';
import { Order, User } from '@/lib/types';
import InvoiceModal from '@/components/InvoiceModal';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      setOrders(getOrders(user.id));
    } else {
      setOrders(getOrders());
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Orders & Invoices 📄</h1>
          <p className="text-xs text-slate-400">View payment receipts, plan subscriptions, and download GST tax invoices.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
          {orders.length} Purchases
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Order History Found</h3>
          <p className="text-xs text-slate-400">You have not completed any payments yet.</p>
          <Link
            href="/builder"
            className="inline-block px-6 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs"
          >
            Create Website Now
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl glass-luxury overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Recipient Website</th>
                  <th className="p-4">Plan Name</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{order.id}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{order.personName}</span>
                        <Link 
                          href={`/birthday/${order.websiteSlug}`}
                          className="text-[11px] text-rose-400 hover:underline font-mono"
                        >
                          /birthday/{order.websiteSlug}
                        </Link>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-purple-300">{order.planName}</td>
                    <td className="p-4 font-extrabold text-emerald-400 text-sm">₹{order.amount}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{order.createdAt}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/birthday/${order.websiteSlug}`}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-rose-400" /> View
                      </Link>

                      <button
                        onClick={() => setActiveInvoiceOrder(order)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold inline-flex items-center gap-1 border border-rose-500/30"
                      >
                        <FileText className="w-3.5 h-3.5" /> Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {activeInvoiceOrder && (
        <InvoiceModal
          order={activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
        />
      )}

    </div>
  );
}
