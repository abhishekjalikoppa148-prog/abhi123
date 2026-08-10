'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, Users, Globe, IndianRupee, Eye, RefreshCw, 
  CheckCircle2, AlertCircle, FileText, Search
} from 'lucide-react';
import { getAdminStats, getWebsites, getOrders } from '@/lib/store';
import { getAdminStats as getDBAdminStats } from '@/lib/db';
import { BirthdayWebsite, Order } from '@/lib/types';
import { INITIAL_USER, INITIAL_ADMIN } from '@/lib/sample-data';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 142,
    totalWebsites: 289,
    totalRevenue: 48900,
    todaysSales: 3200,
    activeWebsites: 260,
    failedPayments: 3,
    totalViews: 14820,
    conversionRate: 12.5,
    avgOrderValue: 169,
    churnRate: 2.3,
    monthlyRecurringRevenue: 18500
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'websites' | 'orders' | 'users'>('overview');
  const [websites, setWebsites] = useState<BirthdayWebsite[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setStats(getAdminStats());
    setWebsites(getWebsites());
    setOrders(getOrders());
  }, []);

  const sampleUsers = [
    INITIAL_USER,
    INITIAL_ADMIN,
    { id: 'u3', name: 'Riya Patel', email: 'riya@example.com', role: 'user', createdAt: '2026-08-02' },
    { id: 'u4', name: 'Kabir Singh', email: 'kabir@example.com', role: 'user', createdAt: '2026-08-04' }
  ];

  const filteredWebsites = websites.filter(w => 
    w.personName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-luxury border border-amber-500/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">Admin Operations Portal</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                Protected Access
              </span>
            </div>
            <p className="text-xs text-slate-400">Real-time revenue monitoring, user management, and SaaS system metrics.</p>
          </div>
        </div>

        <button
          onClick={() => {
            setStats(getAdminStats());
            setWebsites(getWebsites());
            setOrders(getOrders());
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-amber-400" /> Refresh Analytics
        </button>
      </div>

      {/* Admin Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="p-5 rounded-2xl glass-luxury space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-400">Total SaaS Revenue</span>
          <p className="text-3xl font-black text-emerald-400">₹{stats.totalRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">Today&apos;s Sales: ₹{stats.todaysSales}</span>
        </div>

        <div className="p-5 rounded-2xl glass-luxury space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-400">Total Registered Users</span>
          <p className="text-3xl font-black text-white">{stats.totalUsers}</p>
          <span className="text-[11px] text-purple-400 font-medium">Active Customer Base</span>
        </div>

        <div className="p-5 rounded-2xl glass-luxury space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-400">Birthday Websites</span>
          <p className="text-3xl font-black text-white">{stats.totalWebsites}</p>
          <span className="text-[11px] text-emerald-400 font-medium">{stats.activeWebsites} Active & Paid</span>
        </div>

        <div className="p-5 rounded-2xl glass-luxury space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-400">Total Page Views</span>
          <p className="text-3xl font-black text-cyan-400">{stats.totalViews.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">Global visitor traffic</span>
        </div>

      </div>

      {/* Business Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="p-5 rounded-2xl glass-luxury space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-400">Conversion Rate</span>
          <p className="text-3xl font-black text-rose-400">{stats.conversionRate}%</p>
          <span className="text-[11px] text-slate-500">Visitor to customer</span>
        </div>

        <div className="p-5 rounded-2xl glass-luxury space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-400">Avg Order Value</span>
          <p className="text-3xl font-black text-amber-400">₹{stats.avgOrderValue}</p>
          <span className="text-[11px] text-slate-500">Revenue per order</span>
        </div>

        <div className="p-5 rounded-2xl glass-luxury space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-400">Churn Rate</span>
          <p className="text-3xl font-black text-red-400">{stats.churnRate}%</p>
          <span className="text-[11px] text-slate-500">Monthly attrition</span>
        </div>

        <div className="p-5 rounded-2xl glass-luxury space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-400">MRR</span>
          <p className="text-3xl font-black text-purple-400">₹{stats.monthlyRecurringRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">Recurring revenue</span>
        </div>

      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
        >
          Overview & Sales
        </button>
        <button
          onClick={() => setActiveTab('websites')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'websites' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
        >
          All Websites ({websites.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
        >
          Payment Transactions ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
        >
          User Accounts
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-3xl glass-luxury space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-400" /> Recent Sales Activity
            </h3>
            <div className="space-y-3">
              {orders.slice(0, 3).map((ord) => (
                <div key={ord.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{ord.userName}</span>
                    <p className="text-[11px] text-slate-400">Purchased {ord.planName}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-400">₹{ord.amount}</span>
                    <p className="text-[10px] text-slate-500">{ord.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-luxury space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" /> Gateway & Razorpay Status
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>Webhook Health</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">100% Operational</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>Failed Payments</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">{stats.failedPayments} items</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>Refund Requests</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">0 Active</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: WEBSITES MANAGEMENT */}
      {activeTab === 'websites' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search website by person name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
            />
          </div>

          <div className="rounded-3xl glass-luxury overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Target Name</th>
                  <th className="p-4">Slug URL</th>
                  <th className="p-4">Template</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredWebsites.map((site) => (
                  <tr key={site.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-white">{site.personName}</td>
                    <td className="p-4 font-mono text-rose-400">/birthday/{site.slug}</td>
                    <td className="p-4 uppercase text-[10px] font-bold text-purple-300">{site.templateId}</td>
                    <td className="p-4 font-bold">{site.views || 0}</td>
                    <td className="p-4">
                      {site.paymentStatus === 'paid' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">PAID</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">DRAFT</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/birthday/${site.slug}`} className="text-xs text-rose-400 font-bold hover:underline">
                        View Page ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="rounded-3xl glass-luxury overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 font-bold uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Ref</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-mono font-bold text-white">{ord.id}</td>
                  <td className="p-4 font-semibold text-slate-200">{ord.userName} ({ord.userEmail})</td>
                  <td className="p-4 text-purple-300">{ord.planName}</td>
                  <td className="p-4 font-extrabold text-emerald-400">₹{ord.amount}</td>
                  <td className="p-4 font-mono text-xs text-slate-400">{ord.paymentId}</td>
                  <td className="p-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      SUCCESS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="rounded-3xl glass-luxury overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 font-bold uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">User ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sampleUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-mono text-slate-400">{u.id}</td>
                  <td className="p-4 font-bold text-white">{u.name}</td>
                  <td className="p-4 text-slate-300">{u.email}</td>
                  <td className="p-4">
                    {u.role === 'admin' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">ADMIN</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">USER</span>
                    )}
                  </td>
                  <td className="p-4 text-right text-slate-400">{u.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
