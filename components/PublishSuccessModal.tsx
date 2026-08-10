'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Copy, Eye, Edit, Share2, X, Download, QrCode, MessageCircle, ExternalLink } from 'lucide-react';
import { copyToClipboard } from '@/lib/social-share';

interface PublishSuccessModalProps {
  slug: string;
  personName: string;
  onClose: () => void;
}

export default function PublishSuccessModal({ slug, personName, onClose }: PublishSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/birthday/${slug}`;

  const handleCopy = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappMessage = `🎂 I made a special birthday surprise for ${personName}!\n\nOpen it here:\n${url}\n\n❤️ Enjoy!`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl glass-luxury p-8 space-y-6 animate-in fade-in zoom-in duration-300">
        
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">🎉 Your Birthday Website Is Ready!</h2>
          <p className="text-slate-400 text-sm">Your birthday website has been published and is ready to share.</p>
        </div>

        {/* Website Preview Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="aspect-video rounded-xl bg-gradient-to-br from-rose-500/20 to-purple-600/20 flex items-center justify-center text-4xl">
            🎂
          </div>
          <div className="space-y-2">
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
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-emerald-400 font-medium">Link copied to clipboard!</p>
            )}
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white">Share your birthday website:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="p-3 rounded-xl glass-luxury hover:bg-white/10 text-slate-200 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Copy className="w-4 h-4" /> Copy Link
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <button className="p-3 rounded-xl glass-luxury hover:bg-white/10 text-slate-200 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> Download QR
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl glass-luxury hover:bg-white/10 text-slate-200 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" /> View Website
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-800">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl glass-luxury text-slate-200 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Edit className="w-4 h-4" /> Edit Website
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" /> Open Website
          </a>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
