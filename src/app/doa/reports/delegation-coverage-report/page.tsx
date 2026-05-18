'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, CheckCircle, AlertCircle } from 'lucide-react';

export default function DelegationCoverageReport() {
  const coverageByRole = [
    { role: 'C-Suite Executives', total: 5, covered: 5, coverage: 100 },
    { role: 'VPs & Senior Management', total: 18, covered: 18, coverage: 100 },
    { role: 'Directors', total: 42, covered: 40, coverage: 95.2 },
    { role: 'Managers', total: 156, covered: 142, coverage: 91.0 },
    { role: 'Team Leads', total: 89, covered: 75, coverage: 84.3 },
  ];
  
  const uncoveredRoles = [
    { name: 'Marketing Director (APAC)', role: 'Director', reason: 'Recently hired - delegation setup pending', priority: 'High' },
    { name: 'Regional Sales Manager (South)', role: 'Manager', reason: 'No suitable backup identified', priority: 'Medium' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/reports" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Delegation Coverage Report</h1>
            <p className="text-p2 text-gray-600 mt-1">Analysis of backup authority coverage across all critical roles</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Total Critical Roles</div>
          <div className="text-h2 font-bold text-gray-900">310</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-green-200 bg-green-50">
          <div className="text-p3 text-green-600 mb-2">With Backup Coverage</div>
          <div className="text-h2 font-bold text-green-600">280</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-amber-200 bg-amber-50">
          <div className="text-p3 text-amber-600 mb-2">Without Coverage</div>
          <div className="text-h2 font-bold text-amber-600">30</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-p3 text-gray-600 mb-2">Overall Coverage</div>
          <div className="text-h2 font-bold text-gray-900">90.3%</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Coverage by Role Level</h2>
        <div className="space-y-4">
          {coverageByRole.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{item.role}</span>
                  {item.coverage === 100 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : item.coverage >= 90 ? (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <span className="text-sm text-gray-600">{item.covered} of {item.total} ({item.coverage.toFixed(1)}%)</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    item.coverage === 100 ? 'bg-green-600' :
                    item.coverage >= 90 ? 'bg-amber-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${item.coverage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Uncovered Roles Requiring Attention</h2>
        <div className="space-y-3">
          {uncoveredRoles.map((role, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-gray-900">{role.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      role.priority === 'High' ? 'bg-red-100 text-red-800' :
                      role.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {role.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{role.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{role.reason}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Coverage Policy</h2>
        <ul className="space-y-2 list-disc list-inside text-gray-700">
          <li>All C-Suite and VP roles must have 100% delegation coverage (target: 2 backups)</li>
          <li>Directors and Managers must have minimum 90% coverage (target: 1 backup)</li>
          <li>Backup delegates must be trained and authorized within 30 days of role assignment</li>
          <li>Coverage reviewed quarterly and updated after organizational changes</li>
        </ul>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Recommendations</h2>
        <ul className="space-y-2 list-disc list-inside text-gray-700">
          <li>Immediately assign backup delegate for Marketing Director (APAC) - new hire onboarding gap</li>
          <li>Identify and train backup for Regional Sales Manager (South) within 14 days</li>
          <li>Improve Team Lead coverage from 84.3% to 90% target by adding 5 backup assignments</li>
          <li>Implement automated alerts when roles lack backup coverage for &gt;7 days</li>
        </ul>
      </div>
    </div>
  );
}
