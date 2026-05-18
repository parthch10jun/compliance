'use client';

/**
 * Authority Matrix Templates Library
 * Pre-configured templates for common business functions
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, Copy } from 'lucide-react';

export default function AuthorityMatrixTemplates() {
  const templates = [
    {
      id: 'tmpl-001',
      name: 'Standard Financial Approvals',
      function: 'Financial',
      entries: 45,
      description: 'Comprehensive financial approval authority matrix covering POs, expenses, budgets, and capital expenditures',
      popular: true,
    },
    {
      id: 'tmpl-002',
      name: 'HR Operations & Compensation',
      function: 'HR',
      entries: 32,
      description: 'HR authority matrix for hiring, promotions, salary adjustments, and terminations',
      popular: true,
    },
    {
      id: 'tmpl-003',
      name: 'IT & Technology Procurement',
      function: 'IT',
      entries: 28,
      description: 'IT-specific approvals for software licenses, hardware, cloud services, and vendor contracts',
      popular: false,
    },
    {
      id: 'tmpl-004',
      name: 'Procurement & Vendor Management',
      function: 'Procurement',
      entries: 38,
      description: 'Procurement authority for RFPs, vendor selection, contract negotiations, and PO approvals',
      popular: true,
    },
    {
      id: 'tmpl-005',
      name: 'Legal & Contract Approvals',
      function: 'Legal',
      entries: 24,
      description: 'Legal authority for contract reviews, NDAs, compliance approvals, and legal spend',
      popular: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/authority-matrix" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Authority Matrix Templates</h1>
            <p className="text-p2 text-gray-600 mt-1">Pre-configured templates for common business functions</p>
          </div>
        </div>
        <Link
          href="/doa/authority-matrix/new"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Create Custom Matrix
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="text-p3 text-gray-600">Total Templates</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">{templates.length}</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-p3 text-gray-600">Most Popular</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">Financial Approvals</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-p3 text-gray-600">Average Entries</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">33</div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-4">
        {templates.map(template => (
          <div
            key={template.id}
            className="bg-white rounded-lg border border-gray-200 hover:border-[#F59E0B] transition-all p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-6 h-6 text-gray-400" />
                  <h3 className="text-h3 font-semibold text-gray-900">{template.name}</h3>
                  {template.popular && (
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Function: <strong className="text-gray-700">{template.function}</strong></span>
                  <span>•</span>
                  <span>{template.entries} authority entries</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <Link
                  href={`/doa/authority-matrix/new?template=${template.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
                >
                  <Copy className="w-4 h-4" />
                  Use Template
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Templates provide a starting point with pre-configured authority levels and approval workflows. 
          You can customize them after creation to match your organization's specific needs.
        </p>
      </div>
    </div>
  );
}
