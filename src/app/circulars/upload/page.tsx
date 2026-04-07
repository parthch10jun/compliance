'use client';

import { useState } from 'react';
import { PageHeader } from '@/components';
import {
  Upload, FileText, Sparkles, CheckCircle2, AlertCircle, Loader2,
  ArrowRight, ArrowLeft, Brain, Users, Calendar, Target, Download,
  Eye, Edit, Trash2, Plus, Send
} from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

type UploadStep = 'upload' | 'processing' | 'review' | 'assign' | 'complete';

interface ExtractedAction {
  id: string;
  title: string;
  description: string;
  deadline: string;
  section: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  applicableTo: string[];
  assignedTo?: string;
  approved: boolean;
  confidence: number;
}

interface CircularMetadata {
  issuer: string;
  circularNumber: string;
  title: string;
  issueDate: string;
  category: string;
}

const stakeholders = [
  { id: 'sarah', name: 'Sarah Johnson', email: 'sarah.johnson@rblbank.com', role: 'Compliance Manager', department: 'Compliance' },
  { id: 'michael', name: 'Michael Chen', email: 'michael.chen@rblbank.com', role: 'Risk Manager', department: 'Risk' },
  { id: 'raj', name: 'Raj Kumar', email: 'raj.kumar@rblbank.com', role: 'IT Security Lead', department: 'IT Security' },
  { id: 'priya', name: 'Priya Sharma', email: 'priya.sharma@rblbank.com', role: 'Legal Counsel', department: 'Legal' },
  { id: 'rahul', name: 'Rahul Verma', email: 'rahul.verma@rblbank.com', role: 'Operations Manager', department: 'Operations' }
];

export default function CircularUploadPage() {
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  // Mock extracted data (simulating AI extraction)
  const [circularMetadata, setCircularMetadata] = useState<CircularMetadata>({
    issuer: 'RBI',
    circularNumber: 'RBI/2025-26/15',
    title: 'Master Direction on IT Governance, Risk, Controls & Assurance Practices - Amendment',
    issueDate: '2025-01-20',
    category: 'IT Governance'
  });

  const [extractedActions, setExtractedActions] = useState<ExtractedAction[]>([
    {
      id: 'act-1',
      title: 'Implement AI/ML Model Risk Management Framework',
      description: 'Banks and NBFCs must establish comprehensive governance framework for AI/ML models including model validation, performance monitoring, and bias detection mechanisms',
      deadline: '2025-07-31',
      section: 'Section 4.2.1 - AI/ML Governance',
      priority: 'Critical',
      applicableTo: ['RBL Bank - IT Department', 'RBL Bank - Risk Department', 'RBL Bank - Compliance'],
      approved: false,
      confidence: 96
    },
    {
      id: 'act-2',
      title: 'Conduct Third-Party Cloud Service Provider Audit',
      description: 'Annual audit of all third-party cloud service providers storing customer data, with specific focus on data residency, encryption, and access controls',
      deadline: '2025-06-30',
      section: 'Section 5.3.2 - Third Party Management',
      priority: 'High',
      applicableTo: ['RBL Bank - IT Department', 'RBL Bank - Internal Audit'],
      approved: false,
      confidence: 94
    },
    {
      id: 'act-3',
      title: 'Update Incident Response Plan for Ransomware Scenarios',
      description: 'Revise and test incident response procedures specifically for ransomware attacks, including communication protocols, backup restoration procedures, and regulatory reporting timelines',
      deadline: '2025-05-15',
      section: 'Section 6.1.4 - Incident Management',
      priority: 'High',
      applicableTo: ['RBL Bank - IT Security', 'RBL Bank - Business Continuity'],
      approved: false,
      confidence: 92
    },
    {
      id: 'act-4',
      title: 'Submit Annual IT Strategy and Budget to Board',
      description: 'Present comprehensive IT strategy document covering digital transformation initiatives, cybersecurity investments, and technology risk mitigation plans to the Board for approval',
      deadline: '2025-04-30',
      section: 'Section 2.1.3 - Board Oversight',
      priority: 'Critical',
      applicableTo: ['RBL Bank - CIO Office', 'RBL Bank - Board'],
      approved: false,
      confidence: 98
    }
  ]);

  const [selectedAction, setSelectedAction] = useState<ExtractedAction | null>(null);

  // Simulate file upload and AI processing
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setCurrentStep('processing');
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate AI processing with progress updates
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setCurrentStep('review');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      handleFileUpload(file);
    }
  };

  const approveAction = (actionId: string) => {
    setExtractedActions(prev =>
      prev.map(action =>
        action.id === actionId ? { ...action, approved: !action.approved } : action
      )
    );
  };

  const assignStakeholder = (actionId: string, stakeholderId: string) => {
    setExtractedActions(prev =>
      prev.map(action =>
        action.id === actionId ? { ...action, assignedTo: stakeholderId } : action
      )
    );
  };

  const approvedCount = extractedActions.filter(a => a.approved).length;
  const assignedCount = extractedActions.filter(a => a.assignedTo).length;

  return (
    <div className="max-w-full">
      <PageHeader
        title="Upload Regulatory Circular"
        description="AI-powered extraction and dissemination of compliance actions"
        breadcrumbs={[
          { label: 'Regulatory Intelligence', href: '/regulatory-intelligence' },
          { label: 'Circulars', href: '/circulars' },
          { label: 'Upload' }
        ]}
      />

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-between relative">
            {[
              { step: 'upload', label: 'Upload PDF', icon: Upload },
              { step: 'processing', label: 'AI Processing', icon: Brain },
              { step: 'review', label: 'Review Actions', icon: Eye },
              { step: 'assign', label: 'Assign Stakeholders', icon: Users },
              { step: 'complete', label: 'Complete', icon: CheckCircle2 }
            ].map((item, idx) => {
              const Icon = item.icon;
              const stepIndex = ['upload', 'processing', 'review', 'assign', 'complete'].indexOf(currentStep);
              const itemIndex = idx;
              const isActive = stepIndex === itemIndex;
              const isComplete = stepIndex > itemIndex;

              return (
                <div key={item.step} className="flex flex-col items-center relative z-10" style={{ flex: '1 1 0' }}>
                  <div className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all mb-2 bg-white',
                    isComplete ? 'bg-green-600 text-white' :
                    isActive ? 'bg-blue-600 text-white' :
                    'bg-gray-200 text-gray-400'
                  )}>
                    <Icon size={20} />
                  </div>
                  <span className={clsx(
                    'text-xs font-medium text-center whitespace-nowrap',
                    isActive || isComplete ? 'text-gray-900' : 'text-gray-400'
                  )}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Connector Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 0 }}>
            <div
              className="h-full bg-green-600 transition-all duration-300"
              style={{
                width: `${(['upload', 'processing', 'review', 'assign', 'complete'].indexOf(currentStep) / 4) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* STEP 1: Upload */}
      {currentStep === 'upload' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="cursor-pointer"
            >
              <div className="p-4 bg-blue-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Upload className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Regulatory Circular PDF</h3>
              <p className="text-sm text-gray-600 mb-6">
                Drag and drop a PDF file here, or click to browse
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
              >
                <Upload size={16} />
                Browse Files
              </label>
              <p className="text-xs text-gray-500 mt-4">
                Supported: PDF files up to 25MB
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How AI Extraction Works</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span><strong>Document Analysis:</strong> AI reads the entire circular and identifies regulatory requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span><strong>Action Extraction:</strong> Automatically identifies deadlines, priorities, and applicable entities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span><strong>Smart Assignment:</strong> Suggests stakeholders based on department and role relevance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span><strong>Obligation Creation:</strong> Auto-creates compliance obligations with calendar entries</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Processing */}
      {currentStep === 'processing' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border p-8">
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative p-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <Brain className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI is Processing Your Circular</h3>
              <p className="text-sm text-gray-600">
                Analyzing document and extracting compliance actions...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Processing Progress</span>
                <span className="text-sm font-bold text-blue-600">{processingProgress}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
            </div>

            {/* Processing Steps */}
            <div className="space-y-4">
              {[
                { label: 'Reading PDF document', progress: 30 },
                { label: 'Identifying regulatory sections', progress: 50 },
                { label: 'Extracting compliance actions', progress: 70 },
                { label: 'Analyzing deadlines and priorities', progress: 90 },
                { label: 'Finalizing extraction', progress: 100 }
              ].map((step, idx) => {
                const isComplete = processingProgress >= step.progress;
                const isActive = processingProgress >= (idx > 0 ? [30, 50, 70, 90][idx - 1] : 0) && processingProgress < step.progress;

                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center transition-all',
                      isComplete ? 'bg-green-600 text-white' :
                      isActive ? 'bg-blue-600 text-white' :
                      'bg-gray-200 text-gray-400'
                    )}>
                      {isComplete ? <CheckCircle2 size={14} /> : isActive ? <Loader2 size={14} className="animate-spin" /> : idx + 1}
                    </div>
                    <span className={clsx(
                      'text-sm',
                      isComplete || isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                    )}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Review Extracted Actions */}
      {currentStep === 'review' && (
        <div className="space-y-6">
          {/* Circular Metadata */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Circular Information</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Issuer</p>
                <span className="px-3 py-1 rounded bg-teal-600 text-white text-sm font-semibold">{circularMetadata.issuer}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Circular Number</p>
                <p className="font-semibold text-gray-900">{circularMetadata.circularNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Issue Date</p>
                <p className="font-semibold text-gray-900">{circularMetadata.issueDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <span className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm font-medium">{circularMetadata.category}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-1">Title</p>
              <p className="font-semibold text-gray-900">{circularMetadata.title}</p>
            </div>
          </div>

          {/* Extracted Actions */}
          <div className="bg-white rounded-xl border">
            <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">AI-Extracted Compliance Actions</h3>
                    <p className="text-sm text-gray-600">{extractedActions.length} actions identified • {approvedCount} approved</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Average Confidence</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(extractedActions.reduce((sum, a) => sum + a.confidence, 0) / extractedActions.length)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y">
              {extractedActions.map((action, idx) => (
                <div key={action.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Action Number & Approval Checkbox */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <button
                        onClick={() => approveAction(action.id)}
                        className={clsx(
                          'w-6 h-6 rounded border-2 flex items-center justify-center transition-all',
                          action.approved
                            ? 'bg-green-600 border-green-600'
                            : 'border-gray-300 hover:border-green-500'
                        )}
                      >
                        {action.approved && <CheckCircle2 size={16} className="text-white" />}
                      </button>
                    </div>

                    {/* Action Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-base font-semibold text-gray-900 flex-1">{action.title}</h4>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={clsx(
                            'px-2 py-1 rounded text-xs font-medium',
                            action.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                            action.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                            action.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          )}>
                            {action.priority}
                          </span>
                          <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-medium flex items-center gap-1">
                            <Brain size={12} />
                            {action.confidence}%
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{action.description}</p>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Deadline</p>
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                            <Calendar size={14} />
                            {action.deadline}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Reference Section</p>
                          <p className="text-sm font-medium text-gray-900">{action.section}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <p className={clsx(
                            'text-sm font-semibold',
                            action.approved ? 'text-green-600' : 'text-amber-600'
                          )}>
                            {action.approved ? '✓ Approved' : 'Pending Review'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">Applicable To:</span>
                        {action.applicableTo.map((entity, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs">
                            {entity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Edit/Delete Buttons */}
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Action Button */}
            <div className="p-4 border-t bg-gray-50">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
                <Plus size={16} />
                Add Manual Action
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Link
              href="/circulars"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              Cancel
            </Link>
            <button
              onClick={() => setCurrentStep('assign')}
              disabled={approvedCount === 0}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Assignment
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Assign Stakeholders */}
      {currentStep === 'assign' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Assign Stakeholders</h3>
                  <p className="text-sm text-gray-600">{assignedCount} of {approvedCount} actions assigned</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <div className="flex-1 w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${(assignedCount / approvedCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    {Math.round((assignedCount / approvedCount) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Approved Actions with Stakeholder Assignment */}
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b bg-gray-50">
              <h4 className="font-semibold text-gray-900">Approved Actions Requiring Assignment</h4>
            </div>
            <div className="divide-y">
              {extractedActions.filter(a => a.approved).map((action, idx) => (
                <div key={action.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 mb-1">{action.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{action.description}</p>

                      <div className="flex items-center gap-4 mb-4">
                        <span className={clsx(
                          'px-2 py-1 rounded text-xs font-medium',
                          action.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          action.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                          'bg-amber-100 text-amber-700'
                        )}>
                          {action.priority}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          Due: {action.deadline}
                        </span>
                      </div>

                      {/* Stakeholder Selection */}
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <p className="text-xs font-semibold text-gray-700 mb-3">Assign Responsible Stakeholder</p>
                        <div className="grid grid-cols-2 gap-2">
                          {stakeholders.map(stakeholder => (
                            <button
                              key={stakeholder.id}
                              onClick={() => assignStakeholder(action.id, stakeholder.id)}
                              className={clsx(
                                'p-3 rounded-lg border-2 text-left transition-all',
                                action.assignedTo === stakeholder.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 bg-white hover:border-blue-300'
                              )}
                            >
                              <div className="flex items-start gap-2">
                                <div className={clsx(
                                  'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5',
                                  action.assignedTo === stakeholder.id
                                    ? 'border-blue-600 bg-blue-600'
                                    : 'border-gray-300'
                                )}>
                                  {action.assignedTo === stakeholder.id && (
                                    <CheckCircle2 size={12} className="text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900">{stakeholder.name}</p>
                                  <p className="text-xs text-gray-600">{stakeholder.role}</p>
                                  <p className="text-xs text-gray-500">{stakeholder.department}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('review')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Review
            </button>
            <button
              onClick={() => setCurrentStep('complete')}
              disabled={assignedCount < approvedCount}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              Submit & Disseminate
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Complete */}
      {currentStep === 'complete' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Circular Successfully Processed!</h2>
            <p className="text-gray-600 mb-8">
              {approvedCount} compliance actions have been created and assigned to stakeholders
            </p>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{approvedCount}</p>
                <p className="text-xs text-blue-700 font-medium">Actions Created</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{assignedCount}</p>
                <p className="text-xs text-purple-700 font-medium">Stakeholders Notified</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{extractedActions.filter(a => a.approved && a.priority === 'Critical').length}</p>
                <p className="text-xs text-green-700 font-medium">Critical Items</p>
              </div>
            </div>

            {/* Next Actions */}
            <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target size={16} className="text-blue-600" />
                What Happens Next?
              </h4>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Email notifications sent to all assigned stakeholders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Compliance obligations automatically created in the system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Deadlines added to compliance calendar with automated reminders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Circular PDF archived in regulatory intelligence library</span>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 justify-center">
              <Link
                href="/circulars"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All Circulars
              </Link>
              <button
                onClick={() => {
                  setCurrentStep('upload');
                  setUploadedFile(null);
                  setProcessingProgress(0);
                  setExtractedActions(prev => prev.map(a => ({ ...a, approved: false, assignedTo: undefined })));
                }}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <Upload size={16} />
                Upload Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
