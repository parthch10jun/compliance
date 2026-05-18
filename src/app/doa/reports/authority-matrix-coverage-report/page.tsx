'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, CheckCircle, AlertCircle } from 'lucide-react';

export default function AuthorityMatrixCoverageReport() {
  const coverageData = [
    { category: 'Financial Transactions', total: 158, covered: 150, coverage: 94.9 },
    { category: 'HR Decisions', total: 92, covered: 81, coverage: 88.0 },
    { category: 'IT Operations', total: 76, covered: 70, coverage: 92.1 },
    { category: 'Procurement', total: 134, covered: 128, coverage: 95.5 },
    { category: 'Legal & Compliance', total: 45, covered: 42, coverage: 93.3 },
    { category: 'Strategic Initiatives', total: 28, covered: 26, coverage: 92.9 },
  ];
  
  const uncoveredItems = [
    { item: 'Small value petty cash transactions (<$100)', category: 'Financial', risk: 'Low' },
    { item: 'Temporary contractor extensions (1 week)', category: 'HR', risk: 'Medium' },
    { item: 'Non-production server restarts', category: 'IT', risk: 'Low' },
    { item: 'Marketing collateral approvals', category: 'Procurement', risk: 'Low' },
    { item: 'Internal policy interpretation queries', category: 'Legal', risk: 'Medium' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/reports" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Authority Matrix Coverage Report</h1>
            <p className="text-p2 text-gray-600 mt-1">Analysis of DoA policy coverage across all decision categories</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Total Decision Types</div>
          <div className="text-h2 font-bold text-gray-900">533</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-green-200 bg-green-50">
          <div className="text-p3 text-green-600 mb-2">Covered by Matrix</div>
          <div className="text-h2 font-bold text-green-600">497</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Overall Coverage</div>
          <div className="text-h2 font-bold text-gray-900">93.2%</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Coverage by Category</h2>
        <div className="space-y-4">
          {coverageData.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{cat.category}</span>
                  {cat.coverage >= 90 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <span className="text-sm text-gray-600">{cat.covered} of {cat.total} ({cat.coverage}%)</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${cat.coverage >= 90 ? 'bg-green-600' : 'bg-amber-600'}`}
                  style={{ width: `${cat.coverage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Uncovered Decision Types</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Decision Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {uncoveredItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900">{item.item}</td>
                  <td className="py-4 px-4 text-gray-700">{item.category}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.risk === 'Low' ? 'bg-green-100 text-green-800' :
                      item.risk === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Recommendations</h2>
        <ul className="space-y-2 list-disc list-inside text-gray-700">
          <li>Add matrix entries for 2 medium-risk uncovered decision types within 30 days</li>
          <li>Document rationale for intentionally excluding low-risk items (&lt;$100)</li>
          <li>Increase HR decision coverage from 88% to 95% by adding contractor management rules</li>
          <li>Conduct quarterly review of uncovered decision types</li>
        </ul>
      </div>
    </div>
  );
}
