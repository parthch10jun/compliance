'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, ClipboardCheck } from 'lucide-react';
import clsx from 'clsx';

// Note: In Step4AssessmentExecution and Step5MultiDimensional, useState is used within the component
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export default function NewCampaignWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  const steps = [
    { number: 1, name: 'Campaign Creation', description: 'Define campaign details, scope, and timeline' },
    { number: 2, name: 'Risk Selection', description: 'Select which risks to assess in this campaign' },
    { number: 3, name: 'Assessor Assignment', description: 'Assign assessors to specific risks' },
    { number: 4, name: 'Assessment Execution', description: 'Conduct L×C assessment with rationale' },
    { number: 5, name: 'Multi-dimensional Analysis', description: 'Assess across 5 consequence dimensions' },
    { number: 6, name: 'Review & Validation', description: 'Submit for review, reviewer provides feedback' },
    { number: 7, name: 'Approval Workflow', description: 'Approve or reject assessments' },
    { number: 8, name: 'Risk Rating Calculation', description: 'Auto-calculate risk scores and ratings' },
    { number: 9, name: 'Campaign Monitoring', description: 'Track progress and completion status' },
    { number: 10, name: 'Campaign Closure', description: 'Finalize campaign and generate reports' }
  ];

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Campaign Creation
    campaignName: '',
    description: '',
    startDate: '',
    endDate: '',
    owner: '',
    scope: '',
    method: 'Qualitative' as 'Qualitative' | 'Quantitative' | 'Semi-Quantitative',
    requireReview: true,
    notifyOnSubmission: true,
    
    // Step 2: Risk Selection
    selectedRisks: [] as string[],
    
    // Step 3: Assessor Assignment
    assessorAssignments: {} as Record<string, string>,
    
    // Step 4-8: Per-risk assessment data
    assessments: {} as Record<string, any>
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save campaign and redirect
    console.log('Campaign data:', formData);
    router.push('/erm/assessments');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/assessments')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Campaigns
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <ClipboardCheck size={24} className="text-[var(--primary)]" />
          <h1 className="text-h2 font-bold text-[var(--foreground)]">New Risk Assessment Campaign</h1>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Complete the 10-step workflow to launch a new risk assessment campaign
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Left Sidebar - Workflow Steps */}
        <div className="col-span-1">
          <div className="bg-white border border-[var(--border)] rounded-lg p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Workflow Progress</h2>
            <div className="space-y-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={clsx(
                    'p-3 rounded-lg border-2 transition-all cursor-pointer',
                    currentStep === step.number
                      ? 'border-[var(--primary)] bg-blue-50'
                      : currentStep > step.number
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  )}
                  onClick={() => setCurrentStep(step.number)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      currentStep === step.number
                        ? 'bg-[var(--primary)] text-white'
                        : currentStep > step.number
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    )}>
                      {currentStep > step.number ? <Check size={14} /> : step.number}
                    </div>
                    <span className={clsx(
                      'text-sm font-medium',
                      currentStep === step.number ? 'text-[var(--primary)]' : 'text-[var(--foreground-muted)]'
                    )}>
                      {step.name}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--foreground-muted)] ml-8">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area - Step Content */}
        <div className="col-span-3">
          <div className="bg-white border border-[var(--border)] rounded-lg p-8">
            {/* Step Header */}
            <div className="mb-6 pb-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold">
                  {currentStep}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">
                    Step {currentStep}: {steps[currentStep - 1].name}
                  </h2>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {steps[currentStep - 1].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Step Content - Will be rendered dynamically based on currentStep */}
            <div className="mb-8">
              {currentStep === 1 && <Step1CampaignCreation formData={formData} setFormData={setFormData} />}
              {currentStep === 2 && <Step2RiskSelection formData={formData} setFormData={setFormData} />}
              {currentStep === 3 && <Step3AssessorAssignment formData={formData} setFormData={setFormData} />}
              {currentStep === 4 && <Step4AssessmentExecution formData={formData} setFormData={setFormData} />}
              {currentStep === 5 && <Step5MultiDimensional formData={formData} setFormData={setFormData} />}
              {currentStep === 6 && <Step6ReviewValidation formData={formData} setFormData={setFormData} />}
              {currentStep === 7 && <Step7ApprovalWorkflow formData={formData} setFormData={setFormData} />}
              {currentStep === 8 && <Step8RiskCalculation formData={formData} setFormData={setFormData} />}
              {currentStep === 9 && <Step9CampaignMonitoring formData={formData} setFormData={setFormData} />}
              {currentStep === 10 && <Step10CampaignClosure formData={formData} setFormData={setFormData} />}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={clsx(
                  'px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-[var(--foreground)] hover:bg-gray-200'
                )}
              >
                <ArrowLeft size={18} />
                Back
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-all flex items-center gap-2"
                >
                  Next Step
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <Check size={18} />
                  Complete Campaign
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step components
function Step1CampaignCreation({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Welcome to the Campaign Creation Wizard</h3>
        <p className="text-sm text-blue-800">
          Define the basic details of your risk assessment campaign. You'll select risks and assign assessors in the next steps.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Campaign Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.campaignName}
            onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="e.g., Q3 2024 Enterprise Risk Assessment"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Owner <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value="">Select owner...</option>
            <option value="Sarah Chen (CISO)">Sarah Chen (CISO)</option>
            <option value="Jennifer Walsh (CCO)">Jennifer Walsh (CCO)</option>
            <option value="David Kumar (COO)">David Kumar (COO)</option>
            <option value="Patricia Wilson (CFO)">Patricia Wilson (CFO)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Description <span className="text-red-600">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          placeholder="Describe the purpose and scope of this assessment campaign..."
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Start Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            End Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Assessment Method <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value="Qualitative">Qualitative (L×C Matrix)</option>
            <option value="Semi-Quantitative">Semi-Quantitative</option>
            <option value="Quantitative">Quantitative</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Scope <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.scope}
            onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value="">Select scope...</option>
            <option value="Enterprise-wide">Enterprise-wide</option>
            <option value="IT Department">IT Department</option>
            <option value="Finance Department">Finance Department</option>
            <option value="Operations">Operations</option>
            <option value="Compliance">Compliance</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Workflow Options
          </label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="requireReview"
              checked={formData.requireReview}
              onChange={(e) => setFormData({ ...formData, requireReview: e.target.checked })}
              className="w-4 h-4 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]"
            />
            <label htmlFor="requireReview" className="text-sm text-[var(--foreground)]">
              Require review before approval
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notifyOnSubmission"
              checked={formData.notifyOnSubmission}
              onChange={(e) => setFormData({ ...formData, notifyOnSubmission: e.target.checked })}
              className="w-4 h-4 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]"
            />
            <label htmlFor="notifyOnSubmission" className="text-sm text-[var(--foreground)]">
              Send notifications on submission
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2RiskSelection({ formData, setFormData }: any) {
  // Mock risks for selection
  const availableRisks = [
    { id: 'RSK-001', title: 'Third-party vendor data breach exposure', category: 'Cybersecurity', owner: 'Sarah Chen' },
    { id: 'RSK-002', title: 'Ransomware attack on critical systems', category: 'Cybersecurity', owner: 'Sarah Chen' },
    { id: 'RSK-007', title: 'Key personnel departure', category: 'Operational', owner: 'Maria Garcia' },
    { id: 'RSK-015', title: 'Customer data privacy breach', category: 'Compliance', owner: 'Jennifer Walsh' },
    { id: 'RSK-020', title: 'Market share erosion', category: 'Strategic', owner: 'CEO Office' }
  ];

  const toggleRisk = (riskId: string) => {
    const selected = formData.selectedRisks || [];
    if (selected.includes(riskId)) {
      setFormData({ ...formData, selectedRisks: selected.filter((id: string) => id !== riskId) });
    } else {
      setFormData({ ...formData, selectedRisks: [...selected, riskId] });
    }
  };

  const selectedCount = (formData.selectedRisks || []).length;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Select Risks for Assessment</h3>
        <p className="text-sm text-blue-800">
          Choose which risks you want to assess in this campaign. You can select all risks or filter by category, business unit, or owner.
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-[var(--foreground-muted)]">
          <span className="font-semibold text-[var(--foreground)]">{selectedCount}</span> risk{selectedCount !== 1 ? 's' : ''} selected
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFormData({ ...formData, selectedRisks: availableRisks.map(r => r.id) })}
            className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-gray-50"
          >
            Select All
          </button>
          <button
            onClick={() => setFormData({ ...formData, selectedRisks: [] })}
            className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-gray-50"
          >
            Deselect All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {availableRisks.map(risk => {
          const isSelected = (formData.selectedRisks || []).includes(risk.id);
          return (
            <div
              key={risk.id}
              onClick={() => toggleRisk(risk.id)}
              className={clsx(
                'p-4 border-2 rounded-lg cursor-pointer transition-all',
                isSelected
                  ? 'border-[var(--primary)] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-5 h-5 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-[var(--primary)]">{risk.id}</span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">
                      {risk.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">{risk.title}</h3>
                  <p className="text-xs text-[var(--foreground-muted)]">Owner: {risk.owner}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step3AssessorAssignment({ formData, setFormData }: any) {
  const assessors = ['Sarah Chen (CISO)', 'Maria Garcia (CHRO)', 'David Kumar (COO)', 'Jennifer Walsh (CCO)', 'Risk Analyst 1', 'Risk Analyst 2'];

  const selectedRisks = [
    { id: 'RSK-001', title: 'Third-party vendor data breach exposure' },
    { id: 'RSK-007', title: 'Key personnel departure' }
  ]; // In real app, filter from formData.selectedRisks

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Assign Assessors to Risks</h3>
        <p className="text-sm text-blue-800">
          Assign an assessor to each risk. The assessor will be responsible for conducting the assessment and providing rationale.
        </p>
      </div>

      <div className="space-y-4">
        {selectedRisks.map(risk => (
          <div key={risk.id} className="bg-white border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--primary)] mb-1">{risk.id}</div>
                <div className="text-sm font-semibold text-[var(--foreground)]">{risk.title}</div>
              </div>
              <div className="w-64">
                <select
                  value={formData.assessorAssignments?.[risk.id] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    assessorAssignments: { ...formData.assessorAssignments, [risk.id]: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                >
                  <option value="">Select assessor...</option>
                  {assessors.map(assessor => (
                    <option key={assessor} value={assessor}>{assessor}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step4AssessmentExecution({ formData, setFormData }: any) {
  const [selectedRisk, setSelectedRisk] = useState('RSK-001');
  const risks = [
    { id: 'RSK-001', title: 'Third-party vendor data breach exposure' },
    { id: 'RSK-007', title: 'Key personnel departure' }
  ];

  const assessmentData = formData.assessments?.[selectedRisk] || { likelihood: 3, consequence: 3, likelihoodRationale: '', consequenceRationale: '' };

  const updateAssessment = (field: string, value: any) => {
    setFormData({
      ...formData,
      assessments: {
        ...formData.assessments,
        [selectedRisk]: { ...assessmentData, [field]: value }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Conduct Risk Assessment</h3>
        <p className="text-sm text-blue-800">
          Assess the likelihood and consequence for each risk. Provide rationale to support your assessment.
        </p>
      </div>

      {/* Risk Selector */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Select Risk to Assess:</label>
        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
          className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        >
          {risks.map(risk => (
            <option key={risk.id} value={risk.id}>{risk.id} - {risk.title}</option>
          ))}
        </select>
      </div>

      {/* Likelihood Assessment */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6">
        <h3 className="font-semibold text-[var(--foreground)] mb-4">Likelihood Assessment</h3>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map(val => (
            <button
              key={val}
              onClick={() => updateAssessment('likelihood', val)}
              className={clsx(
                'flex-1 py-3 rounded-lg border-2 font-semibold transition-all',
                assessmentData.likelihood === val
                  ? 'border-orange-500 bg-orange-100 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              {val}
            </button>
          ))}
        </div>
        <div className="text-xs text-[var(--foreground-muted)] mb-4">
          1 = Rare, 2 = Unlikely, 3 = Possible, 4 = Likely, 5 = Almost Certain
        </div>
        <textarea
          value={assessmentData.likelihoodRationale}
          onChange={(e) => updateAssessment('likelihoodRationale', e.target.value)}
          rows={3}
          placeholder="Provide rationale for your likelihood assessment..."
          className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        />
      </div>

      {/* Consequence Assessment */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6">
        <h3 className="font-semibold text-[var(--foreground)] mb-4">Consequence Assessment</h3>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map(val => (
            <button
              key={val}
              onClick={() => updateAssessment('consequence', val)}
              className={clsx(
                'flex-1 py-3 rounded-lg border-2 font-semibold transition-all',
                assessmentData.consequence === val
                  ? 'border-red-500 bg-red-100 text-red-700'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              {val}
            </button>
          ))}
        </div>
        <div className="text-xs text-[var(--foreground-muted)] mb-4">
          1 = Insignificant, 2 = Minor, 3 = Moderate, 4 = Major, 5 = Catastrophic
        </div>
        <textarea
          value={assessmentData.consequenceRationale}
          onChange={(e) => updateAssessment('consequenceRationale', e.target.value)}
          rows={3}
          placeholder="Provide rationale for your consequence assessment..."
          className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        />
      </div>
    </div>
  );
}

function Step5MultiDimensional({ formData, setFormData }: any) {
  const [selectedRisk, setSelectedRisk] = useState('RSK-001');
  const risks = [
    { id: 'RSK-001', title: 'Third-party vendor data breach exposure' },
    { id: 'RSK-007', title: 'Key personnel departure' }
  ];

  const dimensionData = formData.assessments?.[selectedRisk]?.dimensions || {
    financial: 3,
    healthSafety: 1,
    environmental: 1,
    operational: 3,
    reputational: 4
  };

  const updateDimension = (dimension: string, value: number) => {
    const current = formData.assessments?.[selectedRisk] || {};
    setFormData({
      ...formData,
      assessments: {
        ...formData.assessments,
        [selectedRisk]: {
          ...current,
          dimensions: { ...dimensionData, [dimension]: value }
        }
      }
    });
  };

  const dimensions = [
    { key: 'financial', label: 'Financial Impact', color: 'green' },
    { key: 'healthSafety', label: 'Health & Safety', color: 'red' },
    { key: 'environmental', label: 'Environmental', color: 'emerald' },
    { key: 'operational', label: 'Operational', color: 'blue' },
    { key: 'reputational', label: 'Reputational', color: 'purple' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Multi-dimensional Consequence Analysis</h3>
        <p className="text-sm text-blue-800">
          Assess the consequence across multiple dimensions: Financial, Health & Safety, Environmental, Operational, and Reputational.
        </p>
      </div>

      {/* Risk Selector */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Select Risk:</label>
        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
          className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        >
          {risks.map(risk => (
            <option key={risk.id} value={risk.id}>{risk.id} - {risk.title}</option>
          ))}
        </select>
      </div>

      {/* Dimension Assessments */}
      <div className="space-y-4">
        {dimensions.map(dim => (
          <div key={dim.key} className={`bg-${dim.color}-50 border border-${dim.color}-200 rounded-lg p-4`}>
            <h4 className="font-semibold text-[var(--foreground)] mb-3">{dim.label}</h4>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  onClick={() => updateDimension(dim.key, val)}
                  className={clsx(
                    'flex-1 py-2 rounded-lg border-2 font-semibold transition-all text-sm',
                    dimensionData[dim.key] === val
                      ? `border-${dim.color}-600 bg-${dim.color}-200 text-${dim.color}-900`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  )}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step6ReviewValidation({ formData, setFormData }: any) {
  const assessments = [
    { id: 'ASMT-001', riskId: 'RSK-001', riskTitle: 'Third-party vendor data breach exposure', assessor: 'Sarah Chen', status: 'Submitted', likelihood: 4, consequence: 5, rating: 'Critical' },
    { id: 'ASMT-002', riskId: 'RSK-007', riskTitle: 'Key personnel departure', assessor: 'Maria Garcia', status: 'Draft', likelihood: 3, consequence: 4, rating: 'High' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Review & Validate Assessments</h3>
        <p className="text-sm text-blue-800">
          Review all submitted assessments before sending for approval. Provide feedback if assessments need revision.
        </p>
      </div>

      <div className="space-y-4">
        {assessments.map(asmt => (
          <div key={asmt.id} className="bg-white border border-[var(--border)] rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-medium text-[var(--primary)] mb-1">{asmt.riskId}</div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2">{asmt.riskTitle}</h3>
                <div className="text-sm text-[var(--foreground-muted)]">Assessor: {asmt.assessor}</div>
              </div>
              <span className={clsx(
                'px-3 py-1 text-xs font-medium rounded',
                asmt.status === 'Submitted' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              )}>
                {asmt.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Likelihood</div>
                <div className="text-2xl font-bold">{asmt.likelihood}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Consequence</div>
                <div className="text-2xl font-bold">{asmt.consequence}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Rating</div>
                <div className={clsx(
                  'text-lg font-bold',
                  asmt.rating === 'Critical' ? 'text-red-600' : 'text-orange-600'
                )}>
                  {asmt.rating}
                </div>
              </div>
            </div>

            {asmt.status === 'Submitted' && (
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                  Approve
                </button>
                <button className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-all">
                  Request Revision
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Step7ApprovalWorkflow({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-green-900 mb-2">✓ Approval Complete</h3>
        <p className="text-sm text-green-800">
          All assessments have been reviewed and approved. Risk ratings have been calculated automatically.
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-lg p-6">
        <h3 className="font-semibold text-[var(--foreground)] mb-4">Approval Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">2</div>
            <div className="text-sm text-[var(--foreground-muted)] mt-1">Approved</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">0</div>
            <div className="text-sm text-[var(--foreground-muted)] mt-1">Pending Review</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-600">0</div>
            <div className="text-sm text-[var(--foreground-muted)] mt-1">Rejected</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step8RiskCalculation({ formData, setFormData }: any) {
  const calculations = [
    { riskId: 'RSK-001', title: 'Third-party vendor data breach', L: 4, C: 5, score: 20, rating: 'Critical', color: 'red' },
    { riskId: 'RSK-007', title: 'Key personnel departure', L: 3, C: 4, score: 12, rating: 'High', color: 'orange' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Risk Rating Calculation</h3>
        <p className="text-sm text-blue-800">
          Risk scores and ratings are automatically calculated using the formula: Risk Score = Likelihood × Consequence
        </p>
      </div>

      <div className="space-y-4">
        {calculations.map(calc => (
          <div key={calc.riskId} className="bg-white border border-[var(--border)] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-medium text-[var(--primary)] mb-1">{calc.riskId}</div>
                <h3 className="font-semibold text-[var(--foreground)]">{calc.title}</h3>
              </div>
              <span className={clsx(
                'px-4 py-2 text-sm font-bold rounded-lg',
                calc.color === 'red' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
              )}>
                {calc.rating}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--foreground-muted)]">Likelihood:</span>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg font-bold text-orange-700">
                  {calc.L}
                </div>
              </div>
              <span className="text-2xl font-bold text-[var(--foreground-muted)]">×</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--foreground-muted)]">Consequence:</span>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg font-bold text-red-700">
                  {calc.C}
                </div>
              </div>
              <span className="text-2xl font-bold text-[var(--foreground-muted)]">=</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--foreground-muted)]">Risk Score:</span>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-700">
                  {calc.score}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step9CampaignMonitoring({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Campaign Progress Monitoring</h3>
        <p className="text-sm text-blue-800">
          Monitor the overall progress of your campaign. Track completion rates and identify bottlenecks.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-4">Completion Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Risks</span>
              <span className="font-bold">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Assessments Completed</span>
              <span className="font-bold text-green-600">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Approved</span>
              <span className="font-bold text-green-600">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending</span>
              <span className="font-bold text-orange-600">0</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="text-sm text-[var(--foreground-muted)] mb-2">Overall Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="h-3 rounded-full bg-green-600" style={{ width: '100%' }} />
            </div>
            <div className="text-right text-sm font-bold text-green-600 mt-1">100%</div>
          </div>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-4">Risk Distribution</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-red-50 rounded">
              <span className="text-sm">Critical</span>
              <span className="font-bold text-red-700">1</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
              <span className="text-sm">High</span>
              <span className="font-bold text-orange-700">1</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <span className="text-sm">Medium</span>
              <span className="font-bold text-yellow-700">0</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm">Low</span>
              <span className="font-bold text-green-700">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step10CampaignClosure({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-green-900 mb-2">🎉 Ready to Complete Campaign!</h3>
        <p className="text-sm text-green-800">
          All assessments are complete and approved. Review the summary below and finalize the campaign.
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-lg p-6">
        <h3 className="font-semibold text-[var(--foreground)] mb-4">Campaign Summary</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-[var(--foreground-muted)] mb-1">Campaign Name</div>
            <div className="font-medium">{formData.campaignName || 'Q3 2024 Assessment'}</div>
          </div>
          <div>
            <div className="text-sm text-[var(--foreground-muted)] mb-1">Owner</div>
            <div className="font-medium">{formData.owner || 'Sarah Chen'}</div>
          </div>
          <div>
            <div className="text-sm text-[var(--foreground-muted)] mb-1">Scope</div>
            <div className="font-medium">{formData.scope || 'Enterprise-wide'}</div>
          </div>
          <div>
            <div className="text-sm text-[var(--foreground-muted)] mb-1">Method</div>
            <div className="font-medium">{formData.method || 'Qualitative'}</div>
          </div>
          <div>
            <div className="text-sm text-[var(--foreground-muted)] mb-1">Risks Assessed</div>
            <div className="font-medium text-green-600">2</div>
          </div>
          <div>
            <div className="text-sm text-[var(--foreground-muted)] mb-1">Completion</div>
            <div className="font-medium text-green-600">100%</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-lg p-6">
        <h3 className="font-semibold text-[var(--foreground)] mb-4">Next Steps</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check size={14} className="text-green-600" />
            </div>
            <div>
              <div className="font-medium text-[var(--foreground)]">Generate Campaign Report</div>
              <div className="text-sm text-[var(--foreground-muted)]">A comprehensive report will be generated automatically</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check size={14} className="text-green-600" />
            </div>
            <div>
              <div className="font-medium text-[var(--foreground)]">Update Risk Register</div>
              <div className="text-sm text-[var(--foreground-muted)]">Risk ratings will be updated in the central register</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check size={14} className="text-green-600" />
            </div>
            <div>
              <div className="font-medium text-[var(--foreground)]">Notify Stakeholders</div>
              <div className="text-sm text-[var(--foreground-muted)]">All stakeholders will receive completion notification</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Click "Complete Campaign" below to finalize this assessment campaign and make all results official.
        </p>
      </div>
    </div>
  );
}
