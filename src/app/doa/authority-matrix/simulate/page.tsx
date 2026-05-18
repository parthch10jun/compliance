'use client';

/**
 * Screen 5 - Matrix Simulator (What-if Routing)
 * Test hypothetical requests against any matrix version without touching production
 * Two-pane layout: Request payload (left) + Simulation result (right)
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Play, Save, CheckCircle2, AlertCircle, Info,
  ExternalLink, FileText, Clock, Shield
} from 'lucide-react';

export default function MatrixSimulator() {
  const [simulationRun, setSimulationRun] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<'ROUTED' | 'BLOCKED' | 'ESCALATED'>('ROUTED');

  const [formData, setFormData] = useState({
    version: 'DOA-PROC-2026.2 (Effective)',
    function: 'Procurement',
    category: 'Indirect SaaS',
    entity: 'AR-EU-01',
    amount: '1,250,000',
    currency: 'EUR',
    valueDate: '2026-05-15',
    originator: 'Priya N. (BU: EU)',
    vendor: 'Salesforce.com EU',
    contract: 'CLM-98123 (3 yr)',
    riskScore: 'Medium',
    cumulativeSpend: '240,000',
  });

  const resolvedChain = [
    { level: 1, role: 'Cat. Manager', approver: 'Lily Tan', status: 'Skipped (originator above L1)' },
    { level: 2, role: 'Proc. Director', approver: 'J. Muller', status: 'Required' },
    { level: 3, role: 'VP Procurement', approver: 'Pierre G.', status: 'Required' },
    { level: 4, role: 'CFO', approver: 'Anna F.', status: 'Required (4-eyes ≥ EUR 1M)' },
    { level: 'AP', role: 'ARC observer (info)', approver: 'Audit & Risk Comm.', status: 'Notified, no decision' },
  ];

  const whyExplanation = [
    'Matrix row matched: Procurement · Indirect SaaS · EU · band 1,000,001–5,000,000',
    'Resolved to CFO (Anna F.) via inherited Global row',
    '4-eyes flag triggered: amount ≥ EUR 1,000,000 → parallel CFO + ARC observer',
    'Cumulative window check: 240k + 1.25M = 1.49M < 12-mo cap of 2M (OK)',
    'SoD evaluation: CLEAR (originator ≠ approver in any role)',
    'Active delegation: none affecting this chain',
  ];

  const runSimulation = () => {
    setSimulationRun(true);
    setSimulationStatus('ROUTED');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/doa/authority-matrix"
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Matrix Simulator — What-if routing</h1>
              <p className="text-xs text-gray-600">
                Test a hypothetical request against any version (draft, effective, historical) without persisting it
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimulationRun(false)}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => alert('Scenario saved!')}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save scenario
            </button>
          </div>
        </div>
      </div>


      {/* Two-pane layout */}
      <div className="flex gap-4 p-4">
        {/* Left Pane: Hypothetical Request Payload */}
        <div className="w-96 bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Hypothetical request</h3>
          <p className="text-xs text-gray-600 mb-4">
            Test a hypothetical request against any version (draft, effective, historical) without persisting it
          </p>

          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Version*</label>
              <select value={formData.version} onChange={(e) => setFormData({...formData, version: e.target.value})} className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent">
                <option>DOA-PROC-2026.2 (Effective)</option>
                <option>DOA-PROC-2026.3 (Draft)</option>
                <option>DOA-PROC-2026.1 (Superseded)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Function*</label>
              <select value={formData.function} onChange={(e) => setFormData({...formData, function: e.target.value})} className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent">
                <option>Procurement</option>
                <option>Finance</option>
                <option>HR</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category*</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent">
                <option>Indirect SaaS</option>
                <option>Services</option>
                <option>Capex</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Entity / BU</label>
              <input type="text" value={formData.entity} onChange={(e) => setFormData({...formData, entity: e.target.value})} className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Amount*</label>
              <input type="text" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Currency*</label>
              <select value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})} className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent">
                <option>EUR</option>
                <option>USD</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Value date</label>
              <input type="date" value={formData.valueDate} onChange={(e) => setFormData({...formData, valueDate: e.target.value})} className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Originator</label>
              <input type="text" value={formData.originator} onChange={(e) => setFormData({...formData, originator: e.target.value})} className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Vendor</label>
              <input type="text" value={formData.vendor} onChange={(e) => setFormData({...formData, vendor: e.target.value})} className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Contract</label>
              <input type="text" value={formData.contract} onChange={(e) => setFormData({...formData, contract: e.target.value})} className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Risk score</label>
              <select value={formData.riskScore} onChange={(e) => setFormData({...formData, riskScore: e.target.value})} className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent">
                <option>Medium</option>
                <option>Low</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Cumulative spend (12-mo, this vendor)</label>
              <input type="text" value={formData.cumulativeSpend} onChange={(e) => setFormData({...formData, cumulativeSpend: e.target.value})} className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent" />
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
            <strong>Read-only:</strong> All fields drive routing — same engine as live submissions
          </div>

          <button onClick={runSimulation} className="w-full mt-4 px-4 py-2 bg-[#F59E0B] text-white rounded hover:bg-amber-600 transition-colors font-medium flex items-center justify-center gap-2">
            <Play className="w-4 h-4" />
            Simulate
          </button>
        </div>


        {/* Right Pane: Simulation Result */}
        <div className="flex-1 space-y-4">
          {!simulationRun ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Play className="w-16 h-16 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600">Configure your scenario and click "Simulate"</p>
            </div>
          ) : (
            <>
              {/* Simulation Result Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Simulation result</h3>
                    <p className="text-xs text-gray-600 mt-0.5">Resolved chain · 4 steps · est. 3 business days</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">{simulationStatus}</span>
                </div>

                {/* Resolved Chain */}
                <div className="space-y-2">
                  {resolvedChain.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-2.5 bg-gray-50 rounded">
                      <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {typeof step.level === 'number' ? step.level : step.level}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{step.role}</div>
                        <div className="text-xs text-gray-600">{step.approver} · {step.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why this chain? Explainability */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Why this chain?</h3>
                <ul className="space-y-2">
                  {whyExplanation.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="text-green-600 flex-shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                  <strong>Explainability:</strong> "Why this chain?" is the most-loved feature of the simulator — full explainability
                </div>
              </div>

              {/* Policy & FX Reference */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Policy & FX reference</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Policy:</span>
                    <Link href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      DOA-PROC-Policy v2026.2 (signed PDF)
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">FX:</span>
                    <span className="text-gray-900">EUR 1.00 = USD 1.084 (ECB, 2026-05-15)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Estimated turnaround:</span>
                    <span className="text-gray-900">3 business days (median)</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="max-w-4xl mx-auto p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Read-only guarantee:</strong> Simulator never writes to live state — confirmed by absence of audit_trail entries for read-only simulations. Same routing chain as a real submission, including delegation resolution as of the value date.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
