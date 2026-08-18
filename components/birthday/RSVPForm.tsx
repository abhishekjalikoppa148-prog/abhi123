'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Users, Check, X, HelpCircle, Utensils, Send, Sparkles } from 'lucide-react';

interface RsvpEntry {
  id: string;
  guestName: string;
  email?: string;
  status: 'attending' | 'declined' | 'maybe';
  partySize: number;
  dietaryRestrictions?: string;
  wishesNote?: string;
  createdAt: string;
}

interface RSVPStats {
  attending: number;
  declined: number;
  maybe: number;
  totalGuests: number;
}

interface RSVPFormProps {
  websiteId: string;
  personName: string;
  eventDate: string;
  venueName?: string;
  venueAddress?: string;
  accent?: string;
}

const STATUS_OPTIONS = [
  { value: 'attending' as const, label: "I'll be there! 🎉", icon: Check, color: 'emerald' },
  { value: 'maybe' as const, label: "Maybe... 🤔", icon: HelpCircle, color: 'amber' },
  { value: 'declined' as const, label: "Can't make it 😔", icon: X, color: 'rose' },
];

export default function RSVPForm({ websiteId, personName, eventDate, venueName, venueAddress, accent = '#f43f5e' }: RSVPFormProps) {
  const [entries, setEntries] = useState<RsvpEntry[]>([]);
  const [stats, setStats] = useState<RSVPStats>({ attending: 0, declined: 0, maybe: 0, totalGuests: 0 });
  const [loading, setLoading] = useState(true);

  // Form state
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'attending' | 'declined' | 'maybe'>('attending');
  const [partySize, setPartySize] = useState(1);
  const [dietary, setDietary] = useState('');
  const [wishNote, setWishNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchRsvps = useCallback(async () => {
    try {
      const res = await fetch(`/api/rsvp?websiteId=${websiteId}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
        // Compute stats
        const list: RsvpEntry[] = data.entries || [];
        const attending = list.filter(e => e.status === 'attending').length;
        const declined = list.filter(e => e.status === 'declined').length;
        const maybe = list.filter(e => e.status === 'maybe').length;
        const totalGuests = list.filter(e => e.status === 'attending').reduce((s, e) => s + e.partySize, 0);
        setStats({ attending, declined, maybe, totalGuests });
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [websiteId]);

  useEffect(() => { fetchRsvps(); }, [fetchRsvps]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          guestName: guestName.trim(),
          email: email.trim() || undefined,
          status,
          partySize,
          dietaryRestrictions: dietary.trim() || undefined,
          wishesNote: wishNote.trim() || undefined,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        fetchRsvps(); // refresh stats
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  const statusColorMap = { attending: 'emerald', declined: 'rose', maybe: 'amber' };
  const statusIcon = { attending: '✅', declined: '❌', maybe: '🤔' };

  return (
    <section className="max-w-3xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-amber-300">
          <Calendar className="w-5 h-5" />
          <h3 className="text-2xl font-black text-white">RSVP to the Party</h3>
          <Sparkles className="w-4 h-4 animate-spin" />
        </div>
        {(venueName || eventDate) && (
          <p className="text-slate-300 text-sm">
            {venueName && <span>{venueName} · </span>}
            {eventDate && <span>{new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>}
          </p>
        )}
      </div>

      {/* Stats Row */}
      {!loading && entries.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Attending', value: stats.attending, emoji: '🎉', color: '#10b981' },
            { label: 'Maybe', value: stats.maybe, emoji: '🤔', color: '#f59e0b' },
            { label: 'Declined', value: stats.declined, emoji: '😔', color: '#f43f5e' },
          ].map(({ label, value, emoji, color }) => (
            <div key={label} className="p-4 rounded-2xl bg-white/10 border border-white/20 text-center">
              <p className="text-2xl">{emoji}</p>
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs text-slate-300 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}
      {!loading && stats.totalGuests > 0 && (
        <div className="text-center text-sm text-slate-300 -mt-2">
          <Users className="inline w-4 h-4 mr-1 text-emerald-400" />
          <span className="font-bold text-emerald-400">{stats.totalGuests}</span> guests confirmed attending
        </div>
      )}

      {/* Form */}
      {submitted ? (
        <div className="p-8 rounded-3xl bg-emerald-500/20 border border-emerald-400/30 text-center space-y-3">
          <p className="text-4xl">🎉</p>
          <p className="text-xl font-black text-white">RSVP Submitted!</p>
          <p className="text-emerald-300 text-sm">
            {status === 'attending' ? `Can't wait to see you at ${personName}'s birthday!` :
             status === 'maybe' ? `We hope you can make it! ${personName} would love to see you.` :
             `We'll miss you! ${personName} sends virtual birthday love your way.`}
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5"
        >
          {/* Status selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Will you attend?</label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-1 ${
                    status === opt.value
                      ? 'border-current bg-white/20 shadow-lg scale-105'
                      : 'border-white/20 bg-white/5 hover:bg-white/10 text-slate-300'
                  } ${opt.value === 'attending' && status === 'attending' ? 'text-emerald-400' :
                     opt.value === 'maybe' && status === 'maybe' ? 'text-amber-400' :
                     opt.value === 'declined' && status === 'declined' ? 'text-rose-400' : ''}`}
                >
                  <opt.icon className="w-5 h-5" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Name *</label>
              <input
                id="rsvp-name"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/50 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email (optional)</label>
              <input
                id="rsvp-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/50 transition-all"
              />
            </div>
          </div>

          {status === 'attending' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Party Size</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setPartySize(p => Math.max(1, p - 1))}
                    className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors">−</button>
                  <span className="text-xl font-black text-white tabular-nums w-8 text-center">{partySize}</span>
                  <button type="button" onClick={() => setPartySize(p => Math.min(20, p + 1))}
                    className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors">+</button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Utensils className="w-3 h-3" /> Dietary Needs
                </label>
                <input
                  id="rsvp-dietary"
                  value={dietary}
                  onChange={e => setDietary(e.target.value)}
                  placeholder="Veg, Vegan, Allergies..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/50 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Birthday Wish / Note</label>
            <textarea
              id="rsvp-wish-note"
              value={wishNote}
              onChange={e => setWishNote(e.target.value)}
              placeholder={`Leave a special message for ${personName}...`}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/50 resize-none transition-all"
            />
          </div>

          <button
            id="rsvp-submit-btn"
            type="submit"
            disabled={submitting || !guestName.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-white font-bold shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-sm"
            style={{ background: `linear-gradient(135deg, ${accent}, #a855f7)` }}
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'Confirm RSVP'}
          </button>
        </form>
      )}

      {/* Recent RSVPs */}
      {!loading && entries.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Recent RSVPs</p>
          {entries.slice(0, 5).map(entry => (
            <div key={entry.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-lg">{statusIcon[entry.status]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{entry.guestName}</p>
                {entry.wishesNote && <p className="text-xs text-slate-400 truncate">&ldquo;{entry.wishesNote}&rdquo;</p>}
              </div>
              {entry.status === 'attending' && entry.partySize > 1 && (
                <span className="text-xs text-emerald-400 font-semibold shrink-0">+{entry.partySize} guests</span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
