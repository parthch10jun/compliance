'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Shield, FileText, Link2, CheckCircle2, AlertCircle, ChevronRight,
  Search, Layers, Sparkles, ArrowRight, Plus, X, Target, Building2,
  ExternalLink, Eye, Zap, AlertTriangle, Clock
} from 'lucide-react';
import clsx from 'clsx';
import { programs } from '@/lib/data/mock-data';
import { requirements } from '@/lib/data/requirements-obligations';
import { controls } from '@/lib/data/controls';
import { PageHeader } from '@/components';

export default function VisualBuilderPage() {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(null);
  const [searchProgram, setSearchProgram] = useState('');
  const [searchRequirement, setSearchRequirement] = useState('');
  const [searchControl, setSearchControl] = useState('');
  const [controlMappings, setControlMappings] = useState<Record<string, string[]>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load mappings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('control-requirement-mappings');
    if (stored) {
      try {
        setControlMappings(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored mappings:', e);
      }
    }
  }, []);

  // Filter programs
  const filteredPrograms = useMemo(() => {
    return programs.filter(p =>
      p.name.toLowerCase().includes(searchProgram.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchProgram.toLowerCase()))
    );
  }, [searchProgram]);

  // Get requirements for selected program
  const programRequirements = useMemo(() => {
    if (!selectedProgramId) return [];
    return requirements.filter(r => r.programId === selectedProgramId);
  }, [selectedProgramId]);

  // Filter requirements
  const filteredRequirements = useMemo(() => {
    return programRequirements.filter(r =>
      r.title.toLowerCase().includes(searchRequirement.toLowerCase()) ||
      r.code.toLowerCase().includes(searchRequirement.toLowerCase())
    );
  }, [programRequirements, searchRequirement]);

  // Get controls for selected requirement (both linked and available)
  const { linkedControls, availableControls } = useMemo(() => {
    if (!selectedRequirementId) return { linkedControls: [], availableControls: [] };
    
    const staticLinked = controls.filter(c => c.linkedRequirementIds?.includes(selectedRequirementId));
    const dynamicLinkedIds = controlMappings[selectedRequirementId] || [];
    const dynamicLinked = controls.filter(c => dynamicLinkedIds.includes(c.id) && !staticLinked.find(s => s.id === c.id));
    const allLinked = [...staticLinked, ...dynamicLinked];
    
    const available = controls.filter(c => 
      !allLinked.find(l => l.id === c.id) &&
      (c.name.toLowerCase().includes(searchControl.toLowerCase()) ||
       c.code.toLowerCase().includes(searchControl.toLowerCase()) ||
       c.category.toLowerCase().includes(searchControl.toLowerCase()))
    );
    
    return { linkedControls: allLinked, availableControls: available.slice(0, 20) };
  }, [selectedRequirementId, controlMappings, searchControl]);

  const handleLinkControl = (controlId: string) => {
    if (!selectedRequirementId) return;
    
    const newMappings = {
      ...controlMappings,
      [selectedRequirementId]: [...(controlMappings[selectedRequirementId] || []), controlId]
    };
    setControlMappings(newMappings);
    localStorage.setItem('control-requirement-mappings', JSON.stringify(newMappings));
    
    const control = controls.find(c => c.id === controlId);
    setSuccessMessage(`Linked "${control?.name}" to requirement`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleUnlinkControl = (controlId: string) => {
    if (!selectedRequirementId) return;
    
    const newMappings = {
      ...controlMappings,
      [selectedRequirementId]: (controlMappings[selectedRequirementId] || []).filter(id => id !== controlId)
    };
    setControlMappings(newMappings);
    localStorage.setItem('control-requirement-mappings', JSON.stringify(newMappings));
    
    setSuccessMessage('Control unlinked');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const selectedProgram = programs.find(p => p.id === selectedProgramId);
  const selectedRequirement = requirements.find(r => r.id === selectedRequirementId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'text-emerald-600 bg-emerald-50';
      case 'Partially Compliant': return 'text-amber-600 bg-amber-50';
      case 'Non-Compliant': return 'text-rose-600 bg-rose-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getEffectivenessColor = (eff: string) => {
    switch (eff) {
      case 'Effective': return 'text-emerald-600 bg-emerald-50';
      case 'Partially Effective': return 'text-amber-600 bg-amber-50';
      case 'Ineffective': return 'text-rose-600 bg-rose-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <PageHeader
        title="Visual Compliance Builder"
        description="Link programs to requirements and map controls visually"
        action={
          <Link
            href="/setup-wizard"
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Sparkles size={18} />
            Setup Wizard
          </Link>
        }
      />

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-lg animate-in slide-in-from-top-2">
          <CheckCircle2 size={18} />
          {successMessage}
        </div>
      )}

      {/* Three Column Builder */}
      <div className="flex-1 grid grid-cols-3 gap-4 overflow-hidden">
        {/* Column 1: Programs */}
        <ProgramColumn
          programs={filteredPrograms}
          selectedProgramId={selectedProgramId}
          onSelectProgram={(id) => {
            setSelectedProgramId(id);
            setSelectedRequirementId(null);
          }}
          search={searchProgram}
          onSearchChange={setSearchProgram}
        />

        {/* Column 2: Requirements */}
        <RequirementColumn
          requirements={filteredRequirements}
          selectedRequirementId={selectedRequirementId}
          onSelectRequirement={setSelectedRequirementId}
          search={searchRequirement}
          onSearchChange={setSearchRequirement}
          programName={selectedProgram?.name}
          getStatusColor={getStatusColor}
        />

        {/* Column 3: Controls */}
        <ControlColumn
          linkedControls={linkedControls}
          availableControls={availableControls}
          search={searchControl}
          onSearchChange={setSearchControl}
          requirementTitle={selectedRequirement?.title}
          onLinkControl={handleLinkControl}
          onUnlinkControl={handleUnlinkControl}
          getEffectivenessColor={getEffectivenessColor}
        />
      </div>
    </div>
  );
}

// Program Column Component
function ProgramColumn({ programs, selectedProgramId, onSelectProgram, search, onSearchChange }: {
  programs: any[];
  selectedProgramId: string | null;
  onSelectProgram: (id: string) => void;
  search: string;
  onSearchChange: (s: string) => void;
}) {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-violet-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Layers size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Programs</h3>
            <p className="text-xs text-gray-500">{programs.length} available</p>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search programs..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {programs.map(program => {
          const reqCount = requirements.filter(r => r.programId === program.id).length;
          return (
            <button
              key={program.id}
              onClick={() => onSelectProgram(program.id)}
              className={clsx(
                'w-full text-left p-3 rounded-lg transition-all',
                selectedProgramId === program.id
                  ? 'bg-indigo-100 border-2 border-indigo-500'
                  : 'hover:bg-gray-50 border-2 border-transparent'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate">{program.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText size={12} />
                      {reqCount} req
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield size={12} />
                      {program.controls} ctrl
                    </span>
                  </div>
                </div>
                {selectedProgramId === program.id && (
                  <ChevronRight size={16} className="text-indigo-600 flex-shrink-0 mt-1" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Requirement Column Component
function RequirementColumn({ requirements, selectedRequirementId, onSelectRequirement, search, onSearchChange, programName, getStatusColor }: {
  requirements: any[];
  selectedRequirementId: string | null;
  onSelectRequirement: (id: string) => void;
  search: string;
  onSearchChange: (s: string) => void;
  programName?: string;
  getStatusColor: (status: string) => string;
}) {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Requirements</h3>
            <p className="text-xs text-gray-500 truncate max-w-[180px]">
              {programName ? `${requirements.length} in ${programName}` : 'Select a program'}
            </p>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search requirements..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {!programName ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
            <ArrowRight size={24} className="mb-2 rotate-180" />
            <p className="text-sm text-center">Select a program to view requirements</p>
          </div>
        ) : requirements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
            <AlertCircle size={24} className="mb-2" />
            <p className="text-sm text-center">No requirements found</p>
          </div>
        ) : (
          requirements.map(req => (
            <button
              key={req.id}
              onClick={() => onSelectRequirement(req.id)}
              className={clsx(
                'w-full text-left p-3 rounded-lg transition-all',
                selectedRequirementId === req.id
                  ? 'bg-cyan-100 border-2 border-cyan-500'
                  : 'hover:bg-gray-50 border-2 border-transparent'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">
                      {req.code}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mt-1 line-clamp-2">{req.title}</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={clsx('text-xs px-1.5 py-0.5 rounded', getStatusColor(req.status))}>
                      {req.status}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Shield size={10} />
                      {req.controlCount || 0}
                    </span>
                  </div>
                </div>
                {selectedRequirementId === req.id && (
                  <ChevronRight size={16} className="text-cyan-600 flex-shrink-0 mt-1" />
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// Control Column Component
function ControlColumn({ linkedControls, availableControls, search, onSearchChange, requirementTitle, onLinkControl, onUnlinkControl, getEffectivenessColor }: {
  linkedControls: any[];
  availableControls: any[];
  search: string;
  onSearchChange: (s: string) => void;
  requirementTitle?: string;
  onLinkControl: (id: string) => void;
  onUnlinkControl: (id: string) => void;
  getEffectivenessColor: (eff: string) => string;
}) {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Controls</h3>
            <p className="text-xs text-gray-500 truncate max-w-[180px]">
              {requirementTitle ? `${linkedControls.length} linked` : 'Select a requirement'}
            </p>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search controls..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!requirementTitle ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
            <ArrowRight size={24} className="mb-2 rotate-180" />
            <p className="text-sm text-center">Select a requirement to view & link controls</p>
          </div>
        ) : (
          <div className="p-2 space-y-4">
            {/* Linked Controls */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1 flex items-center gap-1">
                <Link2 size={12} />
                Linked Controls ({linkedControls.length})
              </h4>
              <div className="space-y-1 mt-1">
                {linkedControls.length === 0 ? (
                  <p className="text-xs text-gray-400 px-2 py-3 text-center bg-gray-50 rounded-lg">
                    No controls linked yet
                  </p>
                ) : (
                  linkedControls.map(ctrl => (
                    <div
                      key={ctrl.id}
                      className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              {ctrl.code}
                            </span>
                            <span className={clsx('text-xs px-1.5 py-0.5 rounded', getEffectivenessColor(ctrl.effectiveness))}>
                              {ctrl.effectiveness}
                            </span>
                          </div>
                          <h5 className="font-medium text-gray-900 text-sm mt-1 line-clamp-1">{ctrl.name}</h5>
                          <p className="text-xs text-gray-500 mt-0.5">{ctrl.category}</p>
                        </div>
                        <div className="flex gap-1">
                          <Link
                            href={`/controls/${ctrl.id}`}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                            title="View control"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => onUnlinkControl(ctrl.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-100 rounded transition-colors"
                            title="Unlink control"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Available Controls */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1 flex items-center gap-1">
                <Plus size={12} />
                Available Controls ({availableControls.length})
              </h4>
              <div className="space-y-1 mt-1">
                {availableControls.map(ctrl => (
                  <div
                    key={ctrl.id}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                            {ctrl.code}
                          </span>
                        </div>
                        <h5 className="font-medium text-gray-900 text-sm mt-1 line-clamp-1">{ctrl.name}</h5>
                        <p className="text-xs text-gray-500 mt-0.5">{ctrl.category}</p>
                      </div>
                      <button
                        onClick={() => onLinkControl(ctrl.id)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Link control"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

