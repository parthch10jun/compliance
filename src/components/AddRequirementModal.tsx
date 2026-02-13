'use client';

import { useState } from 'react';
import { X, FileText, Plus, Upload, Search, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { requirements as libraryRequirements } from '@/lib/data/requirements-obligations';
import clsx from 'clsx';

interface AddRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  programId?: string;
  programName?: string;
  onAdd?: (requirement: { id: string; title: string; type: 'new' | 'imported' }) => void;
}

export function AddRequirementModal({ isOpen, onClose, programId, programName, onAdd }: AddRequirementModalProps) {
  const [mode, setMode] = useState<'select' | 'import' | 'create'>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  
  // Form state for creating new requirement
  const [newReq, setNewReq] = useState({
    code: '',
    title: '',
    description: '',
    section: '',
    category: 'Access Control',
    priority: 'High',
  });

  if (!isOpen) return null;

  const categories = ['Access Control', 'Data Protection', 'Incident Management', 'Audit & Logging', 'Governance', 'Risk Management'];
  const priorities = ['Critical', 'High', 'Medium', 'Low'];

  const filteredRequirements = libraryRequirements.filter(req => 
    req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleRequirement = (id: string) => {
    setSelectedRequirements(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleImport = () => {
    selectedRequirements.forEach(id => {
      const req = libraryRequirements.find(r => r.id === id);
      if (req && onAdd) {
        onAdd({ id: req.id, title: req.title, type: 'imported' });
      }
    });
    onClose();
  };

  const handleCreate = () => {
    if (onAdd && newReq.title) {
      onAdd({ id: `req-new-${Date.now()}`, title: newReq.title, type: 'new' });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">Add Requirement</h2>
                <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
                  {programName ? `Add requirements to "${programName}"` : 'Create or import requirements'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
              <X size={24} className="text-[var(--foreground-muted)]" />
            </button>
          </div>
        </div>

        {/* Mode selector */}
        {mode === 'select' && (
          <div className="flex-1 p-6">
            <p className="text-sm text-[var(--foreground-muted)] mb-6">Choose how you want to add requirements:</p>
            <div className="space-y-4">
              <button
                onClick={() => setMode('import')}
                className="w-full p-5 rounded-xl border-2 border-[var(--border)] hover:border-amber-400 hover:bg-amber-50 transition-all text-left group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <Upload size={24} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Import from Library</p>
                    <p className="text-sm text-[var(--foreground-muted)] mt-1">Select requirements from existing library ({libraryRequirements.length} available)</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-[var(--foreground-muted)] group-hover:text-amber-600" />
              </button>
              
              <button
                onClick={() => setMode('create')}
                className="w-full p-5 rounded-xl border-2 border-[var(--border)] hover:border-violet-400 hover:bg-violet-50 transition-all text-left group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                    <Plus size={24} className="text-violet-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Create New Requirement</p>
                    <p className="text-sm text-[var(--foreground-muted)] mt-1">Define a custom requirement for this program</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-[var(--foreground-muted)] group-hover:text-violet-600" />
              </button>
            </div>
          </div>
        )}

        {/* Import mode */}
        {mode === 'import' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMode('select')}
                  className="text-sm text-amber-600 hover:text-amber-800 font-medium"
                >
                  ← Back
                </button>
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                  <input
                    type="text"
                    placeholder="Search requirements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <span className="text-sm text-[var(--foreground-muted)]">
                  {selectedRequirements.length} selected
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredRequirements.map((req) => (
                <button
                  key={req.id}
                  onClick={() => toggleRequirement(req.id)}
                  className={clsx(
                    'w-full p-3 rounded-lg border-2 transition-all text-left flex items-start gap-3',
                    selectedRequirements.includes(req.id)
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-[var(--border)] hover:border-amber-300'
                  )}
                >
                  <div className={clsx(
                    'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                    selectedRequirements.includes(req.id) ? 'bg-amber-500 border-amber-500' : 'border-gray-300'
                  )}>
                    {selectedRequirements.includes(req.id) && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{req.code}</span>
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">{req.category}</span>
                    </div>
                    <p className="font-medium text-sm mt-1 text-[var(--foreground)]">{req.title}</p>
                    <p className="text-xs text-[var(--foreground-muted)] mt-0.5 truncate">{req.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-[var(--border)] bg-[var(--background-secondary)] flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[var(--foreground-muted)]">Cancel</button>
              <button
                onClick={handleImport}
                disabled={selectedRequirements.length === 0}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium text-sm hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import {selectedRequirements.length} Requirement{selectedRequirements.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* Create mode */}
        {mode === 'create' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <button onClick={() => setMode('select')} className="text-sm text-violet-600 hover:text-violet-800 font-medium mb-2">
                ← Back
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Code *</label>
                  <input
                    type="text" placeholder="e.g., REQ-001"
                    value={newReq.code} onChange={(e) => setNewReq({...newReq, code: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Section</label>
                  <input
                    type="text" placeholder="e.g., Section 3.2"
                    value={newReq.section} onChange={(e) => setNewReq({...newReq, section: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Title *</label>
                <input
                  type="text" placeholder="Requirement title"
                  value={newReq.title} onChange={(e) => setNewReq({...newReq, title: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Description</label>
                <textarea
                  rows={3} placeholder="Describe the requirement..."
                  value={newReq.description} onChange={(e) => setNewReq({...newReq, description: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Category</label>
                  <select
                    value={newReq.category} onChange={(e) => setNewReq({...newReq, category: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-violet-500"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Priority</label>
                  <select
                    value={newReq.priority} onChange={(e) => setNewReq({...newReq, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-violet-500"
                  >
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[var(--border)] bg-[var(--background-secondary)] flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[var(--foreground-muted)]">Cancel</button>
              <button
                onClick={handleCreate}
                disabled={!newReq.title || !newReq.code}
                className="px-6 py-2 bg-violet-600 text-white rounded-lg font-medium text-sm hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Requirement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

