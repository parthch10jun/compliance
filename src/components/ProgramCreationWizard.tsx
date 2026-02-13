'use client';

import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Download, Sparkles, Upload, FileText, Building2, User, Tag, Shield, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface ProgramCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (programData: any) => void;
}

type CreationMethod = 'import' | 'ai' | null;
type Step = 'method' | 'regulator' | 'framework' | 'details' | 'ai-upload' | 'ai-analysis' | 'ai-review' | 'complete';

interface WizardState {
  method: CreationMethod;
  currentStep: Step;
  selectedRegulator: string | null;
  selectedFramework: string | null;
  programDetails: {
    name: string;
    owner: string;
    department: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    tags: string[];
  };
  aiData: {
    uploadType: 'framework' | 'pdf' | 'memo' | null;
    file: File | null;
    selectedFramework: string | null;
    analysisResult: any | null;
  };
}

const regulators = [
  { id: 'cbuae', name: 'CBUAE', fullName: 'Central Bank of UAE', region: 'UAE', icon: '🏦', color: 'emerald' },
  { id: 'rbi', name: 'RBI', fullName: 'Reserve Bank of India', region: 'India', icon: '🏛️', color: 'blue' },
  { id: 'sdaia', name: 'SDAIA', fullName: 'Saudi Data & AI Authority', region: 'Saudi Arabia', icon: '🛡️', color: 'purple' },
  { id: 'eu', name: 'EU', fullName: 'European Union', region: 'Europe', icon: '🇪🇺', color: 'indigo' },
  { id: 'sec', name: 'SEC', fullName: 'Securities and Exchange Commission', region: 'USA', icon: '📊', color: 'red' },
  { id: 'nist', name: 'NIST', fullName: 'National Institute of Standards', region: 'USA', icon: '🔬', color: 'cyan' },
];

const frameworksByRegulator: Record<string, any[]> = {
  cbuae: [
    { id: 'cbuae-itgov', name: 'IT Governance Framework', requirements: 52, obligations: 10, controls: 45 },
    { id: 'cbuae-cyber', name: 'Cyber Security Framework', requirements: 48, obligations: 8, controls: 42 },
    { id: 'cbuae-outsourcing', name: 'Outsourcing Regulations', requirements: 35, obligations: 6, controls: 28 },
  ],
  rbi: [
    { id: 'rbi-itgov', name: 'IT Governance Framework', requirements: 45, obligations: 8, controls: 38 },
    { id: 'rbi-csf', name: 'Cyber Security Framework', requirements: 52, obligations: 12, controls: 45 },
    { id: 'rbi-outsourcing', name: 'Outsourcing Guidelines', requirements: 38, obligations: 7, controls: 32 },
  ],
  sdaia: [
    { id: 'pdpl', name: 'Personal Data Protection Law', requirements: 38, obligations: 8, controls: 28 },
    { id: 'ecc', name: 'Essential Cybersecurity Controls', requirements: 114, obligations: 15, controls: 98 },
  ],
  eu: [
    { id: 'gdpr', name: 'General Data Protection Regulation', requirements: 68, obligations: 15, controls: 42 },
    { id: 'nis2', name: 'NIS2 Directive', requirements: 45, obligations: 9, controls: 38 },
    { id: 'dora', name: 'Digital Operational Resilience Act', requirements: 56, obligations: 11, controls: 48 },
  ],
  sec: [
    { id: 'sox', name: 'Sarbanes-Oxley Act', requirements: 42, obligations: 6, controls: 58 },
  ],
  nist: [
    { id: 'nist-csf', name: 'Cybersecurity Framework 2.0', requirements: 108, obligations: 0, controls: 108 },
    { id: 'nist-800-53', name: 'Security Controls (800-53)', requirements: 325, obligations: 0, controls: 325 },
  ],
};

const departmentOptions = [
  'Information Security',
  'IT',
  'Legal',
  'Compliance',
  'Risk Management',
  'Operations',
  'Finance',
  'Human Resources'
];

export function ProgramCreationWizard({ isOpen, onClose, onComplete }: ProgramCreationWizardProps) {
  const [state, setState] = useState<WizardState>({
    method: null,
    currentStep: 'method',
    selectedRegulator: null,
    selectedFramework: null,
    programDetails: {
      name: '',
      owner: '',
      department: '',
      priority: 'Medium',
      tags: []
    },
    aiData: {
      uploadType: null,
      file: null,
      selectedFramework: null,
      analysisResult: null,
    }
  });

  const [tagInput, setTagInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setState({
      method: null,
      currentStep: 'method',
      selectedRegulator: null,
      selectedFramework: null,
      programDetails: {
        name: '',
        owner: '',
        department: '',
        priority: 'Medium',
        tags: []
      },
      aiData: {
        uploadType: null,
        file: null,
        selectedFramework: null,
        analysisResult: null,
      }
    });
    setTagInput('');
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !state.programDetails.tags.includes(tagInput.trim())) {
      setState({
        ...state,
        programDetails: {
          ...state.programDetails,
          tags: [...state.programDetails.tags, tagInput.trim()]
        }
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setState({
      ...state,
      programDetails: {
        ...state.programDetails,
        tags: state.programDetails.tags.filter(tag => tag !== tagToRemove)
      }
    });
  };

  const handleMethodSelect = (method: CreationMethod) => {
    setState({
      ...state,
      method,
      currentStep: method === 'import' ? 'regulator' : 'ai-upload'
    });
  };

  const handleRegulatorSelect = (regulatorId: string) => {
    setState({
      ...state,
      selectedRegulator: regulatorId,
      currentStep: 'framework'
    });
  };

  const handleFrameworkSelect = (frameworkId: string) => {
    const framework = frameworksByRegulator[state.selectedRegulator!]?.find(f => f.id === frameworkId);
    setState({
      ...state,
      selectedFramework: frameworkId,
      programDetails: {
        ...state.programDetails,
        name: framework?.name || ''
      },
      currentStep: 'details'
    });
  };

  const handleAIUpload = async (type: 'framework' | 'pdf' | 'memo', file?: File, frameworkId?: string) => {
    setState({
      ...state,
      aiData: {
        ...state.aiData,
        uploadType: type,
        file: file || null,
        selectedFramework: frameworkId || null
      },
      currentStep: 'ai-analysis'
    });

    // Simulate AI analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        aiData: {
          ...prev.aiData,
          analysisResult: {
            authorityName: type === 'framework' ? 'CBUAE' : 'Detected Authority',
            framework: type === 'framework' ? frameworkId : 'Custom Framework',
            requirements: 45,
            obligations: 8,
            controls: 38,
            implementationSteps: [
              { phase: 'Planning', tasks: 12, duration: '2 weeks' },
              { phase: 'Implementation', tasks: 28, duration: '6 weeks' },
              { phase: 'Testing', tasks: 15, duration: '3 weeks' },
              { phase: 'Monitoring', tasks: 8, duration: 'Ongoing' },
            ],
            suggestedOwner: 'Compliance Team',
            suggestedPriority: 'High' as const,
            gaps: ['Missing incident response procedures', 'Incomplete access control documentation']
          }
        },
        currentStep: 'ai-review'
      }));
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleComplete = () => {
    const programData = {
      ...state.programDetails,
      method: state.method,
      regulator: state.selectedRegulator,
      framework: state.selectedFramework,
      aiAnalysis: state.aiData.analysisResult
    };
    onComplete(programData);
    handleClose();
  };

  const goBack = () => {
    const stepFlow: Record<Step, Step> = {
      'method': 'method',
      'regulator': 'method',
      'framework': 'regulator',
      'details': state.method === 'import' ? 'framework' : 'ai-review',
      'ai-upload': 'method',
      'ai-analysis': 'ai-upload',
      'ai-review': 'ai-analysis',
      'complete': 'details'
    };
    setState({ ...state, currentStep: stepFlow[state.currentStep] });
  };

  const getStepTitle = () => {
    const titles: Record<Step, string> = {
      'method': 'Choose Creation Method',
      'regulator': 'Select Regulator',
      'framework': 'Select Framework',
      'details': 'Program Details',
      'ai-upload': 'Upload Document',
      'ai-analysis': 'Analyzing Document',
      'ai-review': 'Review AI Analysis',
      'complete': 'Complete'
    };
    return titles[state.currentStep];
  };

  const getProgressPercentage = () => {
    const steps = state.method === 'import'
      ? ['method', 'regulator', 'framework', 'details']
      : ['method', 'ai-upload', 'ai-analysis', 'ai-review', 'details'];
    const currentIndex = steps.indexOf(state.currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div className="flex-1">
            <h2 className="text-h2 font-bold text-[var(--foreground)]">{getStepTitle()}</h2>
            <p className="text-p3 text-[var(--foreground-muted)] mt-1">
              {state.method === 'import' ? 'Import from regulatory library' : state.method === 'ai' ? 'AI-powered program creation' : 'Create a new compliance program'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        {state.currentStep !== 'method' && (
          <div className="px-6 pt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {state.currentStep === 'method' && <MethodSelectionStep onSelect={handleMethodSelect} />}
          {state.currentStep === 'regulator' && <RegulatorSelectionStep onSelect={handleRegulatorSelect} />}
          {state.currentStep === 'framework' && state.selectedRegulator && (
            <FrameworkSelectionStep
              regulatorId={state.selectedRegulator}
              frameworks={frameworksByRegulator[state.selectedRegulator]}
              onSelect={handleFrameworkSelect}
            />
          )}
          {state.currentStep === 'ai-upload' && <AIUploadStep onUpload={handleAIUpload} />}
          {state.currentStep === 'ai-analysis' && <AIAnalysisStep isAnalyzing={isAnalyzing} />}
          {state.currentStep === 'ai-review' && state.aiData.analysisResult && (
            <AIReviewStep
              analysis={state.aiData.analysisResult}
              onContinue={() => setState({ ...state, currentStep: 'details' })}
            />
          )}
          {state.currentStep === 'details' && (
            <ProgramDetailsStep
              details={state.programDetails}
              onChange={(details) => setState({ ...state, programDetails: details })}
              tagInput={tagInput}
              onTagInputChange={setTagInput}
              onAddTag={addTag}
              onRemoveTag={removeTag}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[var(--border)] bg-[var(--background-secondary)]">
          <button
            onClick={state.currentStep === 'method' ? handleClose : goBack}
            className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] rounded-lg font-medium text-p2 hover:bg-[var(--background)] transition-colors"
          >
            <ChevronLeft size={18} />
            {state.currentStep === 'method' ? 'Cancel' : 'Back'}
          </button>

          {state.currentStep === 'details' && (
            <button
              onClick={handleComplete}
              disabled={!state.programDetails.name || !state.programDetails.owner}
              className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-lg font-medium text-p2 hover:bg-violet-700 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles size={18} />
              Create Program
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step Components
function MethodSelectionStep({ onSelect }: { onSelect: (method: CreationMethod) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-2">How would you like to create your program?</h3>
        <p className="text-p2 text-[var(--foreground-muted)]">Choose the method that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Import from Library */}
        <button
          onClick={() => onSelect('import')}
          className="group relative bg-gradient-to-br from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 border-2 border-cyan-200 hover:border-cyan-400 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl"
        >
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download size={24} className="text-white" />
            </div>
          </div>

          <div className="pr-16">
            <h4 className="text-h4 font-bold text-cyan-900 mb-3">Import from Library</h4>
            <p className="text-p3 text-cyan-800 mb-4">
              Select from pre-configured regulatory frameworks and standards
            </p>
            <ul className="space-y-2 text-p3 text-cyan-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-cyan-600" />
                Choose your regulator
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-cyan-600" />
                Select framework
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-cyan-600" />
                Pre-loaded requirements & controls
              </li>
            </ul>
          </div>

          <div className="mt-6 flex items-center gap-2 text-cyan-700 font-medium group-hover:gap-3 transition-all">
            Get Started <ChevronRight size={18} />
          </div>
        </button>

        {/* AI-Powered Creation */}
        <button
          onClick={() => onSelect('ai')}
          className="group relative bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 border-2 border-violet-200 hover:border-violet-400 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl"
        >
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles size={24} className="text-white" />
            </div>
          </div>

          <div className="pr-16">
            <h4 className="text-h4 font-bold text-violet-900 mb-3">Create with AI</h4>
            <p className="text-p3 text-violet-800 mb-4">
              Upload documents and let AI extract requirements automatically
            </p>
            <ul className="space-y-2 text-p3 text-violet-700">
              <li className="flex items-center gap-2">
                <Sparkles size={16} className="text-violet-600" />
                Upload PDF, memo, or select framework
              </li>
              <li className="flex items-center gap-2">
                <Sparkles size={16} className="text-violet-600" />
                AI extracts requirements & obligations
              </li>
              <li className="flex items-center gap-2">
                <Sparkles size={16} className="text-violet-600" />
                Suggests controls & implementation steps
              </li>
            </ul>
          </div>

          <div className="mt-6 flex items-center gap-2 text-violet-700 font-medium group-hover:gap-3 transition-all">
            Get Started <ChevronRight size={18} />
          </div>
        </button>
      </div>
    </div>
  );
}

function RegulatorSelectionStep({ onSelect }: { onSelect: (regulatorId: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-2">Select Your Regulator</h3>
        <p className="text-p2 text-[var(--foreground-muted)]">Choose the regulatory authority for your program</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regulators.map((regulator) => (
          <button
            key={regulator.id}
            onClick={() => onSelect(regulator.id)}
            className={clsx(
              'group p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg',
              `border-${regulator.color}-200 hover:border-${regulator.color}-400 bg-${regulator.color}-50 hover:bg-${regulator.color}-100`
            )}
          >
            <div className="text-4xl mb-3">{regulator.icon}</div>
            <h4 className="text-h4 font-bold text-[var(--foreground)] mb-1">{regulator.name}</h4>
            <p className="text-p3 text-[var(--foreground-muted)] mb-2">{regulator.fullName}</p>
            <div className="flex items-center gap-2 text-p3 text-[var(--foreground-muted)]">
              <Building2 size={14} />
              {regulator.region}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FrameworkSelectionStep({
  regulatorId,
  frameworks,
  onSelect
}: {
  regulatorId: string;
  frameworks: any[];
  onSelect: (frameworkId: string) => void;
}) {
  const regulator = regulators.find(r => r.id === regulatorId);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-2">Select Framework</h3>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Choose a framework from <span className="font-semibold">{regulator?.fullName}</span>
        </p>
      </div>

      <div className="space-y-3">
        {frameworks.map((framework) => (
          <button
            key={framework.id}
            onClick={() => onSelect(framework.id)}
            className="group w-full p-5 rounded-xl border-2 border-[var(--border)] hover:border-cyan-400 bg-white hover:bg-cyan-50 transition-all duration-200 text-left"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-h4 font-bold text-[var(--foreground)] mb-2 group-hover:text-cyan-700">
                  {framework.name}
                </h4>
                <div className="flex items-center gap-6 text-p3 text-[var(--foreground-muted)]">
                  <div className="flex items-center gap-2">
                    <FileText size={14} />
                    <span>{framework.requirements} Requirements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={14} />
                    <span>{framework.controls} Controls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} />
                    <span>{framework.obligations} Obligations</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-[var(--foreground-muted)] group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AIUploadStep({ onUpload }: { onUpload: (type: 'framework' | 'pdf' | 'memo', file?: File, frameworkId?: string) => void }) {
  const [uploadType, setUploadType] = useState<'framework' | 'pdf' | 'memo' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleContinue = () => {
    if (uploadType === 'framework' && selectedFramework) {
      onUpload('framework', undefined, selectedFramework);
    } else if ((uploadType === 'pdf' || uploadType === 'memo') && selectedFile) {
      onUpload(uploadType, selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-2">Upload Document or Select Framework</h3>
        <p className="text-p2 text-[var(--foreground-muted)]">AI will analyze and extract compliance requirements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setUploadType('framework')}
          className={clsx(
            'p-6 rounded-xl border-2 transition-all text-center',
            uploadType === 'framework'
              ? 'border-violet-400 bg-violet-50'
              : 'border-[var(--border)] hover:border-violet-200 hover:bg-violet-50/50'
          )}
        >
          <Shield size={32} className="mx-auto mb-3 text-violet-600" />
          <h4 className="font-semibold mb-1">Regulatory Framework</h4>
          <p className="text-p3 text-[var(--foreground-muted)]">Select from library</p>
        </button>

        <button
          onClick={() => setUploadType('pdf')}
          className={clsx(
            'p-6 rounded-xl border-2 transition-all text-center',
            uploadType === 'pdf'
              ? 'border-violet-400 bg-violet-50'
              : 'border-[var(--border)] hover:border-violet-200 hover:bg-violet-50/50'
          )}
        >
          <FileText size={32} className="mx-auto mb-3 text-violet-600" />
          <h4 className="font-semibold mb-1">PDF Document</h4>
          <p className="text-p3 text-[var(--foreground-muted)]">Upload regulation PDF</p>
        </button>

        <button
          onClick={() => setUploadType('memo')}
          className={clsx(
            'p-6 rounded-xl border-2 transition-all text-center',
            uploadType === 'memo'
              ? 'border-violet-400 bg-violet-50'
              : 'border-[var(--border)] hover:border-violet-200 hover:bg-violet-50/50'
          )}
        >
          <Upload size={32} className="mx-auto mb-3 text-violet-600" />
          <h4 className="font-semibold mb-1">Memo/Text</h4>
          <p className="text-p3 text-[var(--foreground-muted)]">Upload text document</p>
        </button>
      </div>

      {uploadType === 'framework' && (
        <div className="mt-6">
          <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
            Select Framework
          </label>
          <select
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-p2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
          >
            <option value="">Choose a framework...</option>
            <option value="cbuae-itgov">CBUAE IT Governance Framework</option>
            <option value="rbi-csf">RBI Cyber Security Framework</option>
            <option value="gdpr">GDPR</option>
            <option value="nist-csf">NIST Cybersecurity Framework</option>
          </select>
        </div>
      )}

      {(uploadType === 'pdf' || uploadType === 'memo') && (
        <div className="mt-6">
          <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
            Upload File
          </label>
          <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-violet-400 hover:bg-violet-50/50 transition-all">
            <Upload size={48} className="mx-auto mb-4 text-[var(--foreground-muted)]" />
            <input
              type="file"
              onChange={handleFileChange}
              accept={uploadType === 'pdf' ? '.pdf' : '.txt,.doc,.docx'}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-p2 font-medium text-violet-600 hover:text-violet-700">
                Click to upload
              </span>
              <span className="text-p2 text-[var(--foreground-muted)]"> or drag and drop</span>
            </label>
            {selectedFile && (
              <p className="mt-3 text-p3 text-[var(--foreground)]">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        </div>
      )}

      {uploadType && (
        <button
          onClick={handleContinue}
          disabled={
            (uploadType === 'framework' && !selectedFramework) ||
            ((uploadType === 'pdf' || uploadType === 'memo') && !selectedFile)
          }
          className="w-full mt-6 px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Sparkles size={18} />
          Analyze with AI
        </button>
      )}
    </div>
  );
}

function AIAnalysisStep({ isAnalyzing }: { isAnalyzing: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
          <Sparkles size={48} className={clsx(
            'text-violet-600',
            isAnalyzing && 'animate-pulse'
          )} />
        </div>
        {isAnalyzing && (
          <div className="absolute inset-0 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
        )}
      </div>

      <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-2">
        {isAnalyzing ? 'Analyzing Document...' : 'Analysis Complete'}
      </h3>
      <p className="text-p2 text-[var(--foreground-muted)] text-center max-w-md">
        {isAnalyzing
          ? 'AI is extracting requirements, obligations, and controls from your document'
          : 'Document analysis completed successfully'
        }
      </p>

      {isAnalyzing && (
        <div className="mt-8 space-y-3 w-full max-w-md">
          <div className="flex items-center gap-3 text-p3">
            <Loader2 size={16} className="animate-spin text-violet-600" />
            <span>Identifying regulatory authority...</span>
          </div>
          <div className="flex items-center gap-3 text-p3">
            <Loader2 size={16} className="animate-spin text-violet-600" />
            <span>Extracting requirements and obligations...</span>
          </div>
          <div className="flex items-center gap-3 text-p3">
            <Loader2 size={16} className="animate-spin text-violet-600" />
            <span>Mapping controls and tests...</span>
          </div>
          <div className="flex items-center gap-3 text-p3">
            <Loader2 size={16} className="animate-spin text-violet-600" />
            <span>Generating implementation plan...</span>
          </div>
        </div>
      )}
    </div>
  );
}

function AIReviewStep({ analysis, onContinue }: { analysis: any; onContinue: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4">
          <CheckCircle2 size={18} />
          <span className="font-medium">Analysis Complete</span>
        </div>
        <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-2">Review AI Analysis</h3>
        <p className="text-p2 text-[var(--foreground-muted)]">Verify the extracted information before proceeding</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
          <div className="text-p3 text-violet-700 mb-1">Authority Detected</div>
          <div className="text-h4 font-bold text-violet-900">{analysis.authorityName}</div>
        </div>
        <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
          <div className="text-p3 text-violet-700 mb-1">Framework</div>
          <div className="text-h4 font-bold text-violet-900">{analysis.framework}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-[var(--border)] rounded-xl text-center">
          <div className="text-h2 font-bold text-[var(--foreground)] mb-1">{analysis.requirements}</div>
          <div className="text-p3 text-[var(--foreground-muted)]">Requirements</div>
        </div>
        <div className="p-4 bg-white border border-[var(--border)] rounded-xl text-center">
          <div className="text-h2 font-bold text-[var(--foreground)] mb-1">{analysis.obligations}</div>
          <div className="text-p3 text-[var(--foreground-muted)]">Obligations</div>
        </div>
        <div className="p-4 bg-white border border-[var(--border)] rounded-xl text-center">
          <div className="text-h2 font-bold text-[var(--foreground)] mb-1">{analysis.controls}</div>
          <div className="text-p3 text-[var(--foreground-muted)]">Controls</div>
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-xl p-5">
        <h4 className="font-semibold text-[var(--foreground)] mb-3">Implementation Plan</h4>
        <div className="space-y-3">
          {analysis.implementationSteps.map((step: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-[var(--background-secondary)] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-sm">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-medium text-[var(--foreground)]">{step.phase}</div>
                  <div className="text-p3 text-[var(--foreground-muted)]">{step.tasks} tasks</div>
                </div>
              </div>
              <div className="text-p3 text-[var(--foreground-muted)]">{step.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {analysis.gaps && analysis.gaps.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} />
            Identified Gaps
          </h4>
          <ul className="space-y-2">
            {analysis.gaps.map((gap: string, idx: number) => (
              <li key={idx} className="text-p3 text-amber-800 flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onContinue}
        className="w-full px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
      >
        Continue to Program Details
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function ProgramDetailsStep({
  details,
  onChange,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag
}: {
  details: WizardState['programDetails'];
  onChange: (details: WizardState['programDetails']) => void;
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-2">Program Details</h3>
        <p className="text-p2 text-[var(--foreground-muted)]">Configure your program settings</p>
      </div>

      {/* Program Name */}
      <div>
        <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
          Program Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={details.name}
          onChange={(e) => onChange({ ...details, name: e.target.value })}
          className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-p2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
          placeholder="e.g., CBUAE IT Governance Program"
        />
      </div>

      {/* Owner */}
      <div>
        <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
          Program Owner <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <input
            type="text"
            value={details.owner}
            onChange={(e) => onChange({ ...details, owner: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg text-p2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
            placeholder="Enter owner name"
          />
        </div>
      </div>

      {/* Department */}
      <div>
        <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
          Department
        </label>
        <div className="relative">
          <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <select
            value={details.department}
            onChange={(e) => onChange({ ...details, department: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg text-p2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all appearance-none"
          >
            <option value="">Select department...</option>
            {departmentOptions.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
          Priority
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(['Low', 'Medium', 'High', 'Critical'] as const).map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => onChange({ ...details, priority })}
              className={clsx(
                'px-4 py-2.5 rounded-lg font-medium text-p3 transition-all',
                details.priority === priority
                  ? priority === 'Critical' ? 'bg-red-600 text-white'
                    : priority === 'High' ? 'bg-orange-600 text-white'
                    : priority === 'Medium' ? 'bg-yellow-600 text-white'
                    : 'bg-green-600 text-white'
                  : 'bg-[var(--background-secondary)] text-[var(--foreground)] hover:bg-[var(--background-tertiary)]'
              )}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-p2 font-medium text-[var(--foreground)] mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => onTagInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onAddTag();
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg text-p2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
              placeholder="Add tags..."
            />
          </div>
          <button
            type="button"
            onClick={onAddTag}
            className="px-4 py-2.5 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg font-medium text-p2 hover:bg-[var(--background-tertiary)] transition-colors"
          >
            Add
          </button>
        </div>
        {details.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {details.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-p3 font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="hover:text-violet-900 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

