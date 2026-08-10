'use client';

import { useState } from 'react';
import { Upload, X, GripVertical, RotateCw, Maximize2, Trash2, Plus } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  caption?: string;
  date?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  maxPhotos?: number;
}

export default function PhotoGallery({ photos, onPhotosChange, maxPhotos = 30 }: PhotoGalleryProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newPhotos = [...photos];
    const [draggedPhoto] = newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(dropIndex, 0, draggedPhoto);
    onPhotosChange(newPhotos);
    setDraggedIndex(null);
  };

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: Photo[] = Array.from(files).map((file, index) => ({
      id: `photo-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      caption: '',
      date: new Date().toISOString()
    }));

    onPhotosChange([...photos, ...newPhotos]);
  };

  const handleRemovePhoto = (id: string) => {
    onPhotosChange(photos.filter(p => p.id !== id));
  };

  const handleCaptionChange = (id: string, caption: string) => {
    onPhotosChange(photos.map(p => p.id === id ? { ...p, caption } : p));
  };

  return (
    <div className="space-y-4">
      
      {/* Upload Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">
          Photos ({photos.length}/{maxPhotos})
        </p>
        <label className="magnetic-btn px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
          <Plus className="w-4 h-4" /> Add Photos
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleAddPhoto}
            className="hidden"
          />
        </label>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative aspect-square rounded-2xl bg-slate-900 overflow-hidden group cursor-move transition-all ${
              draggedIndex === index ? 'opacity-50 scale-95' : 'hover:border-rose-500/50 border-2 border-transparent'
            }`}
          >
            {/* Photo */}
            <img
              src={photo.url}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Drag Handle */}
            <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4 text-white" />
            </div>

            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setSelectedPhoto(photo)}
                className="p-1.5 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRemovePhoto(photo.id)}
                className="p-1.5 rounded-lg bg-red-500/80 backdrop-blur-sm hover:bg-red-600 text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Caption Input */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <input
                type="text"
                value={photo.caption || ''}
                onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                placeholder="Add caption..."
                className="w-full px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs placeholder-slate-400 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        ))}

        {/* Add Photo Placeholder */}
        {photos.length < maxPhotos && (
          <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group">
            <Upload className="w-8 h-8 text-slate-500 group-hover:text-rose-400 transition-colors" />
            <span className="text-xs text-slate-500 group-hover:text-rose-400 mt-2 transition-colors">Add Photo</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddPhoto}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full">
            <img
              src={selectedPhoto.url}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
