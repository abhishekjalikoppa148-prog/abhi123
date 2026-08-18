'use client';

import { useState, useEffect, useCallback } from 'react';
import { Camera, Heart, Plus, X, ZoomIn, Upload, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface GuestPhoto {
  id: string;
  url: string;
  caption?: string;
  uploadedBy?: string;
  likes: number;
  createdAt: string;
}

interface PhotoGalleryProps {
  websiteId: string;
  personName: string;
  accent?: string;
  /** Owner photos already embedded in the website object */
  ownerPhotos?: { id: string; url: string; caption?: string; date?: string }[];
}

export default function PhotoGallery({ websiteId, personName, accent = '#f43f5e', ownerPhotos = [] }: PhotoGalleryProps) {
  const [guestPhotos, setGuestPhotos] = useState<GuestPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload form
  const [showUpload, setShowUpload] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [uploading, setUploading] = useState(false);

  // Lightbox
  const [lightbox, setLightbox] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch(`/api/photos?websiteId=${websiteId}`);
      if (res.ok) {
        const data = await res.json();
        setGuestPhotos(data.photos || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [websiteId]);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setUploading(true);
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          url: newUrl.trim(),
          caption: newCaption.trim() || undefined,
          uploadedBy: uploaderName.trim() || 'Guest',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGuestPhotos(prev => [data.photo, ...prev]);
        setNewUrl('');
        setNewCaption('');
        setShowUpload(false);
      }
    } catch {
      // silent
    } finally {
      setUploading(false);
    }
  };

  const handleLikePhoto = async (id: string) => {
    setGuestPhotos(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    // No backend endpoint needed for now — optimistic only
  };

  const allPhotos = [
    ...ownerPhotos.map(p => ({ id: p.id, url: p.url, caption: p.caption || '', isOwner: true })),
    ...guestPhotos.map(p => ({ id: p.id, url: p.url, caption: p.caption || '', isOwner: false, likes: p.likes, uploadedBy: p.uploadedBy })),
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-300">
          <Camera className="w-5 h-5" />
          <h3 className="text-2xl font-black text-white">Photo Memories</h3>
          <Sparkles className="w-4 h-4 animate-spin" />
        </div>
        <button
          id="add-photo-btn"
          onClick={() => setShowUpload(v => !v)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-bold transition-all active:scale-95 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${accent}, #a855f7)` }}
        >
          <Plus className="w-4 h-4" />
          Add Photo
        </button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <form
          onSubmit={handleUpload}
          className="p-5 rounded-2xl bg-white/10 border border-white/20 space-y-3 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white flex items-center gap-1.5"><Upload className="w-4 h-4" /> Share a Memory</p>
            <button type="button" onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              id="photo-url-input"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              placeholder="Paste image URL..."
              required
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/50"
            />
            <input
              id="photo-uploader-name"
              value={uploaderName}
              onChange={e => setUploaderName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/50"
            />
          </div>
          <input
            id="photo-caption-input"
            value={newCaption}
            onChange={e => setNewCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/50"
          />
          <button
            id="photo-submit-btn"
            type="submit"
            disabled={uploading || !newUrl.trim()}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full text-white text-sm font-bold disabled:opacity-50 transition-all"
            style={{ background: `linear-gradient(135deg, ${accent}, #a855f7)` }}
          >
            <Camera className="w-4 h-4" />
            {uploading ? 'Adding...' : 'Add to Gallery'}
          </button>
        </form>
      )}

      {/* Gallery Grid */}
      {allPhotos.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm space-y-2">
          <p className="text-4xl">📸</p>
          <p>No photos yet — be the first to share a memory!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {allPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-2xl overflow-hidden bg-slate-800 aspect-square cursor-pointer shadow-lg hover:shadow-2xl transition-all hover:scale-105"
              onClick={() => setLightbox(photo.url)}
            >
              <Image
                src={photo.url}
                alt={photo.caption || 'Birthday memory'}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <ZoomIn className="w-6 h-6 text-white" />
                {photo.caption && (
                  <p className="text-white text-xs text-center font-medium line-clamp-2">{photo.caption}</p>
                )}
              </div>
              {/* Like button for guest photos */}
              {'likes' in photo && typeof photo.likes === 'number' && (
                <button
                  onClick={e => { e.stopPropagation(); handleLikePhoto(photo.id); }}
                  className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold hover:bg-rose-500/70 transition-colors"
                >
                  <Heart className="w-3 h-3" />
                  {photo.likes}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-3xl max-h-[90vh] aspect-auto">
            <Image
              src={lightbox}
              alt="Birthday memory"
              width={1200}
              height={900}
              className="object-contain rounded-xl w-full h-full max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}
