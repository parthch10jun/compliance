'use client';

import { useState } from 'react';
import { X, Search, ChevronRight, Landmark, BookOpen, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { programTemplates } from '@/lib/data/program-library';
import clsx from 'clsx';

interface LinkFrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  programId?: string;
  programName?: string;
  onLink?: (frameworkId: string, frameworkName: string, requirements: number) => void;
}

// Derive unique authorities from program templates
const getAuthorities = () => {
  const authorityMap = new Map<string, { name: string; count: number; icon: string }>();
  
  programTemplates.forEach(template => {
    const authority = template.tags.find(t =>
      ['RBI', 'ISO', 'EU', 'SDAIA', 'NIST', 'SEC', 'PCI', 'HIPAA', 'CBUAE'].includes(t)
    ) || template.publisher?.split(' ')[0] || 'Other';

    if (!authorityMap.has(authority)) {
      authorityMap.set(authority, {
        name: authority,
        count: 0,
        icon: authority === 'RBI' ? '🏛️' : authority === 'ISO' ? '🌐' : authority === 'EU' ? '🇪🇺' :
              authority === 'SDAIA' ? '🇸🇦' : authority === 'NIST' ? '🇺🇸' : authority === 'SEC' ? '📊' :
              authority === 'CBUAE' ? '🏦' : '📋'
      });
    }
    authorityMap.get(authority)!.count++;
  });
  
  return Array.from(authorityMap.values());
};

export function LinkFrameworkModal({ isOpen, onClose, programId, programName, onLink }: LinkFrameworkModalProps) {
  const [step, setStep] = useState<'authority' | 'framework'>('authority');
  const [selectedAuthority, setSelectedAuthority] = useState<string | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<typeof programTemplates[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const authorities = getAuthorities();
  
  const filteredFrameworks = programTemplates.filter(template => {
    const matchesAuthority = !selectedAuthority || 
      template.tags.includes(selectedAuthority) ||
      template.publisher?.includes(selectedAuthority);
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.framework.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAuthority && matchesSearch;
  });

  const handleSelectAuthority = (authority: string) => {
    setSelectedAuthority(authority);
    setStep('framework');
  };

  const handleSelectFramework = (framework: typeof programTemplates[0]) => {
    setSelectedFramework(framework);
  };

  const handleLink = () => {
    if (selectedFramework && onLink) {
      onLink(selectedFramework.id, selectedFramework.name, selectedFramework.requirementCount);
    }
    onClose();
  };

  const handleBack = () => {
    if (step === 'framework') {
      setStep('authority');
      setSelectedFramework(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-cyan-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center">
                <Landmark size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">Link to Regulation</h2>
                <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
                  {programName ? `Connect "${programName}" to a framework` : 'Select a regulatory framework to link'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
              <X size={24} className="text-[var(--foreground-muted)]" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-4 mt-6">
            <div className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
              step === 'authority' ? 'bg-cyan-600 text-white' : 'bg-cyan-100 text-cyan-700'
            )}>
              <span className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs">1</span>
              Authority
            </div>
            <ChevronRight size={16} className="text-[var(--foreground-muted)]" />
            <div className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
              step === 'framework' ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-500'
            )}>
              <span className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs">2</span>
              Framework
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'authority' ? (
            <div className="space-y-4">
              <p className="text-sm text-[var(--foreground-muted)] mb-4">
                Select a regulatory authority or standards body:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {authorities.map((auth) => (
                  <button
                    key={auth.name}
                    onClick={() => handleSelectAuthority(auth.name)}
                    className="p-4 rounded-xl border border-[var(--border)] hover:border-cyan-400 hover:bg-cyan-50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{auth.icon}</span>
                      <div>
                        <p className="font-semibold text-[var(--foreground)] group-hover:text-cyan-700">{auth.name}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">{auth.count} framework{auth.count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Back button and search */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="text-sm text-cyan-600 hover:text-cyan-800 font-medium flex items-center gap-1"
                >
                  ← Back to authorities
                </button>
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                  <input
                    type="text"
                    placeholder="Search frameworks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              
              {/* Framework list */}
              <div className="space-y-3">
                {filteredFrameworks.length === 0 ? (
                  <div className="text-center py-8 text-[var(--foreground-muted)]">
                    <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No frameworks found</p>
                  </div>
                ) : (
                  filteredFrameworks.map((framework) => (
                    <button
                      key={framework.id}
                      onClick={() => handleSelectFramework(framework)}
                      className={clsx(
                        'w-full p-4 rounded-xl border-2 transition-all text-left group',
                        selectedFramework?.id === framework.id
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-[var(--border)] hover:border-cyan-300 hover:bg-cyan-50/50'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-cyan-600" />
                            <p className="font-semibold text-[var(--foreground)]">{framework.name}</p>
                            {selectedFramework?.id === framework.id && (
                              <CheckCircle2 size={16} className="text-cyan-600" />
                            )}
                          </div>
                          <p className="text-sm text-[var(--foreground-muted)] mt-1">{framework.description}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-[var(--foreground-muted)]">
                            <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full">
                              {framework.requirementCount} requirements
                            </span>
                            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full">
                              {framework.obligationCount} obligations
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                              {framework.controlCount} controls
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--background-secondary)] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Cancel
          </button>

          {step === 'framework' && selectedFramework && (
            <button
              onClick={handleLink}
              className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg font-medium text-sm hover:bg-cyan-700 transition-colors flex items-center gap-2"
            >
              Link Framework
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

