'use client';

/**
 * Advanced Threshold Configuration
 * Multi-currency, cumulative, and compound threshold management
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, CheckCircle } from 'lucide-react';
import AdvancedThresholdBuilder from '@/components/doa/thresholds/AdvancedThresholdBuilder';

export default function AdvancedThresholdsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/doa/authority-matrix" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-h1 font-semibold text-gray-900">Advanced Threshold Configuration</h1>
          <p className="text-p2 text-gray-600 mt-1">
            Configure multi-currency, cumulative, and compound thresholds with four-eyes principle
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-900">Enterprise-Grade Thresholds</span>
        </div>
      </div>

      {/* Feature Summary */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-6">
        <div className="flex items-start gap-4">
          <Settings className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-h3 font-semibold text-gray-900 mb-3">Advanced Threshold Capabilities</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { desc: 'Multi-currency support with real-time FX conversion' },
                { desc: 'Non-monetary thresholds (risk score, severity, headcount)' },
                { desc: 'Compound conditions with boolean logic (AND/OR)' },
                { desc: 'Multi-dimensional filtering (role, dept, entity, region)' },
                { desc: 'Cumulative limits with 12-month rolling windows' },
                { desc: 'Per-vendor and per-counterparty spend tracking' },
                { desc: 'Authority bands with configurable boundaries' },
                { desc: 'Approver warnings at configurable % thresholds' },
                { desc: 'Four-eyes principle for high-value transactions' },
                { desc: 'Tax and indirect cost inclusion options' },
                { desc: 'Effective dating with automatic version control' },
                { desc: 'Middle Eastern currency support (AED, SAR, QAR, etc.)' },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Threshold Builder Component */}
      <AdvancedThresholdBuilder onSave={(config) => {
        console.log('Threshold config saved:', config);
        alert('Threshold configuration saved successfully!');
      }} />

      {/* Example Configurations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-h3 font-semibold text-gray-900 mb-4">Example Threshold Configurations</h3>
        
        <div className="space-y-4">
          {/* Example 1 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-medium text-blue-900 mb-2">Example 1: Standard Monetary with Four-Eyes</div>
            <div className="text-sm text-blue-800 space-y-1">
              <div>• Amount: $0 - $500,000 USD (inclusive)</div>
              <div>• Scope: Absolute (per transaction)</div>
              <div>• Four-Eyes: Required above $250,000</div>
              <div>• Warning: Alert approver at 90% of limit</div>
              <div>• Tax: VAT inclusive</div>
            </div>
          </div>

          {/* Example 2 */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-medium text-green-900 mb-2">Example 2: Cumulative Vendor Limit</div>
            <div className="text-sm text-green-800 space-y-1">
              <div>• Amount: $5,000,000 EUR</div>
              <div>• Scope: Per-vendor cumulative (12-month rolling)</div>
              <div>• Currency: EUR with ECB FX rates</div>
              <div>• Warning: Alert at 85% of cumulative limit</div>
              <div>• Effective: 2026-Q2 onwards</div>
            </div>
          </div>

          {/* Example 3 */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="font-medium text-purple-900 mb-2">Example 3: Compound Threshold</div>
            <div className="text-sm text-purple-800 space-y-1">
              <div>• Condition 1: Amount &gt; $1,000,000 USD</div>
              <div>• AND Condition 2: Risk Score &gt; "High"</div>
              <div>• Result: Route to C-Suite for approval</div>
              <div>• Four-Eyes: Mandatory (CFO + Board member)</div>
              <div>• Warning: Alert at 80% of any limit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Implementation Notes */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-h3 font-semibold text-gray-900 mb-4">Technical Implementation Notes</h3>
        
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex gap-2">
            <span className="font-semibold">FX Conversion:</span>
            <span>Real-time ECB/Bloomberg rates cached daily, converted to USD base currency for evaluation</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">Cumulative Limits:</span>
            <span>12-month rolling window calculated at runtime from transaction history database</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">Four-Eyes Routing:</span>
            <span>Parallel approval paths created; both must approve before transaction proceeds</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">Version Control:</span>
            <span>Timestamp-based threshold selection using transaction submission time</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">Boundary Checks:</span>
            <span>System validates no overlapping bands during threshold save operation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
