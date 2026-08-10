'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, Eye, Edit3, Share2, Copy, QrCode, Trash2, Globe, Sparkles, CheckCircle2, 
  Gift
} from 'lucide-react';
import { getCurrentUser, getWebsites, deleteWebsite } from '@/lib/store';
import { getDaysUntil, isExpired, formatDate } from '@/lib/utils';
import { BirthdayWebsite, User } from '@/lib/types';
import { TEMPLATES } from '@/lib/sample-data';
import QRCodeModal from '@/components/QRCodeModal';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [websites, setWebsites] = useState<BirthdayWebsite[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalSite, setQrModalSite] = useState<BirthdayWebsite | null>(null);

  useEffect(() => {
    const currUser = getCurrentUser();
    setUser(currUser);
    if (currUser) {
      setWebsites(getWebsites(currUser.id));
    } else {
      setWebsites(getWebsites());
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this birthday website?')) {
      deleteWebsite(id);
      setWebsites(prev => prev.filter(w => w.id !== id));
    }
  };

  const handleCopyLink = (slug: string, id: string) => {
    const url = `${window.location.origin}/birthday/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Enhanced Metrics
  const totalWebsites = websites.length;
  const publishedWebsites = websites.filter(w => w.paymentStatus === 'paid').length;
  const draftWebsites = websites.filter(w => w.paymentStatus === 'unpaid').length;
  const totalViews = websites.reduce((sum, w) => sum + (w.views || 0), 0);
  const expiringSoon = websites.filter(w => {
    const daysLeft = getDaysUntil(w.expiresAt);
    return daysLeft > 0 && daysLeft <= 7;
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/60 border border-slate-800 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Dashboard Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Welcome back, {user ? user.name : 'Aarav'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your personalized birthday websites, view visitor analytics, and create new surprises.
          </p>
        </div>

        <div>
          <Link
            href="/builder"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Create Birthday Website Free</span>
          </Link>
        </div>
      </div>

      {/* Enhanced Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1 - Total Websites */}
        <div className="p-5 sm:p-6 rounded-2xl glass-luxury space-y-2 card-3d group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Websites</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:neon-purple transition-all">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{totalWebsites}</p>
          <p className="text-[11px] text-slate-500">Surprises created</p>
        </div>

        {/* Card 2 - Published Websites */}
        <div className="p-5 sm:p-6 rounded-2xl glass-luxury space-y-2 card-3d group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Published</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{publishedWebsites}</p>
          <p className="text-[11px] text-emerald-400 font-medium">Live & active</p>
        </div>

        {/* Card 3 - Draft Websites */}
        <div className="p-5 sm:p-6 rounded-2xl glass-luxury space-y-2 card-3d group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Drafts</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all">
              <Edit3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{draftWebsites}</p>
          <p className="text-[11px] text-amber-400 font-medium">Awaiting payment</p>
        </div>

        {/* Card 4 - Total Views */}
        <div className="p-5 sm:p-6 rounded-2xl glass-luxury space-y-2 card-3d group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Views</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{totalViews}</p>
          <p className="text-[11px] text-slate-500">Visitor interactions</p>
        </div>

      </div>

      {/* Getting Started Checklist for New Users */}
      {totalWebsites === 0 && (
        <div className="p-6 rounded-3xl glass-luxury space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Getting Started</h3>
              <p className="text-xs text-slate-400">Complete these steps to create your first birthday website</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-slate-300">Create account</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-slate-300">Add birthday details</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-slate-300">Upload memories</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-dashed border-slate-700">
              <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
              <span className="text-sm text-slate-400">Choose template</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-dashed border-slate-700">
              <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
              <span className="text-sm text-slate-400">Publish website</span>
            </div>
          </div>

          <Link
            href="/onboarding"
            className="block text-center py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-sm hover:from-rose-600 hover:to-purple-700 transition-all"
          >
            Start Creating Your Birthday Website
          </Link>
        </div>
      )}

      {/* Expiration Warning */}
      {expiringSoon > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-300">{expiringSoon} website{expiringSoon > 1 ? 's' : ''} expiring soon</p>
            <p className="text-xs text-amber-400/70">Consider renewing to maintain access</p>
          </div>
        </div>
      )}

      {/* Main Section: My Birthday Websites */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">My Birthday Websites</h2>
            <p className="text-xs text-slate-400">List of all personalized birthday pages created in your account.</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">{websites.length} items</span>
        </div>

        {websites.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No birthday websites created yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start by creating your first surprise birthday website with music, photos, AI wishes, and candle blowing!
            </p>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs"
            >
              <Plus className="w-4 h-4" /> Create Birthday Website Free
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {websites.map((site) => {
              const tplDef = TEMPLATES.find(t => t.id === site.templateId) || TEMPLATES[0];

              return (
                <div
                  key={site.id}
                  className="rounded-3xl glass-luxury overflow-hidden hover:border-rose-500/40 transition-all space-y-4 p-5 flex flex-col justify-between card-3d"
                >
                  
                  {/* Card Top */}
                  <div className="space-y-3">
                    
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-white text-lg">{site.personName}</h3>
                          {site.personNickname && (
                            <span className="text-xs text-rose-400 font-semibold">({site.personNickname})</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          Birthday: <strong className="text-slate-200">{site.birthdayDate}</strong> • {site.relationship}
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${
                        site.paymentStatus === 'paid' 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {site.paymentStatus === 'paid' ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {/* Preview Strip */}
                    <div className="relative h-28 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                      <Image
                        src={tplDef.previewImage}
                        alt={tplDef.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover opacity-40"
                      />
                      <div className="relative z-10 text-center space-y-1">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{tplDef.name}</span>
                        <p className="text-[10px] text-slate-300 font-mono">/birthday/{site.slug}</p>
                      </div>
                    </div>

                    {/* Meta stats */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Views: <strong className="text-white">{site.views || 0}</strong></span>
                      <span>Expires: <strong className={`${isExpired(site.expiresAt) ? 'text-rose-400' : 'text-emerald-400'} font-bold`}>
                        {isExpired(site.expiresAt) ? 'Expired' : formatDate(site.expiresAt)}
                      </strong></span>
                    </div>

                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2">
                    
                    {/* View */}
                    <Link
                      href={`/birthday/${site.slug}`}
                      className="magnetic-btn py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-rose-500/30"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>

                    {/* Edit */}
                    <Link
                      href={`/builder?id=${site.id}`}
                      className="magnetic-btn py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" /> Edit
                    </Link>

                    {/* Publish (if draft) */}
                    {site.paymentStatus === 'unpaid' && (
                      <Link
                        href={`/pricing?websiteId=${site.id}`}
                        className="magnetic-btn py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-105"
                      >
                        <Rocket className="w-3.5 h-3.5" /> Publish
                      </Link>
                    )}

                    {/* QR Code */}
                    <button
                      onClick={() => setQrModalSite(site)}
                      className="magnetic-btn py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-cyan-400" /> QR
                    </button>

                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopyLink(site.slug, site.id)}
                      className="magnetic-btn py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-amber-400" /> 
                      {copiedId === site.id ? 'Copied!' : 'Copy'}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(site.id)}
                      className="magnetic-btn py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-rose-900/40 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Code Modal Drawer */}
      {qrModalSite && (
        <QRCodeModal
          slug={qrModalSite.slug}
          personName={qrModalSite.personName}
          onClose={() => setQrModalSite(null)}
        />
      )}

    </div>
  );
}
