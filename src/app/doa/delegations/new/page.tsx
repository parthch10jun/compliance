'use client';

/**
 * Screen 7 - Create Delegation (Wizard)
 * 4-step wizard with live pre-flight checks
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, AlertTriangle, Info, ChevronRight } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

interface DelegationFormData {
  // Step 1: Delegate
  delegate: string;
  delegateRole: string;

  // Step 2: Scope & limits
  functions: string[];
  categories: string[];
  entities: string[];
  monetaryCap: string;
  currency: string;
  periodStart: string;
  periodEnd: string;
  timezone: string;
  reason: string;

  // Step 3: Conflicts & approval (auto-determined)
  requiresApproval: boolean;
  approvalRoute: string;
}

export default function NewDelegation() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showConflicts, setShowConflicts] = useState(false);
  const [showAffected, setShowAffected] = useState(false);

  const [formData, setFormData] = useState<DelegationFormData>({
    delegate: 'L. Tan',
    delegateRole: 'Cat Mgr',
    functions: ['Procurement'],
    categories: ['Indirect SaaS', 'Services'],
    entities: ['EU', 'AR-EU-01'],
    monetaryCap: '250000',
    currency: 'EUR',
    periodStart: '2026-05-10',
    periodEnd: '2026-05-20',
    timezone: 'Europe/Berlin',
    reason: 'Annual leave coverage; selected delegate is acting Cat. Manager.',
    requiresApproval: false,
    approvalRoute: 'Self-service (within 1 grade) · auto-approved · audit-logged',
  });

  const [preflightChecks, setPreflightChecks] = useState([
    { id: 1, label: 'Cap ≤ delegator cap', status: 'pass' as const },
    { id: 2, label: 'Non-circular delegation', status: 'pass' as const },
    { id: 3, label: 'Delegate is active in HRMS', status: 'pass' as const },
    { id: 4, label: 'SoD: SOD-001 mitigated by scope', status: 'warning' as const },
    { id: 5, label: 'Scope covers all in-flight requests', status: 'pass' as const },
    { id: 6, label: '12 in-flight steps will reroute', status: 'info' as const },
  ]);

  const steps = [
    { number: 1, label: '1. Delegate', completed: currentStep > 1 },
    { number: 2, label: '2. Scope & limits', completed: currentStep > 2 },
    { number: 3, label: '3. Conflicts & approval', completed: currentStep > 3 },
    { number: 4, label: '4. Review', completed: false },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleRunConflicts = () => {
    setShowConflicts(true);
    setTimeout(() => setShowConflicts(false), 3000);
  };

  const handleViewAffected = () => {
    setShowAffected(true);
    setTimeout(() => setShowAffected(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-semibold text-gray-900">New delegation</h1>
      </div>

      {/* Stepper - Step 2 of 4 */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                  step.number < currentStep
                    ? 'bg-green-500 text-white'
                    : step.number === currentStep
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.number < currentStep ? <Check className="w-4 h-4" /> : step.number}
                </div>
                <span className={`text-sm ${
                  step.number === currentStep ? 'font-semibold text-gray-900' : 'text-gray-600'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="p-4">
        <div className="flex gap-4 max-w-7xl mx-auto">
          {/* Left: Form */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
            {/* Step 1: Delegate */}
            {currentStep === 1 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Delegate</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Delegate*</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent">
                      <option>L. Tan (Cat Mgr) - Selected</option>
                      <option>M. Lopez (Sr Mgr)</option>
                      <option>K. Chen (Director)</option>
                    </select>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                    <strong>L. Tan</strong> - Category Manager, Procurement
                    <div className="text-xs text-gray-700 mt-1">
                      • Active in HRMS<br/>
                      • Reports to: J. Müller (you)<br/>
                      • Grade: L4 (1 level below delegator)
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Scope & limits */}
            {currentStep === 2 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Scope & limits</h2>

            <div className="space-y-4">
              {/* Functions in scope */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Functions in scope*</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Procurement', 'Finance', 'HR', 'IT', 'Legal', 'Operations', 'Risk', 'Compliance'].map((func) => (
                    <label key={func} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.functions.includes(func)}
                        className="w-4 h-4 text-[#F59E0B] border-gray-300 rounded focus:ring-[#F59E0B]"
                      />
                      <span className="text-sm text-gray-700">{func}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories in scope */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Categories in scope</label>
                <div className="flex flex-wrap gap-2">
                  {['Indirect SaaS ✓', 'Services ✓', 'Capex', 'Contractors', 'Hardware'].map((cat) => (
                    <button
                      key={cat}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        cat.includes('✓')
                          ? 'bg-green-50 border-green-300 text-green-700'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.replace(' ✓', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entity / region */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Entity / region</label>
                <div className="flex items-center gap-2 p-2 border border-gray-300 rounded">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded">EU</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded flex items-center gap-1">
                    AR-EU-01
                    <button className="text-gray-500 hover:text-gray-700">×</button>
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-800">+ Add scope</button>
                </div>
              </div>

              {/* Monetary cap */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Monetary cap*</label>
                  <input
                    type="text"
                    value={formData.monetaryCap}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">&nbsp;</label>
                  <select
                    value={formData.currency}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  >
                    <option>EUR ▼</option>
                    <option>USD</option>
                    <option>GBP</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-gray-600">(Delegator's own cap: EUR 5,000,000)</p>

              {/* Period */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Period*</label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="date"
                    value={formData.periodStart}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent text-sm"
                  />
                  <span className="flex items-center justify-center text-gray-500">to</span>
                  <input
                    type="date"
                    value={formData.periodEnd}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent text-sm"
                  />
                </div>
                <select className="w-full mt-2 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent text-sm">
                  <option>Time zone: Europe/Berlin ▼</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Reason / business justification*</label>
                <textarea
                  value={formData.reason}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent text-sm"
                />
              </div>
            </div>
              </>
            )}

            {/* Step 3: Conflicts & approval */}
            {currentStep === 3 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Conflicts & Approval</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-green-900">No conflicts detected</h3>
                        <p className="text-sm text-green-700 mt-1">
                          This delegation does not create any SoD violations or circular delegations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Approval Route</h3>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm">
                      <strong>Self-service (within 1 grade)</strong>
                      <p className="text-gray-700 mt-1">
                        • Auto-approved (delegate is 1 level below)<br/>
                        • Audit-logged in compliance trail<br/>
                        • Takes effect immediately upon submission
                      </p>
                    </div>
                  </div>

                  {showConflicts && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm">
                      <strong>✓ Conflict Check Complete</strong>
                      <p className="text-blue-700 mt-1">No SoD violations found. Delegation is compliant.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Review & Submit</h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Delegation Summary</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Delegator:</dt>
                        <dd className="font-medium">J. Müller (Proc Dir)</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Delegate:</dt>
                        <dd className="font-medium">L. Tan (Cat Mgr)</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Functions:</dt>
                        <dd className="font-medium">Procurement</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Categories:</dt>
                        <dd className="font-medium">Indirect SaaS, Services</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Scope:</dt>
                        <dd className="font-medium">EU · AR-EU-01</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Cap:</dt>
                        <dd className="font-medium">EUR 250,000</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Period:</dt>
                        <dd className="font-medium">10 May – 20 May 2026</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Approval:</dt>
                        <dd className="font-medium text-green-600">Auto-approved</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs">
                    <strong>Impact:</strong> 12 in-flight approval steps will be rerouted to L. Tan
                  </div>

                  <Link href="/doa/delegations" className="block w-full px-4 py-3 bg-[#F59E0B] text-white rounded font-medium hover:bg-amber-600 transition-colors text-center">
                    Submit Delegation
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Right: Live Preview & Pre-flight Checks */}
          <div className="w-96 space-y-4">
            {/* Live Preview */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Live preview</h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">J. Müller → L. Tan</p>
                <p className="text-gray-700">Procurement: Indirect SaaS, Services</p>
                <p className="text-gray-700">EU · AR-EU-01</p>
                <p className="text-gray-700">Cap EUR 250,000 (5% of delegator)</p>
                <p className="text-gray-700">10 May – 20 May 2026 (10 days)</p>
              </div>
            </div>

            {/* Pre-flight checks */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Pre-flight checks</h3>
              <div className="space-y-2">
                {preflightChecks.map((check) => (
                  <div key={check.id} className="flex items-start gap-2 text-sm">
                    {check.status === 'pass' && <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />}
                    {check.status === 'warning' && <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />}
                    {check.status === 'info' && <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}
                    <span className={
                      check.status === 'pass' ? 'text-gray-700' :
                      check.status === 'warning' ? 'text-orange-700' :
                      'text-blue-700'
                    }>{check.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleRunConflicts}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                >
                  Run conflicts
                </button>
                <button
                  onClick={handleViewAffected}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                >
                  View affected
                </button>
              </div>

              {showAffected && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
                  <strong>12 in-flight requests</strong> will be rerouted:
                  <ul className="mt-1 ml-4 list-disc text-blue-700">
                    <li>APR-45001 through APR-45012</li>
                    <li>All pending at "Procurement Director" step</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded">
            Stepper shows progress; cancel returns to delegations list
          </p>
          <div className="flex gap-2">
            <Link href="/doa/delegations" className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
              Save draft
            </button>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            {currentStep < 4 && (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-[#F59E0B] text-white rounded text-sm hover:bg-amber-600 transition-colors flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          <Info className="w-4 h-4 inline mr-1" />
          <strong>Pre-flight check panel updates</strong> as you edit — no surprises at submit
        </div>
      </div>
    </div>
  );
}
