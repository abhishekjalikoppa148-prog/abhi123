'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, ArrowRight, Heart, Sparkles, Home, Gift, Crown, Zap, Feather, PartyPopper, Eye, X } from 'lucide-react';
import { TEMPLATES } from '@/lib/sample-data';

const CATEGORIES = [
  { id: 'romantic', name: 'Romantic', icon: Heart, emoji: '❤️' },
  { id: 'friends', name: 'Friends', icon: Sparkles, emoji: '🎉' },
  { id: 'family', name: 'Family', icon: Home, emoji: '👨‍👩‍👧' },
  { id: 'cute', name: 'Cute', icon: Gift, emoji: '🧸' },
  { id: 'elegant', name: 'Elegant', icon: Crown, emoji: '✨' },
  { id: 'party', name: 'Party', icon: PartyPopper, emoji: '🎊' },
  { id: 'modern', name: 'Modern', icon: Zap, emoji: '🌌' },
  { id: 'minimal', name: 'Minimal', icon: Feather, emoji: '🎂' }
];

const TEMPLATE_CATEGORIES: Record<string, string[]> = {
  romantic: ['romantic', 'pink-gold'],
  friends: ['bestfriend', 'party'],
  family: ['family'],
  cute: ['cute'],
  elegant: ['elegant', 'pink-gold'],
  party: ['party', 'bestfriend'],
  modern: ['modern'],
  minimal: ['minimal']
};

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || 
      TEMPLATE_CATEGORIES[selectedCategory]?.includes(template.id);
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePreview = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  return (
    <div className="min-h-screen space-y-12 pb-20">
      
      {/* Header */}
      <section className="pt-12 sm:pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gradient-rose">Template Marketplace</span>
          <h1 className="text-4xl sm:text-6xl font-black text-white">Choose Your Perfect Style 🎨</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Browse our collection of beautifully crafted birthday templates designed for every relationship and celebration.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass-luxury text-white text-sm focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all' 
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white' 
                  : 'glass-luxury text-slate-300 hover:bg-white/10'
              }`}
            >
              All Templates
            </button>
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedCategory === category.id 
                      ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white' 
                      : 'glass-luxury text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>{category.emoji}</span>
                  {category.name}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Templates Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div 
              key={template.id}
              className="group rounded-3xl glass-luxury overflow-hidden hover:border-rose-500/40 transition-all hover:-translate-y-1 flex flex-col card-3d"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <Image
                  src={template.previewImage}
                  alt={template.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-luxury text-white text-[10px] font-bold border border-white/20">
                  {template.badge}
                </span>
                <button
                  onClick={() => handlePreview(template.id)}
                  className="absolute bottom-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-white text-base">{template.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{template.description}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(template.id)}
                    className="flex-1 py-2 rounded-xl glass-luxury text-slate-200 hover:text-white font-bold text-xs transition-colors"
                  >
                    Preview
                  </button>
                  <Link
                    href={`/builder?template=${template.id}`}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1 hover:from-rose-600 hover:to-purple-700 transition-all"
                  >
                    Use Template <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No templates found matching your criteria.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-4 px-6 py-2 rounded-xl bg-rose-500 text-white font-bold text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-3xl glass-luxury overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* Preview Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                </h3>
                <p className="text-sm text-slate-400">
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Content */}
            <div className={`relative h-[500px] bg-gradient-to-b ${
              TEMPLATES.find(t => t.id === selectedTemplate)?.bgGradient
            } flex items-center justify-center text-center p-8`}>
              <div className="space-y-6">
                <span className="px-4 py-2 rounded-full glass-luxury text-white text-sm font-semibold border border-white/20">
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.badge}
                </span>
                <h2 className="text-4xl sm:text-6xl font-black text-white font-playfair">
                  HAPPY BIRTHDAY!
                </h2>
                <p className="text-lg text-slate-200 max-w-lg mx-auto">
                  This is a preview of how your birthday website will look with this template.
                </p>
              </div>
            </div>

            {/* Preview Actions */}
            <div className="flex items-center justify-between p-6 border-t border-slate-800">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-6 py-3 rounded-xl glass-luxury text-slate-200 hover:text-white font-bold text-sm transition-colors"
              >
                Back to Templates
              </button>
              <Link
                href={`/builder?template=${selectedTemplate}`}
                onClick={() => setSelectedTemplate(null)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-sm flex items-center gap-2 hover:from-rose-600 hover:to-purple-700 transition-all"
              >
                Use This Template <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
