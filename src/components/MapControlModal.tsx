'use client';

import { useState } from 'react';
import { X, Shield, Search, CheckCircle2, Plus, Link2 } from 'lucide-react';
import { controls } from '@/lib/data/controls';
import clsx from 'clsx';

interface MapControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirementId?: string;
  requirementTitle?: string;
  onMap?: (controlIds: string[]) => void;
}

export function MapControlModal({ isOpen, onClose, requirementId, requirementTitle, onMap }: MapControlModalProps) {
  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedControls, setSelectedControls] = useState<string[]>([]);
  const [newControl, setNewControl] = useState({
    code: '',
    name: '',
    description: '',
    category: 'Access Control',
    type: 'Preventive',
    automationLevel: 'Manual',
  });

  if (!isOpen) return null;

  const categories = ['Access Control', 'Data Protection', 'Incident Management', 'Audit & Logging', 'Change Management', 'Asset Management'];
  const types = ['Preventive', 'Detective', 'Corrective'];
  const automationLevels = ['Manual', 'Semi-Automated', 'Fully Automated'];

  const filteredControls = controls.filter(ctrl =>
    ctrl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ctrl.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ctrl.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleControl = (id: string) => {
    setSelectedControls(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleMap = () => {
    if (onMap) onMap(selectedControls);
    onClose();
  };

  const handleCreate = () => {
    if (onMap && newControl.name) {
      onMap([`ctrl-new-${Date.now()}`]);
    }
    onClose();
  };

  const getEffectivenessColor = (eff: string) => {
    if (eff === 'Effective') return 'bg-emerald-100 text-emerald-700';
    if (eff === 'Partially Effective') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Link2 size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">Map Controls</h2>
                <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
                  {requirementTitle ? `Link controls to "${requirementTitle}"` : 'Select controls to map'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
              <X size={24} className="text-[var(--foreground-muted)]" />
            </button>
          </div>
        </div>

        {/* Search and tabs */}
        <div className="p-4 border-b border-[var(--border)] flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('select')}
              className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                mode === 'select' ? 'bg-emerald-100 text-emerald-700' : 'text-[var(--foreground-muted)] hover:bg-gray-100'
              )}
            >
              Select Existing
            </button>
            <button
              onClick={() => setMode('create')}
              className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                mode === 'create' ? 'bg-violet-100 text-violet-700' : 'text-[var(--foreground-muted)] hover:bg-gray-100'
              )}
            >
              <Plus size={14} className="inline mr-1" />
              Create New
            </button>
          </div>
          {mode === 'select' && (
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <input
                type="text"
                placeholder="Search controls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {mode === 'select' ? (
            <div className="space-y-2">
              {filteredControls.map((ctrl) => (
                <button
                  key={ctrl.id}
                  onClick={() => toggleControl(ctrl.id)}
                  className={clsx(
                    'w-full p-3 rounded-lg border-2 transition-all text-left flex items-start gap-3',
                    selectedControls.includes(ctrl.id)
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-[var(--border)] hover:border-emerald-300'
                  )}
                >
                  <div className={clsx(
                    'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                    selectedControls.includes(ctrl.id) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
                  )}>
                    {selectedControls.includes(ctrl.id) && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{ctrl.code}</span>
                      <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">{ctrl.category}</span>
                      <span className={clsx('text-xs px-2 py-0.5 rounded-full', getEffectivenessColor(ctrl.effectiveness))}>{ctrl.effectiveness}</span>
                    </div>
                    <p className="font-medium text-sm mt-1 text-[var(--foreground)]">{ctrl.name}</p>
                    <p className="text-xs text-[var(--foreground-muted)] mt-0.5 truncate">{ctrl.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Code *</label>
                  <input
                    type="text" placeholder="e.g., CTRL-001"
                    value={newControl.code} onChange={(e) => setNewControl({...newControl, code: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Category</label>
                  <select
                    value={newControl.category} onChange={(e) => setNewControl({...newControl, category: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Name *</label>
                <input
                  type="text" placeholder="Control name"
                  value={newControl.name} onChange={(e) => setNewControl({...newControl, name: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Description</label>
                <textarea
                  rows={3} placeholder="Describe the control..."
                  value={newControl.description} onChange={(e) => setNewControl({...newControl, description: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Type</label>
                  <select
                    value={newControl.type} onChange={(e) => setNewControl({...newControl, type: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Automation Level</label>
                  <select
                    value={newControl.automationLevel} onChange={(e) => setNewControl({...newControl, automationLevel: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    {automationLevels.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--background-secondary)] flex justify-between items-center">
          <span className="text-sm text-[var(--foreground-muted)]">
            {mode === 'select' ? `${selectedControls.length} control${selectedControls.length !== 1 ? 's' : ''} selected` : ''}
          </span>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[var(--foreground-muted)]">Cancel</button>
            {mode === 'select' ? (
              <button
                onClick={handleMap}
                disabled={selectedControls.length === 0}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Map Controls
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={!newControl.name || !newControl.code}
                className="px-6 py-2 bg-violet-600 text-white rounded-lg font-medium text-sm hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create & Map
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

