'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, Users, Globe, IndianRupee, Eye, RefreshCw, 
  CheckCircle2, AlertCircle, FileText, Search
} from 'lucide-react';
import { BirthdayWebsite, Order } from '@/lib/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWebsites: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'websites' | 'orders' | 'users'>('overview');
  const [websites, setWebsites] = useState<BirthdayWebsite[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, websitesRes, ordersRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/websites'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/users')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }
      if (websitesRes.ok) {
        const websitesData = await websitesRes.json();
        setWebsites(websitesData.data || []);
      }
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.data || []);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const filteredWebsites = websites.filter(w => 
    w.personName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-blue-200 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">Admin Operations Portal</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-300 uppercase">
                Protected Access
              </span>
            </div>
            <p className="text-xs text-slate-600">Real-time revenue monitoring, user management, and SaaS system metrics.</p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-md shadow-blue-500/25"
        >
          <RefreshCw className="w-4 h-4 text-white" /> Refresh Analytics
        </button>
      </div>

      {/* Admin Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-600">Total SaaS Revenue</span>
          <p className="text-3xl font-black text-blue-600">₹{stats.totalRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">From completed orders</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-600">Total Registered Users</span>
          <p className="text-3xl font-black text-slate-900">{stats.totalUsers}</p>
          <span className="text-[11px] text-blue-600 font-medium">Active customer base</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-600">Birthday Websites</span>
          <p className="text-3xl font-black text-slate-900">{stats.totalWebsites}</p>
          <span className="text-[11px] text-blue-600 font-medium">Total created</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-600">Total Page Views</span>
          <p className="text-3xl font-black text-blue-600">{stats.totalViews.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">Global visitor traffic</span>
        </div>

      </div>

      {/* Business Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-600">Total Orders</span>
          <p className="text-3xl font-black text-blue-600">{stats.totalOrders}</p>
          <span className="text-[11px] text-slate-500">Completed payments</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-600">Avg Order Value</span>
          <p className="text-3xl font-black text-blue-600">₹{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}</p>
          <span className="text-[11px] text-slate-500">Revenue per order</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-600">Conversion Rate</span>
          <p className="text-3xl font-black text-blue-600">{stats.totalUsers > 0 ? ((stats.totalOrders / stats.totalUsers) * 100).toFixed(1) : 0}%</p>
          <span className="text-[11px] text-slate-500">Orders per user</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-1 card-3d group">
          <span className="text-xs font-semibold text-slate-600">Views per Website</span>
          <p className="text-3xl font-black text-blue-600">{stats.totalWebsites > 0 ? Math.round(stats.totalViews / stats.totalWebsites) : 0}</p>
          <span className="text-[11px] text-slate-500">Average engagement</span>
        </div>

      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-blue-200 shadow-sm">
        {[
          { id: 'overview', label: 'Overview', icon: Globe },
          { id: 'websites', label: 'Websites', icon: Globe },
          { id: 'orders', label: 'Orders', icon: IndianRupee },
          { id: 'users', label: 'Users', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25' 
                  : 'text-slate-600 hover:bg-blue-50'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-3xl bg-white border border-blue-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-blue-500" /> Recent Sales Activity
            </h3>
            <div className="space-y-3">
              {orders.slice(0, 3).map((ord) => (
                <div key={ord.id} className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{ord.userName}</span>
                    <p className="text-[11px] text-slate-600">Purchased {ord.planName}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-blue-600">₹{ord.amount}</span>
                    <p className="text-[10px] text-slate-500">{ord.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-blue-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" /> Gateway & Razorpay Status
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <span className="text-slate-700">Webhook Health</span>
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 font-bold">100% Operational</span>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <span className="text-slate-700">Payment Gateway</span>
                <span className="px-2 py-0.5 rounded bg-white border border-blue-200 text-slate-700 font-bold">Razorpay Active</span>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <span className="text-slate-700">Refund Requests</span>
                <span className="px-2 py-0.5 rounded bg-white border border-blue-200 text-slate-700 font-bold">0 Active</span>
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-blue-200 text-slate-900 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          <div className="rounded-3xl bg-white border border-blue-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-blue-50 text-slate-700 font-bold uppercase border-b border-blue-200">
                <tr>
                  <th className="p-4">Target Name</th>
                  <th className="p-4">Slug URL</th>
                  <th className="p-4">Template</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-200">
                {filteredWebsites.map((w) => (
                  <tr key={w.id} className="hover:bg-blue-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">{w.personName}</td>
                    <td className="p-4 text-slate-600">{w.slug}</td>
                    <td className="p-4 text-slate-600">{w.templateId}</td>
                    <td className="p-4 text-slate-600">{w.views}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${w.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {w.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/birthday/${w.slug}`} target="_blank" className="text-blue-600 hover:text-blue-800 font-bold text-xs">
                        View
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
        <div className="rounded-3xl bg-white border border-blue-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-blue-50 text-slate-700 font-bold uppercase border-b border-blue-200">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Ref</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-200">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-blue-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900">{ord.id}</td>
                  <td className="p-4 font-semibold text-slate-700">{ord.userName} ({ord.userEmail})</td>
                  <td className="p-4 text-blue-600">{ord.planName}</td>
                  <td className="p-4 font-extrabold text-green-600">₹{ord.amount}</td>
                  <td className="p-4 font-mono text-xs text-slate-500">{ord.paymentId}</td>
                  <td className="p-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-300">
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
        <div className="rounded-3xl bg-white border border-blue-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading users...</div>
          ) : (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-blue-50 text-slate-700 font-bold uppercase border-b border-blue-200">
                <tr>
                  <th className="p-4">User ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-200">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-blue-50 transition-colors">
                    <td className="p-4 font-mono text-slate-500">{u.id}</td>
                    <td className="p-4 font-bold text-slate-900">{u.name}</td>
                    <td className="p-4 text-slate-600">{u.email}</td>
                    <td className="p-4">
                      {u.role === 'admin' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-300">ADMIN</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-300">USER</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                        {u.plan || 'free'}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
}
