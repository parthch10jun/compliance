'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, CheckCircle } from 'lucide-react';

export default function MatrixVersionHistory() {
  const versionHistory = [
    {
      version: 'v2.1',
      matrix: 'Financial Authority Matrix',
      effectiveDate: '2026-01-15',
      approvedBy: 'Board of Directors',
      approvalDate: '2025-12-20',
      changes: 'Updated capital expenditure thresholds (+15% inflation adjustment)',
      status: 'Active',
    },
    {
      version: 'v2.0',
      matrix: 'Financial Authority Matrix',
      effectiveDate: '2025-07-01',
      approvedBy: 'Board of Directors',
      approvalDate: '2025-06-15',
      changes: 'Added cryptocurrency transaction authorization rules',
      status: 'Superseded',
    },
    {
      version: 'v1.8',
      matrix: 'HR Authority Matrix',
      effectiveDate: '2025-09-01',
      approvedBy: 'CEO',
      approvalDate: '2025-08-15',
      changes: 'Updated hiring authority levels for regional managers',
      status: 'Active',
    },
    {
      version: 'v1.0',
      matrix: 'Financial Authority Matrix',
      effectiveDate: '2025-01-01',
      approvedBy: 'Board of Directors',
      approvalDate: '2024-12-10',
      changes: 'Initial version - consolidated from 3 legacy policies',
      status: 'Superseded',
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/reports" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Authority Matrix Version History</h1>
            <p className="text-p2 text-gray-600 mt-1">Complete change log for all authority matrices</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export History
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Total Versions</div>
          <div className="text-h2 font-bold text-gray-900">12</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-green-200 bg-green-50">
          <div className="text-p3 text-green-600 mb-2">Active Versions</div>
          <div className="text-h2 font-bold text-green-600">3</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Last Update</div>
          <div className="text-h2 font-bold text-gray-900">Jan 15</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-h3 font-semibold text-gray-900">Version History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {versionHistory.map((ver, idx) => (
            <div key={idx} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${ver.status === 'Active' ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <FileText className={`w-5 h-5 ${ver.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-h4 font-semibold text-gray-900">{ver.matrix}</h3>
                      <span className="text-sm font-medium text-[#F59E0B]">{ver.version}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ver.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {ver.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{ver.changes}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>Effective: {new Date(ver.effectiveDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Approved by: {ver.approvedBy}</span>
                      <span>•</span>
                      <span>Approved: {new Date(ver.approvalDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {ver.status === 'Active' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Version Control Policy</h2>
        <ul className="space-y-2 list-disc list-inside text-gray-700">
          <li>All matrix changes require Board approval for Financial matrices, CEO approval for HR/IT matrices</li>
          <li>Minimum 2-week notice period before new version takes effect</li>
          <li>All superseded versions retained for 7 years for audit purposes</li>
          <li>Annual comprehensive review required for all matrices</li>
        </ul>
      </div>
    </div>
  );
}
