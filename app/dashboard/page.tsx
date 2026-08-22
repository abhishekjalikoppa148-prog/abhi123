'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, Eye, Edit3, Share2, Copy, QrCode, Trash2, Globe, Sparkles, CheckCircle2, 
  Gift, Rocket
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getDaysUntil, isExpired, formatDate } from '@/lib/utils';
import { BirthdayWebsite } from '@/lib/types';
import { TEMPLATES } from '@/lib/sample-data';
import QRCodeModal from '@/components/QRCodeModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<BirthdayWebsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalSite, setQrModalSite] = useState<BirthdayWebsite | null>(null);

  useEffect(() => {
    fetchWebsites();
  }, [user]);

  const fetchWebsites = async () => {
    try {
      const res = await fetch('/api/websites');
      if (res.ok) {
        const data = await res.json();
        setWebsites(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch websites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this birthday website?')) {
      try {
        const res = await fetch(`/api/websites/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setWebsites(prev => prev.filter(w => w.id !== id));
        }
      } catch (err) {
        console.error('Failed to delete website:', err);
      }
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl shadow-lg border" style={{
        background: 'linear-gradient(to right, var(--accent-primary), var(--accent-cta))',
        borderColor: 'var(--border-subtle)'
      }}>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md border text-xs font-semibold" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: '#FFFFFF'
          }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#FFFFFF' }} />
            <span>Dashboard Portal</span>
          </div>
          <h1 className="font-cormorant text-2xl sm:text-4xl font-bold" style={{ color: '#FFFFFF' }}>
            Welcome back, {user ? user.name : 'Abhishek'} 👋
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Manage your personalized birthday websites, view visitor analytics, and create new surprises.
          </p>
        </div>

        <div>
          <Link
            href="/builder"
            className="px-6 py-3.5 rounded-2xl font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-heading)'
            }}
          >
            <Plus className="w-5 h-5" />
            <span>Create Birthday Website Free</span>
          </Link>
        </div>
      </div>

      {/* Enhanced Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1 - Total Websites */}
        <div className="p-5 sm:p-6 rounded-2xl shadow-sm space-y-2 card-3d group border" style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Total Websites</span>
            <div className="p-2 rounded-xl transition-all" style={{
              backgroundColor: 'var(--accent-primary)/20',
              color: 'var(--accent-primary)'
            }}>
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text-heading)' }}>{totalWebsites}</p>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Surprises created</p>
        </div>

        {/* Card 2 - Published Websites */}
        <div className="p-5 sm:p-6 rounded-2xl shadow-sm space-y-2 card-3d group border" style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Published</span>
            <div className="p-2 rounded-xl transition-all" style={{
              backgroundColor: 'var(--accent-primary)/20',
              color: 'var(--accent-primary)'
            }}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text-heading)' }}>{publishedWebsites}</p>
          <p className="text-[11px] font-medium" style={{ color: 'var(--accent-primary)' }}>Live & active</p>
        </div>

        {/* Card 3 - Draft Websites */}
        <div className="p-5 sm:p-6 rounded-2xl shadow-sm space-y-2 card-3d group border" style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Drafts</span>
            <div className="p-2 rounded-xl transition-all" style={{
              backgroundColor: 'var(--accent-primary)/20',
              color: 'var(--accent-primary)'
            }}>
              <Edit3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text-heading)' }}>{draftWebsites}</p>
          <p className="text-[11px] font-medium" style={{ color: 'var(--accent-primary)' }}>Awaiting payment</p>
        </div>

        {/* Card 4 - Total Views */}
        <div className="p-5 sm:p-6 rounded-2xl shadow-sm space-y-2 card-3d group border" style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Total Views</span>
            <div className="p-2 rounded-xl transition-all" style={{
              backgroundColor: 'var(--accent-primary)/20',
              color: 'var(--accent-primary)'
            }}>
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text-heading)' }}>{totalViews}</p>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Visitor interactions</p>
        </div>

      </div>

      {/* Getting Started Checklist for New Users */}
      {totalWebsites === 0 && (
        <div className="p-6 rounded-3xl shadow-sm space-y-4 border" style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{
              backgroundColor: 'var(--accent-primary)/20',
              color: 'var(--accent-primary)'
            }}>
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>Getting Started</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Complete these steps to create your first birthday website</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--text-heading)' }}>Create account</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--text-heading)' }}>Add birthday details</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--text-heading)' }}>Upload memories</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-subtle)'
            }}>
              <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: 'var(--text-muted)' }} />
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Choose template</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-subtle)'
            }}>
              <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: 'var(--text-muted)' }} />
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Publish website</span>
            </div>
          </div>

          <Link
            href="/onboarding"
            className="block text-center py-3 rounded-xl font-bold text-sm transition-all"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#FFFFFF'
            }}
          >
            Start Creating Your Birthday Website
          </Link>
        </div>
      )}

      {/* Expiration Warning */}
      {expiringSoon > 0 && (
        <div className="p-4 rounded-2xl flex items-center gap-3 border" style={{
          backgroundColor: 'var(--accent-premium)/10',
          borderColor: 'var(--accent-premium)/30'
        }}>
          <div className="p-2 rounded-xl" style={{
            backgroundColor: 'var(--accent-premium)/20',
            color: 'var(--accent-premium)'
          }}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--accent-premium)' }}>{expiringSoon} website{expiringSoon > 1 ? 's' : ''} expiring soon</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Consider renewing to maintain access</p>
          </div>
        </div>
      )}

      {/* Main Section: My Birthday Websites */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <h2 className="font-cormorant text-xl font-bold" style={{ color: 'var(--text-heading)' }}>My Birthday Websites</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>List of all personalized birthday pages created in your account.</p>
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{websites.length} items</span>
        </div>

        {loading ? (
          <div className="p-12 text-center rounded-3xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-subtle)'
          }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading your websites...</p>
          </div>
        ) : websites.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-subtle)'
          }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--accent-primary)'
            }}>
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>No birthday websites created yet</h3>
            <p className="text-xs max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
              Start by creating your first surprise birthday website with music, photos, AI wishes, and candle blowing!
            </p>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF'
              }}
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
                  className="rounded-3xl overflow-hidden transition-all space-y-4 p-5 flex flex-col justify-between card-3d border"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  
                  {/* Card Top */}
                  <div className="space-y-3">
                    
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-lg" style={{ color: 'var(--text-heading)' }}>{site.personName}</h3>
                          {site.personNickname && (
                            <span className="text-xs font-semibold" style={{ color: 'var(--accent-cta)' }}>({site.personNickname})</span>
                          )}
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          Birthday: <strong style={{ color: 'var(--text-secondary)' }}>{site.birthdayDate}</strong> • {site.relationship}
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${
                        site.paymentStatus === 'paid' 
                          ? '' 
                          : ''
                      }`} style={{
                        backgroundColor: site.paymentStatus === 'paid' ? 'var(--accent-primary)/20' : 'var(--accent-premium)/20',
                        color: site.paymentStatus === 'paid' ? 'var(--accent-primary)' : 'var(--accent-premium)',
                        borderColor: site.paymentStatus === 'paid' ? 'var(--accent-primary)/40' : 'var(--accent-premium)/40'
                      }}>
                        {site.paymentStatus === 'paid' ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {/* Preview Strip */}
                    <div className="relative h-28 w-full rounded-2xl overflow-hidden flex items-center justify-center" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-subtle)'
                    }}>
                      <Image
                        src={tplDef.previewImage}
                        alt={tplDef.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover opacity-40"
                      />
                      <div className="relative z-10 text-center space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-heading)' }}>{tplDef.name}</span>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>/birthday/{site.slug}</p>
                      </div>
                    </div>

                    {/* Meta stats */}
                    <div className="flex items-center justify-between text-xs pt-1" style={{ color: 'var(--text-muted)' }}>
                      <span>Views: <strong style={{ color: 'var(--text-heading)' }}>{site.views || 0}</strong></span>
                      <span>Expires: <strong className={`${isExpired(site.expiresAt) ? '' : ''} font-bold`} style={{
                        color: isExpired(site.expiresAt) ? 'var(--accent-cta)' : 'var(--accent-primary)'
                      }}>
                        {isExpired(site.expiresAt) ? 'Expired' : formatDate(site.expiresAt)}
                      </strong></span>
                    </div>

                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-3 grid grid-cols-3 gap-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    
                    {/* View */}
                    <Link
                      href={`/birthday/${site.slug}`}
                      className="magnetic-btn py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border cursor-pointer"
                      style={{
                        backgroundColor: 'var(--accent-cta)/10',
                        color: 'var(--accent-cta)',
                        borderColor: 'var(--accent-cta)/30'
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>

                    {/* Edit */}
                    <Link
                      href={`/builder?id=${site.id}`}
                      className="magnetic-btn py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-heading)'
                      }}
                    >
                      <Edit3 className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> Edit
                    </Link>

                    {/* Publish (if draft) */}
                    {site.paymentStatus === 'unpaid' && (
                      <Link
                        href={`/pricing?websiteId=${site.id}`}
                        className="magnetic-btn py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                        style={{
                          background: 'linear-gradient(to right, var(--accent-premium), var(--accent-cta))',
                          color: 'var(--bg-card)'
                        }}
                      >
                        <Rocket className="w-3.5 h-3.5" /> Publish
                      </Link>
                    )}

                    {/* QR Code */}
                    <button
                      onClick={() => setQrModalSite(site)}
                      className="magnetic-btn py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-heading)'
                      }}
                    >
                      <QrCode className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> QR
                    </button>

                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopyLink(site.slug, site.id)}
                      className="magnetic-btn py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-heading)'
                      }}
                    >
                      <Copy className="w-3.5 h-3.5" style={{ color: 'var(--accent-premium)' }} /> 
                      {copiedId === site.id ? 'Copied!' : 'Copy'}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(site.id)}
                      className="magnetic-btn py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border cursor-pointer"
                      style={{
                        backgroundColor: 'var(--accent-cta)/10',
                        color: 'var(--accent-cta)',
                        borderColor: 'var(--accent-cta)/30'
                      }}
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
