'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2, ChevronRight, ChevronLeft, Sparkles,
  Layers, FileText, Shield, Upload, Eye, Plus, X, Search,
  Building2, User, Tag, Rocket, ArrowRight, ExternalLink,
  FileUp, Code, Table
} from 'lucide-react';
import clsx from 'clsx';
import { PageHeader } from '@/components';
import { programs } from '@/lib/data/mock-data';
import { programTemplates } from '@/lib/data/program-library';
import { requirements } from '@/lib/data/requirements-obligations';
import { controls } from '@/lib/data/controls';
import { evidence } from '@/lib/data/evidence';

type WizardStep = 'program' | 'requirements' | 'controls' | 'evidence' | 'review';

interface WizardState {
  selectedProgramId: string | null;
  selectedTemplateId: string | null;
  isNewProgram: boolean;
  programDetails: {
    name: string;
    description: string;
    owner: string;
    department: string;
  };
  selectedRequirementIds: string[];
  controlMappings: Record<string, string[]>;
  uploadedEvidence: { controlId: string; files: File[] }[];
}

const STEPS: { key: WizardStep; label: string; icon: any }[] = [
  { key: 'program', label: 'Select Program', icon: Layers },
  { key: 'requirements', label: 'Add Requirements', icon: FileText },
  { key: 'controls', label: 'Map Controls', icon: Shield },
  { key: 'evidence', label: 'Upload Evidence', icon: Upload },
  { key: 'review', label: 'Review & Complete', icon: CheckCircle2 },
];

export default function SetupWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>('program');
  const [state, setState] = useState<WizardState>({
    selectedProgramId: null,
    selectedTemplateId: null,
    isNewProgram: false,
    programDetails: { name: '', description: '', owner: '', department: '' },
    selectedRequirementIds: [],
    controlMappings: {},
    uploadedEvidence: [],
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const currentStepIndex = STEPS.findIndex(s => s.key === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 'program':
        return state.selectedProgramId || (state.isNewProgram && state.programDetails.name);
      case 'requirements':
        return state.selectedRequirementIds.length > 0;
      case 'controls':
        return Object.keys(state.controlMappings).length > 0;
      case 'evidence':
        return true; // Evidence is optional
      case 'review':
        return true;
      default:
        return false;
    }
  }, [currentStep, state]);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].key);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].key);
    }
  };

  const handleComplete = () => {
    // Save to localStorage and show success
    localStorage.setItem('wizard-state', JSON.stringify(state));
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/programs');
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      <PageHeader
        title="Program Setup Wizard"
        description="Complete lifecycle setup: Create Program → Add Requirements → Map Controls → Upload Evidence"
        action={
          <Link
            href="/builder"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye size={18} />
            Visual Builder
          </Link>
        }
      />

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
            <p className="text-gray-600 mb-4">Your compliance program has been configured successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to Programs...</p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.key === currentStep;
              const isCompleted = index < currentStepIndex;
              return (
                <div key={step.key} className="flex items-center">
                  <div className={clsx(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    isActive && 'bg-violet-100 text-violet-700',
                    isCompleted && 'bg-emerald-100 text-emerald-700',
                    !isActive && !isCompleted && 'text-gray-400'
                  )}>
                    {isCompleted ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <StepIcon size={16} />
                    )}
                    <span className="hidden sm:inline">{step.label}</span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <ChevronRight size={16} className="mx-2 text-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {currentStep === 'program' && (
            <ProgramStep state={state} setState={setState} />
          )}
          {currentStep === 'requirements' && (
            <RequirementsStep state={state} setState={setState} />
          )}
          {currentStep === 'controls' && (
            <ControlsStep state={state} setState={setState} />
          )}
          {currentStep === 'evidence' && (
            <EvidenceStep state={state} setState={setState} />
          )}
          {currentStep === 'review' && (
            <ReviewStep state={state} />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              currentStepIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          {currentStep === 'review' ? (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg"
            >
              <Rocket size={18} />
              Complete Setup
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={clsx(
                'flex items-center gap-2 px-6 py-2 rounded-lg transition-all',
                canProceed
                  ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              Next
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 1: Program Selection
function ProgramStep({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<'existing' | 'new' | 'template'>('existing');

  const filteredPrograms = programs.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTemplates = programTemplates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select or Create a Program</h2>
        <p className="text-gray-600">Choose an existing program, import from library, or create new</p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-4 justify-center mb-6">
        {[
          { key: 'existing', label: 'Existing Program', icon: Layers },
          { key: 'template', label: 'From Library', icon: FileText },
          { key: 'new', label: 'Create New', icon: Plus },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setMode(key as any)}
            className={clsx(
              'flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all',
              mode === key
                ? 'border-violet-500 bg-violet-50 text-violet-700'
                : 'border-gray-200 hover:border-violet-300'
            )}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={mode === 'new' ? 'Enter program name...' : 'Search...'}
          value={mode === 'new' ? state.programDetails.name : search}
          onChange={(e) => mode === 'new'
            ? setState({ ...state, isNewProgram: true, programDetails: { ...state.programDetails, name: e.target.value } })
            : setSearch(e.target.value)
          }
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
        />
      </div>

      {/* Program Grid */}
      {mode === 'existing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredPrograms.map(program => (
            <button
              key={program.id}
              onClick={() => setState({ ...state, selectedProgramId: program.id, isNewProgram: false })}
              className={clsx(
                'p-4 rounded-xl border-2 text-left transition-all',
                state.selectedProgramId === program.id
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-violet-300'
              )}
            >
              <h3 className="font-semibold text-gray-900">{program.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{program.description}</p>
              <div className="flex gap-3 mt-3 text-xs text-gray-500">
                <span>{program.requirementCount} req</span>
                <span>{program.controls} ctrl</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {mode === 'template' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => setState({ ...state, selectedTemplateId: template.id, isNewProgram: false })}
              className={clsx(
                'p-4 rounded-xl border-2 text-left transition-all',
                state.selectedTemplateId === template.id
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-violet-300'
              )}
            >
              <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">{template.tags?.[0] || template.framework}</span>
              <h3 className="font-semibold text-gray-900 mt-2">{template.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{template.description}</p>
              <div className="flex gap-3 mt-3 text-xs text-gray-500">
                <span>{template.requirementCount} req</span>
                <span>{template.controlCount} ctrl</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {mode === 'new' && state.programDetails.name && (
        <div className="max-w-md mx-auto mt-6 p-4 bg-violet-50 rounded-xl border border-violet-200">
          <p className="text-sm text-violet-700">
            New program &quot;{state.programDetails.name}&quot; will be created
          </p>
        </div>
      )}
    </div>
  );
}

// Step 2: Requirements Selection
function RequirementsStep({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<'select' | 'bulk'>('select');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkPreview, setShowBulkPreview] = useState(false);
  const [parsedRequirements, setParsedRequirements] = useState<any[]>([]);

  const programId = state.selectedProgramId || state.selectedTemplateId;
  const programReqs = requirements.filter(r => r.programId === programId);
  const allReqs = programReqs.length > 0 ? programReqs : requirements.slice(0, 30);

  const filteredReqs = allReqs.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.code.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRequirement = (id: string) => {
    const current = state.selectedRequirementIds;
    const updated = current.includes(id)
      ? current.filter(rid => rid !== id)
      : [...current, id];
    setState({ ...state, selectedRequirementIds: updated });
  };

  const selectAll = () => {
    setState({ ...state, selectedRequirementIds: filteredReqs.map(r => r.id) });
  };

  const handleBulkImport = () => {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(bulkInput);
      const reqs = Array.isArray(parsed) ? parsed : [parsed];
      setParsedRequirements(reqs);
      setShowBulkPreview(true);
    } catch (e) {
      // Try to parse as CSV
      const lines = bulkInput.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const reqs = lines.slice(1).map((line, idx) => {
        const values = line.split(',').map(v => v.trim());
        return {
          id: `bulk-req-${Date.now()}-${idx}`,
          code: values[headers.indexOf('code')] || `REQ-${idx + 1}`,
          title: values[headers.indexOf('title')] || values[0] || 'Untitled Requirement',
          description: values[headers.indexOf('description')] || values[1] || '',
          category: values[headers.indexOf('category')] || 'General',
          status: 'Not Assessed',
          complianceScore: 0,
        };
      });
      setParsedRequirements(reqs);
      setShowBulkPreview(true);
    }
  };

  const confirmBulkImport = () => {
    const newIds = parsedRequirements.map(r => r.id);
    setState({ ...state, selectedRequirementIds: [...state.selectedRequirementIds, ...newIds] });
    setBulkInput('');
    setShowBulkPreview(false);
    setMode('select');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setBulkInput(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Requirements</h2>
        <p className="text-gray-600">Choose the compliance requirements for your program</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-3 justify-center mb-6">
        <button
          onClick={() => setMode('select')}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
            mode === 'select'
              ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
              : 'border-gray-200 hover:border-cyan-300'
          )}
        >
          <CheckCircle2 size={18} />
          Select from Library
        </button>
        <button
          onClick={() => setMode('bulk')}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
            mode === 'bulk'
              ? 'border-violet-500 bg-violet-50 text-violet-700'
              : 'border-gray-200 hover:border-violet-300'
          )}
        >
          <FileUp size={18} />
          Bulk Import
        </button>
      </div>

      {mode === 'select' && (
        <>
          <div className="flex items-center gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search requirements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>
            <button onClick={selectAll} className="px-4 py-2 text-sm text-cyan-600 hover:bg-cyan-50 rounded-lg">
              Select All ({filteredReqs.length})
            </button>
          </div>
        </>
      )}

      {mode === 'select' && (
        <>
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-center">
            <span className="text-cyan-700 font-medium">{state.selectedRequirementIds.length}</span>
            <span className="text-cyan-600"> requirements selected</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
            {filteredReqs.map(req => (
              <button
                key={req.id}
                onClick={() => toggleRequirement(req.id)}
                className={clsx(
                  'p-3 rounded-lg border-2 text-left transition-all',
                  state.selectedRequirementIds.includes(req.id)
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-cyan-300'
                )}
              >
                <div className="flex items-start gap-2">
                  <div className={clsx(
                    'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                    state.selectedRequirementIds.includes(req.id)
                      ? 'border-cyan-500 bg-cyan-500'
                      : 'border-gray-300'
                  )}>
                    {state.selectedRequirementIds.includes(req.id) && (
                      <CheckCircle2 size={12} className="text-white" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-cyan-600">{req.code}</span>
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{req.title}</h4>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {mode === 'bulk' && !showBulkPreview && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-6">
            <h3 className="font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Sparkles size={18} />
              Bulk Import Requirements
            </h3>
            <p className="text-sm text-violet-700 mb-4">
              Import multiple requirements at once using CSV, JSON, or Excel data. Paste your data below or upload a file.
            </p>

            {/* Format Examples */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 border border-violet-200">
                <div className="flex items-center gap-2 mb-2">
                  <Code size={14} className="text-violet-600" />
                  <span className="text-xs font-semibold text-violet-900">JSON Format</span>
                </div>
                <pre className="text-xs text-gray-600 overflow-x-auto">
{`[{
  "code": "REQ-001",
  "title": "Access Control",
  "description": "...",
  "category": "Security"
}]`}
                </pre>
              </div>
              <div className="bg-white rounded-lg p-3 border border-violet-200">
                <div className="flex items-center gap-2 mb-2">
                  <Table size={14} className="text-violet-600" />
                  <span className="text-xs font-semibold text-violet-900">CSV Format</span>
                </div>
                <pre className="text-xs text-gray-600 overflow-x-auto">
{`code,title,description,category
REQ-001,Access Control,...,Security
REQ-002,Data Encryption,...,Security`}
                </pre>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-violet-900 mb-2">Upload File (CSV, JSON, TXT)</label>
              <input
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileUpload}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-200"
              />
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-violet-900 mb-2">Or Paste Data</label>
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="Paste CSV or JSON data here..."
                rows={8}
                className="w-full p-3 border border-violet-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleBulkImport}
                disabled={!bulkInput.trim()}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                  bulkInput.trim()
                    ? 'bg-violet-600 text-white hover:bg-violet-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                <Eye size={16} />
                Preview Import
              </button>
              <button
                onClick={() => setMode('select')}
                className="px-4 py-2 text-violet-600 hover:bg-violet-50 rounded-lg"
              >
                Back to Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'bulk' && showBulkPreview && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} />
              Preview: {parsedRequirements.length} Requirements Ready to Import
            </h3>

            <div className="max-h-[300px] overflow-y-auto space-y-2 mb-4">
              {parsedRequirements.map((req, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border border-emerald-200">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-mono bg-emerald-100 text-emerald-700 px-2 py-1 rounded">{req.code}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900">{req.title}</h4>
                      {req.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{req.description}</p>
                      )}
                      {req.category && (
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{req.category}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmBulkImport}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
              >
                <CheckCircle2 size={16} />
                Confirm Import ({parsedRequirements.length})
              </button>
              <button
                onClick={() => setShowBulkPreview(false)}
                className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
              >
                Edit Data
              </button>
              <button
                onClick={() => {
                  setBulkInput('');
                  setShowBulkPreview(false);
                  setParsedRequirements([]);
                  setMode('select');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selection Count (always visible) */}
      {state.selectedRequirementIds.length > 0 && (
        <div className="fixed bottom-20 right-6 bg-cyan-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span className="font-medium">{state.selectedRequirementIds.length} requirements selected</span>
        </div>
      )}
    </div>
  );
}


// Step 3: Controls Mapping
function ControlsStep({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  const [selectedReqId, setSelectedReqId] = useState<string | null>(state.selectedRequirementIds[0] || null);
  const [searchControl, setSearchControl] = useState('');

  const selectedReqs = requirements.filter(r => state.selectedRequirementIds.includes(r.id));
  const selectedReq = requirements.find(r => r.id === selectedReqId);

  const mappedControlIds = state.controlMappings[selectedReqId || ''] || [];
  const availableControls = controls.filter(c =>
    !mappedControlIds.includes(c.id) &&
    (c.name.toLowerCase().includes(searchControl.toLowerCase()) ||
     c.code.toLowerCase().includes(searchControl.toLowerCase()))
  ).slice(0, 15);

  const linkControl = (controlId: string) => {
    if (!selectedReqId) return;
    const current = state.controlMappings[selectedReqId] || [];
    setState({
      ...state,
      controlMappings: { ...state.controlMappings, [selectedReqId]: [...current, controlId] }
    });
  };

  const unlinkControl = (controlId: string) => {
    if (!selectedReqId) return;
    const current = state.controlMappings[selectedReqId] || [];
    setState({
      ...state,
      controlMappings: { ...state.controlMappings, [selectedReqId]: current.filter(id => id !== controlId) }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Map Controls to Requirements</h2>
        <p className="text-gray-600">Link security controls to each requirement</p>
      </div>

      <div className="grid grid-cols-2 gap-6 h-[450px]">
        {/* Left: Requirements List */}
        <div className="bg-white border rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b bg-cyan-50">
            <h3 className="font-semibold text-gray-900">Requirements ({selectedReqs.length})</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {selectedReqs.map(req => (
              <button
                key={req.id}
                onClick={() => setSelectedReqId(req.id)}
                className={clsx(
                  'w-full p-3 rounded-lg text-left transition-all',
                  selectedReqId === req.id ? 'bg-cyan-100 border-2 border-cyan-500' : 'hover:bg-gray-50 border-2 border-transparent'
                )}
              >
                <span className="text-xs font-mono text-cyan-600">{req.code}</span>
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{req.title}</h4>
                <span className="text-xs text-gray-500">
                  {(state.controlMappings[req.id] || []).length} controls mapped
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="bg-white border rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b bg-emerald-50">
            <h3 className="font-semibold text-gray-900 mb-2">
              Controls for: <span className="text-emerald-600">{selectedReq?.code || 'Select requirement'}</span>
            </h3>
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search controls..."
                value={searchControl}
                onChange={(e) => setSearchControl(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-sm border rounded-lg"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {/* Mapped Controls */}
            {mappedControlIds.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1">Linked</p>
                {mappedControlIds.map(cid => {
                  const ctrl = controls.find(c => c.id === cid);
                  if (!ctrl) return null;
                  return (
                    <div key={cid} className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center mb-1">
                      <div>
                        <span className="text-xs font-mono text-emerald-600">{ctrl.code}</span>
                        <p className="text-sm font-medium">{ctrl.name}</p>
                      </div>
                      <button onClick={() => unlinkControl(cid)} className="p-1 hover:bg-emerald-100 rounded">
                        <X size={14} className="text-gray-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Available Controls */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1">Available</p>
              {availableControls.map(ctrl => (
                <div key={ctrl.id} className="p-2 bg-gray-50 border rounded-lg flex justify-between items-center mb-1 hover:border-emerald-300">
                  <div>
                    <span className="text-xs font-mono text-gray-500">{ctrl.code}</span>
                    <p className="text-sm font-medium">{ctrl.name}</p>
                  </div>
                  <button onClick={() => linkControl(ctrl.id)} className="p-1 hover:bg-emerald-100 rounded text-emerald-600">
                    <Plus size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// Step 4: Evidence Upload
function EvidenceStep({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  const mappedControls = Object.values(state.controlMappings).flat();
  const uniqueControlIds = [...new Set(mappedControls)];
  const mappedControlList = controls.filter(c => uniqueControlIds.includes(c.id));

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Evidence</h2>
        <p className="text-gray-600">Attach supporting evidence to your mapped controls (optional)</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <Upload size={24} className="mx-auto text-amber-600 mb-2" />
        <p className="text-amber-800 font-medium">Evidence upload is optional</p>
        <p className="text-amber-600 text-sm">You can add evidence later from the control detail pages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto">
        {mappedControlList.map(ctrl => (
          <div key={ctrl.id} className="p-4 bg-white border rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono text-emerald-600">{ctrl.code}</span>
                <h4 className="font-medium text-gray-900">{ctrl.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{ctrl.category}</p>
                <div className="mt-3">
                  <label className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                    <Upload size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Upload evidence</span>
                    <input type="file" className="hidden" multiple />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mappedControlList.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <Shield size={48} className="mx-auto mb-3 opacity-50" />
          <p>No controls mapped yet. Go back to map controls first.</p>
        </div>
      )}
    </div>
  );
}

// Step 5: Review
function ReviewStep({ state }: { state: WizardState }) {
  const selectedProgram = programs.find(p => p.id === state.selectedProgramId);
  const selectedTemplate = programTemplates.find(t => t.id === state.selectedTemplateId);
  const selectedReqs = requirements.filter(r => state.selectedRequirementIds.includes(r.id));
  const totalControls = [...new Set(Object.values(state.controlMappings).flat())].length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
          <Sparkles size={28} className="text-violet-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Setup</h2>
        <p className="text-gray-600">Confirm your compliance program configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Program */}
        <div className="p-5 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Layers size={18} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Program</h3>
          </div>
          <p className="text-lg font-medium text-indigo-900">
            {state.isNewProgram ? state.programDetails.name : (selectedProgram?.name || selectedTemplate?.name || 'Not selected')}
          </p>
          {state.isNewProgram && <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded mt-2 inline-block">New Program</span>}
        </div>

        {/* Requirements */}
        <div className="p-5 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center">
              <FileText size={18} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Requirements</h3>
          </div>
          <p className="text-3xl font-bold text-cyan-900">{state.selectedRequirementIds.length}</p>
          <p className="text-sm text-cyan-600">requirements selected</p>
        </div>

        {/* Controls */}
        <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Controls</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-900">{totalControls}</p>
          <p className="text-sm text-emerald-600">controls mapped</p>
        </div>

        {/* Mappings */}
        <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center">
              <ArrowRight size={18} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Mappings</h3>
          </div>
          <p className="text-3xl font-bold text-amber-900">{Object.keys(state.controlMappings).length}</p>
          <p className="text-sm text-amber-600">requirements with controls</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-6 text-white text-center">
        <Rocket size={32} className="mx-auto mb-3" />
        <h3 className="text-xl font-bold mb-2">Ready to Launch!</h3>
        <p className="text-violet-100">Click &quot;Complete Setup&quot; to finalize your compliance program</p>
      </div>
    </div>
  );
}
