'use client';

import { useState } from 'react';
import { Calendar, Heart, Plus, X, Edit2 } from 'lucide-react';

interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  photo?: string;
}

interface MemoryTimelineProps {
  memories: Memory[];
  onMemoriesChange: (memories: Memory[]) => void;
}

export default function MemoryTimeline({ memories, onMemoriesChange }: MemoryTimelineProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMemory, setNewMemory] = useState<Partial<Memory>>({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: ''
  });

  const handleAddMemory = () => {
    if (!newMemory.title || !newMemory.date) return;

    const memory: Memory = {
      id: `memory-${Date.now()}`,
      date: newMemory.date!,
      title: newMemory.title,
      description: newMemory.description || '',
      photo: newMemory.photo
    };

    onMemoriesChange([...memories, memory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewMemory({ date: new Date().toISOString().split('T')[0], title: '', description: '' });
    setShowAddForm(false);
  };

  const handleUpdateMemory = (id: string) => {
    if (!newMemory.title || !newMemory.date) return;

    onMemoriesChange(
      memories.map(m => m.id === id ? { ...m, ...newMemory } : m)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );
    setEditingId(null);
    setNewMemory({ date: new Date().toISOString().split('T')[0], title: '', description: '' });
  };

  const handleDeleteMemory = (id: string) => {
    onMemoriesChange(memories.filter(m => m.id !== id));
  };

  const handleEditMemory = (memory: Memory) => {
    setEditingId(memory.id);
    setNewMemory(memory);
    setShowAddForm(true);
  };

  const sortedMemories = [...memories].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-bold text-white">Memory Timeline</h3>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); setNewMemory({ date: new Date().toISOString().split('T')[0], title: '', description: '' }); }}
          className="magnetic-btn px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" /> Add Memory
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="p-6 rounded-2xl glass-luxury space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">{editingId ? 'Edit Memory' : 'Add New Memory'}</h4>
            <button onClick={() => { setShowAddForm(false); setEditingId(null); }}>
              <X className="w-5 h-5 text-slate-400 hover:text-white" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Date</label>
              <input
                type="date"
                value={newMemory.date}
                onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Title</label>
              <input
                type="text"
                value={newMemory.title}
                onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                placeholder="e.g., Our first trip together"
                className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Description</label>
              <textarea
                value={newMemory.description}
                onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                placeholder="Describe this special memory..."
                rows={3}
                className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          <button
            onClick={() => editingId ? handleUpdateMemory(editingId) : handleAddMemory()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-sm hover:from-rose-600 hover:to-purple-700 transition-all"
          >
            {editingId ? 'Update Memory' : 'Add Memory'}
          </button>
        </div>
      )}

      {/* Timeline */}
      <div className="relative space-y-6 pl-8">
        {/* Timeline Line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-500 to-purple-600" />

        {sortedMemories.map((memory, index) => (
          <div key={memory.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute left-[-1.6rem] top-0 w-4 h-4 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 border-4 border-slate-900 group-hover:scale-125 transition-transform" />

            {/* Memory Card */}
            <div className="p-4 rounded-2xl glass-luxury space-y-3 group-hover:border-rose-500/30 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-rose-400 font-semibold mb-1">
                    {new Date(memory.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h4 className="text-base font-bold text-white">{memory.title}</h4>
                  {memory.description && (
                    <p className="text-sm text-slate-300 mt-1">{memory.description}</p>
                  )}
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditMemory(memory)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMemory(memory.id)}
                    className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {sortedMemories.length === 0 && (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No memories yet. Add your first special memory!</p>
          </div>
        )}
      </div>

    </div>
  );
}
