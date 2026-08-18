'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, Heart, Sparkles, Smile } from 'lucide-react';

interface GuestbookEntry {
  id: string;
  authorName: string;
  relationship?: string;
  message: string;
  sticker?: string;
  likes: number;
  createdAt: string;
}

interface GuestbookProps {
  websiteId: string;
  personName: string;
  accent?: string;
}

const STICKERS = ['🎉', '🎂', '🎈', '🥳', '❤️', '⭐', '🎁', '🥂', '🌟', '💖', '🎊', '🍰'];
const RELATIONSHIPS = ['Friend', 'Best Friend', 'Family', 'Colleague', 'Partner', 'Cousin', 'Neighbor', 'Classmate', 'Other'];

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Guestbook({ websiteId, personName, accent = '#f43f5e' }: GuestbookProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [authorName, setAuthorName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [message, setMessage] = useState('');
  const [sticker, setSticker] = useState('🎉');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch(`/api/guestbook?websiteId=${websiteId}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [websiteId]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId, authorName: authorName.trim(), relationship, message: message.trim(), sticker }),
      });
      if (res.ok) {
        const data = await res.json();
        setEntries(prev => [data.entry, ...prev]);
        setAuthorName('');
        setMessage('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    // Optimistic update
    setEntries(prev => prev.map(e => e.id === id ? { ...e, likes: e.likes + 1 } : e));
    try {
      await fetch('/api/guestbook/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: id }),
      });
    } catch {
      // silent — optimistic update stays
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-amber-300">
          <MessageSquare className="w-5 h-5" />
          <h3 className="text-2xl font-black text-white">Birthday Guestbook</h3>
          <Sparkles className="w-4 h-4 animate-spin" />
        </div>
        <p className="text-xs text-slate-300">Leave {personName} a heartfelt message 💌</p>
      </div>

      {/* Submit Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Name</label>
            <input
              id="guestbook-name"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="E.g. Priya Sharma"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ ['--tw-ring-color' as string]: accent }}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Relationship</label>
            <select
              id="guestbook-relationship"
              value={relationship}
              onChange={e => setRelationship(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/20 text-white text-sm focus:outline-none focus:ring-2"
            >
              {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Message</label>
          <textarea
            id="guestbook-message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={`Write something heartfelt for ${personName}...`}
            required
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 resize-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Smile className="w-3.5 h-3.5" /> Pick a Sticker
          </div>
          <div className="flex flex-wrap gap-2">
            {STICKERS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSticker(s)}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all border-2 ${
                  sticker === s ? 'border-rose-400 bg-white/20 scale-110' : 'border-transparent bg-white/5 hover:bg-white/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {submitted && (
            <span className="text-emerald-400 text-sm font-bold animate-bounce">🎉 Message posted!</span>
          )}
          <button
            id="guestbook-submit-btn"
            type="submit"
            disabled={submitting || !authorName.trim() || !message.trim()}
            className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-bold shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            style={{ background: `linear-gradient(135deg, ${accent}, #a855f7)` }}
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Sending...' : 'Post Message'}
          </button>
        </div>
      </form>

      {/* Entries */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-slate-400 text-sm animate-pulse">Loading messages...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            <p className="text-2xl mb-2">💌</p>
            <p>Be the first to leave a birthday message!</p>
          </div>
        ) : (
          entries.map(entry => (
            <div
              key={entry.id}
              className="p-5 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/15 space-y-3 hover:bg-white/12 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-black text-white shadow-lg shrink-0"
                    style={{ background: `linear-gradient(135deg, ${accent}aa, #a855f7aa)` }}
                  >
                    {entry.sticker || entry.authorName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">{entry.authorName}</p>
                    {entry.relationship && (
                      <p className="text-xs text-slate-400">{entry.relationship}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-500 shrink-0">{timeAgo(entry.createdAt)}</span>
              </div>

              <p className="text-slate-200 text-sm leading-relaxed pl-13">{entry.message}</p>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => handleLike(entry.id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all active:scale-95"
                >
                  <Heart className="w-3.5 h-3.5" />
                  {entry.likes}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
