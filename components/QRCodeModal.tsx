'use client';

import { useState } from 'react';
import { X, Copy, Check, QrCode, Download, Share2 } from 'lucide-react';

interface QRCodeModalProps {
  slug: string;
  personName: string;
  onClose: () => void;
}

export default function QRCodeModal({ slug, personName, onClose }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/birthday/${slug}` 
    : `https://celebrationcraft.com/birthday/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`🎂 Hey! Check out this special birthday surprise website created for ${personName}: ${fullUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTelegram = () => {
    const text = encodeURIComponent(`🎂 Birthday Surprise Website for ${personName}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${text}`, '_blank');
  };

  const handleDownloadQR = () => {
    // Generate downloadable QR canvas image
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, 300, 300);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(20, 20, 260, 260);

      // Draw stylized simulated QR pattern
      ctx.fillStyle = '#0b0f19';
      // Corners
      ctx.fillRect(40, 40, 60, 60);
      ctx.fillRect(50, 50, 40, 40);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(60, 60, 20, 20);

      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(200, 40, 60, 60);
      ctx.fillRect(50, 50, 40, 40);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(220, 60, 20, 20);

      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(40, 200, 60, 60);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(60, 220, 20, 20);

      // Text at bottom
      ctx.fillStyle = '#8b5cf6';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Scan for ${personName}'s Birthday`, 150, 280);

      const link = document.createElement('a');
      link.download = `QR_${personName.replace(/\s+/g, '_')}_Birthday.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-white text-base">Share Birthday Surprise</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Canvas Frame */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 rounded-2xl bg-white shadow-xl flex flex-col items-center">
            {/* SVG Stylized QR */}
            <svg viewBox="0 0 200 200" className="w-48 h-48">
              <rect width="200" height="200" fill="#ffffff" />
              {/* Outer Position Detectors */}
              <rect x="15" y="15" width="45" height="45" fill="#0b0f19" />
              <rect x="23" y="23" width="29" height="29" fill="#ffffff" />
              <rect x="30" y="30" width="15" height="15" fill="#f43f5e" />

              <rect x="140" y="15" width="45" height="45" fill="#0b0f19" />
              <rect x="148" y="23" width="29" height="29" fill="#ffffff" />
              <rect x="155" y="30" width="15" height="15" fill="#f43f5e" />

              <rect x="15" y="140" width="45" height="45" fill="#0b0f19" />
              <rect x="23" y="148" width="29" height="29" fill="#ffffff" />
              <rect x="30" y="155" width="15" height="15" fill="#f43f5e" />

              {/* Data matrix dots simulation */}
              <rect x="75" y="20" width="12" height="12" fill="#0b0f19" />
              <rect x="95" y="35" width="12" height="12" fill="#8b5cf6" />
              <rect x="115" y="20" width="12" height="12" fill="#0b0f19" />
              <rect x="75" y="60" width="12" height="12" fill="#0b0f19" />
              <rect x="95" y="75" width="12" height="12" fill="#0b0f19" />

              <rect x="20" y="75" width="12" height="12" fill="#8b5cf6" />
              <rect x="40" y="95" width="12" height="12" fill="#0b0f19" />
              <rect x="20" y="115" width="12" height="12" fill="#0b0f19" />

              <rect x="140" y="75" width="12" height="12" fill="#0b0f19" />
              <rect x="160" y="95" width="12" height="12" fill="#8b5cf6" />

              <rect x="75" y="115" width="12" height="12" fill="#0b0f19" />
              <rect x="95" y="135" width="12" height="12" fill="#f43f5e" />
              <rect x="115" y="115" width="12" height="12" fill="#0b0f19" />
              <rect x="135" y="135" width="12" height="12" fill="#8b5cf6" />

              <rect x="75" y="155" width="12" height="12" fill="#0b0f19" />
              <rect x="95" y="170" width="12" height="12" fill="#0b0f19" />
              <rect x="115" y="155" width="12" height="12" fill="#0b0f19" />
              <rect x="140" y="155" width="12" height="12" fill="#8b5cf6" />
            </svg>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              Scan to Open {personName}&apos;s Page
            </span>
          </div>

          <button
            onClick={handleDownloadQR}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-rose-400" />
            Download QR Code Image
          </button>
        </div>

        {/* Copy Link Bar */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400">Shareable Unique Website URL</label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
            <input
              type="text"
              readOnly
              value={fullUrl}
              className="w-full bg-transparent px-2 text-xs font-mono text-slate-300 focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400">Direct Social Sharing</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleWhatsApp}
              className="py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              WhatsApp
            </button>

            <button
              onClick={handleTelegram}
              className="py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              Telegram
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
