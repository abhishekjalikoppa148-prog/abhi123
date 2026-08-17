'use client';

import { useState } from 'react';
import { 
  Share2, Copy, Check, X, MessageCircle, Facebook, 
  Twitter, Linkedin, Mail, Send, ExternalLink
} from 'lucide-react';
import { generateShareLinks, copyToClipboard, shareOnNative } from '@/lib/social-share';

interface SocialShareModalProps {
  slug: string;
  personName: string;
  onClose: () => void;
}

export default function SocialShareModal({ slug, personName, onClose }: SocialShareModalProps) {
  const [copied, setCopied] = useState(false);
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/birthday/${slug}`;
  
  const shareData = {
    url,
    title: `🎂 Happy Birthday ${personName}!`,
    description: `I created a special birthday website for ${personName}. Check it out! 🎉`
  };

  const shareLinks = generateShareLinks(shareData);

  const handleCopy = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    const success = await shareOnNative(shareData);
    if (success) {
      onClose();
    }
  };

  const shareButtons = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500',
      url: shareLinks.whatsapp,
      label: 'Share on WhatsApp'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      url: shareLinks.facebook,
      label: 'Share on Facebook'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500',
      url: shareLinks.twitter,
      label: 'Share on Twitter'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      url: shareLinks.linkedin,
      label: 'Share on LinkedIn'
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-blue-400',
      url: shareLinks.telegram,
      label: 'Share on Telegram'
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-slate-600',
      url: shareLinks.email,
      label: 'Share via Email'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl glass-luxury p-6 space-y-6 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white">Share Birthday Website</h3>
              <p className="text-xs text-slate-400">Send to friends & family</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* URL Display */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <p className="text-xs text-slate-400 font-medium">Website URL</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
            />
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && (
            <p className="text-xs text-emerald-400 font-medium">Link copied to clipboard!</p>
          )}
        </div>

        {/* Native Share Button */}
        {typeof navigator !== 'undefined' && navigator.share && typeof navigator.share === 'function' && (
          <button
            onClick={handleNativeShare}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:from-rose-600 hover:to-purple-700 transition-all"
          >
            <Share2 className="w-5 h-5" /> Share via Device Menu
          </button>
        )}

        {/* Social Platforms */}
        <div>
          <p className="text-xs text-slate-400 font-medium mb-3">Share on social platforms</p>
          <div className="grid grid-cols-3 gap-3">
            {shareButtons.map((platform) => {
              const Icon = platform.icon;
              return (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-xl ${platform.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium">{platform.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Open in New Tab */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <ExternalLink className="w-5 h-5" /> Open in New Tab
        </a>

      </div>
    </div>
  );
}
