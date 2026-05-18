'use client';

/**
 * Advanced Threshold Builder
 * Demonstrates enterprise-grade threshold configuration capabilities
 */

/**
 * Advanced Threshold Builder
 * Implements BR-AT-01 through BR-AT-10
 */

import React, { useState } from 'react';
import { Plus, X, AlertTriangle, DollarSign, Users, Calendar, Globe } from 'lucide-react';
import type { Currency, ThresholdScope, NonMonetaryType } from '@/lib/doa/types/threshold-types';

interface AdvancedThresholdBuilderProps {
  onSave?: (config: any) => void;
}

export default function AdvancedThresholdBuilder({ onSave }: AdvancedThresholdBuilderProps) {
  const [thresholdType, setThresholdType] = useState<'monetary' | 'non_monetary' | 'compound'>('monetary');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [amount, setAmount] = useState('');
  const [scope, setScope] = useState<ThresholdScope>('absolute');
  const [fourEyesEnabled, setFourEyesEnabled] = useState(false);
  const [fourEyesAmount, setFourEyesAmount] = useState('');
  const [warningEnabled, setWarningEnabled] = useState(true);
  const [warningPercentage, setWarningPercentage] = useState(90);
  const [includeVAT, setIncludeVAT] = useState(true);
  const [includeDuty, setIncludeDuty] = useState(false);
  
  const currencies: Currency[] = [
    'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'AUD', 'CAD', 'CHF',
    'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'EGP', 'ILS', 'LBP',
    'SGD', 'HKD', 'KRW', 'MXN', 'BRL', 'ZAR'
  ];
  const scopes: ThresholdScope[] = ['absolute', 'cumulative', 'per_vendor', 'per_counterparty'];

  return (
    <div className="space-y-6">
      {/* Monetary Threshold Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="text-h3 font-semibold text-gray-900">Monetary Threshold</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Multi-currency support:</strong> Amounts will be converted to USD using ECB rates for evaluation
          </p>
        </div>
      </div>

      {/* Cumulative and Per-Vendor Thresholds */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="text-h3 font-semibold text-gray-900">Threshold Scope</h3>
        </div>

        <div className="space-y-3">
          {scopes.map((scopeOption) => (
            <label key={scopeOption} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="scope"
                value={scopeOption}
                checked={scope === scopeOption}
                onChange={(e) => setScope(e.target.value as ThresholdScope)}
                className="w-4 h-4 text-[#F59E0B]"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 capitalize">{scopeOption.replace('_', ' ')}</div>
                <div className="text-sm text-gray-600">
                  {scopeOption === 'absolute' && 'Single transaction limit'}
                  {scopeOption === 'cumulative' && '12-month rolling window limit'}
                  {scopeOption === 'per_vendor' && 'Limit per vendor over 12 months'}
                  {scopeOption === 'per_counterparty' && 'Limit per counterparty over 12 months'}
                </div>
              </div>
            </label>
          ))}
        </div>

        {scope === 'cumulative' && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-amber-900">Cumulative Limit Enforcement</div>
                <div className="text-sm text-amber-800 mt-1">
                  System will check total spend over last 12 months before approving this transaction
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Authority Bands */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="text-h3 font-semibold text-gray-900">Authority Band</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., 100000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Boundary</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
              <option value="inclusive">Inclusive (≤)</option>
              <option value="exclusive">Exclusive (&lt;)</option>
            </select>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Example: $0 - $100,000 (inclusive) means amounts from $0.00 up to and including $100,000.00
        </div>
      </div>

      {/* Warning Thresholds */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="text-h3 font-semibold text-gray-900">Approver Warning</h3>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={warningEnabled}
              onChange={(e) => setWarningEnabled(e.target.checked)}
              className="w-4 h-4 text-[#F59E0B] rounded"
            />
            <span className="text-sm font-medium text-gray-700">Enable</span>
          </label>
        </div>

        {warningEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warning Threshold (% of limit)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="100"
                value={warningPercentage}
                onChange={(e) => setWarningPercentage(parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="w-16 px-3 py-2 bg-gray-100 rounded text-center font-semibold">
                {warningPercentage}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Approver will be warned when transaction exceeds {warningPercentage}% of their authority limit
            </p>
          </div>
        )}
      </div>

      {/* Four-Eyes Principle */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="text-h3 font-semibold text-gray-900">Four-Eyes Principle</h3>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={fourEyesEnabled}
              onChange={(e) => setFourEyesEnabled(e.target.checked)}
              className="w-4 h-4 text-[#F59E0B] rounded"
            />
            <span className="text-sm font-medium text-gray-700">Enable</span>
          </label>
        </div>

        {fourEyesEnabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Four-Eyes Threshold Amount
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={fourEyesAmount}
                  onChange={(e) => setFourEyesAmount(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., 500000"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-sm text-purple-900">
                <strong>Two independent approvers required</strong> when amount exceeds{' '}
                {fourEyesAmount || '___'} {currency}
              </div>
              <div className="text-sm text-purple-800 mt-1">
                Both approvers must be at the same authority level or higher
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tax and Indirect Costs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-h3 font-semibold text-gray-900 mb-4">Tax & Indirect Costs</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={includeVAT}
              onChange={(e) => setIncludeVAT(e.target.checked)}
              className="w-4 h-4 text-[#F59E0B] rounded"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Include VAT/GST</div>
              <div className="text-sm text-gray-600">Evaluate threshold including value-added tax</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={includeDuty}
              onChange={(e) => setIncludeDuty(e.target.checked)}
              className="w-4 h-4 text-[#F59E0B] rounded"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Include Customs Duty</div>
              <div className="text-sm text-gray-600">Include import/export duties in threshold</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              className="w-4 h-4 text-[#F59E0B] rounded"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Include Shipping & Handling</div>
              <div className="text-sm text-gray-600">Include freight and logistics costs</div>
            </div>
          </label>
        </div>
      </div>

      {/* Effective Dating */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-h3 font-semibold text-gray-900 mb-4">Effective Dating</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Effective From *</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (Optional)</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-900">
            <strong>Version control:</strong> Changes will not affect transactions submitted before the effective date
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4">
        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
          Cancel
        </button>
        <button
          onClick={() => onSave && onSave({})}
          className="px-6 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-amber-600 font-medium"
        >
          Save Threshold Configuration
        </button>
      </div>
    </div>
  );
}

