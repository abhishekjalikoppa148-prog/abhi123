'use client';

import { useState, useEffect, useCallback } from 'react';
import { Gift, ExternalLink, Sparkles } from 'lucide-react';

interface GiftLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

interface GiftRegistryProps {
  websiteId: string;
  personName: string;
  accent?: string;
  /** Pre-loaded gift links from the website object */
  initialLinks?: { title: string; url: string; icon?: string }[];
}

export default function GiftRegistry({ websiteId, personName, accent = '#f43f5e', initialLinks = [] }: GiftRegistryProps) {
  const [links, setLinks] = useState<GiftLink[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch(`/api/gift-registry?websiteId=${websiteId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.links && data.links.length > 0) {
          setLinks(data.links);
          return;
        }
      }
    } catch {
      // silent
    }
    // Fall back to initialLinks if API has nothing
    setLinks(initialLinks.map((l, i) => ({ id: `init-${i}`, ...l })));
    setLoading(false);
  }, [websiteId, initialLinks]);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  const defaultIcons: Record<string, string> = {
    amazon: '📦',
    flipkart: '🛒',
    myntra: '👗',
    gofundme: '🌱',
    paypal: '💳',
    upi: '📱',
    default: '🎁',
  };

  const getIcon = (link: GiftLink) => {
    if (link.icon) return link.icon;
    const host = link.url.toLowerCase();
    for (const [key, icon] of Object.entries(defaultIcons)) {
      if (host.includes(key)) return icon;
    }
    return defaultIcons.default;
  };

  if (loading) return null;
  if (links.length === 0) return null;

  return (
    <section className="max-w-2xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-amber-300">
          <Gift className="w-5 h-5" />
          <h3 className="text-2xl font-black text-white">Gift Registry</h3>
          <Sparkles className="w-4 h-4 animate-spin" />
        </div>
        <p className="text-slate-300 text-sm">
          Help celebrate {personName} with a thoughtful gift 🎁
        </p>
      </div>

      {/* Gift Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map(link => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all shadow-sm hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-inner"
              style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}
            >
              {getIcon(link)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight group-hover:text-rose-200 transition-colors">
                {link.title}
              </p>
              <p className="text-slate-400 text-xs mt-0.5 truncate">{new URL(link.url).hostname.replace('www.', '')}</p>
            </div>
            <ExternalLink
              className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        ))}
      </div>

      <p className="text-center text-xs text-slate-500">
        Gifts are a way to show love — but your presence is the best present! 💖
      </p>
    </section>
  );
}
