'use client';

/**
 * SoD Monitoring Dashboard
 * Segregation of Duties conflict monitoring and management
 */

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, AlertCircle, CheckCircle, Shield, XCircle, Eye } from 'lucide-react';
import { mockSoDConflicts, mockSoDRules, getOpenSoDConflicts } from '@/lib/doa/data';

export default function SoDMonitoring() {
  const allConflicts = mockSoDConflicts;
  const allRules = mockSoDRules;
  const openConflicts = getOpenSoDConflicts();
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800';
      case 'Remediated':
        return 'bg-green-100 text-green-800';
      case 'Accepted with Compensating Controls':
        return 'bg-blue-100 text-blue-800';
      case 'Override Approved':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">SoD Monitoring</h1>
          <p className="text-p2 text-gray-600 mt-1">
            Monitor segregation of duties conflicts and compliance
          </p>
        </div>
        
        <Link
          href="/doa/sod/rules"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
        >
          <Shield className="w-4 h-4" />
          View Rules Library
        </Link>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">{openConflicts.length}</div>
              <div className="text-p3 text-gray-600">Open Conflicts</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">
                {allConflicts.filter(c => c.status === 'Remediated').length}
              </div>
              <div className="text-p3 text-gray-600">Remediated</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">{allRules.filter(r => r.isActive).length}</div>
              <div className="text-p3 text-gray-600">Active Rules</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-orange-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">
                {allConflicts.filter(c => c.severity === 'Critical' && c.status === 'Open').length}
              </div>
              <div className="text-p3 text-gray-600">Critical Open</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Critical Conflicts Alert */}
      {openConflicts.filter(c => c.severity === 'Critical').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900">Critical SoD Conflicts Detected</h3>
              <p className="text-sm text-red-700 mt-1">
                {openConflicts.filter(c => c.severity === 'Critical').length} critical segregation of duties conflicts require immediate attention.
              </p>
            </div>
            <Link
              href="/doa/sod/conflicts"
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
            >
              Review Now
            </Link>
          </div>
        </div>
      )}
      
      {/* Conflicts by Severity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Conflicts by Severity</h2>
        <div className="space-y-3">
          {['Critical', 'High', 'Medium', 'Low'].map((severity) => {
            const count = allConflicts.filter(c => c.severity === severity && c.status === 'Open').length;
            const total = allConflicts.filter(c => c.severity === severity).length;
            return (
              <div key={severity} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(severity)}`}>
                    {severity}
                  </span>
                  <span className="text-sm text-gray-600">{count} open / {total} total</span>
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        severity === 'Critical' ? 'bg-red-600' :
                        severity === 'High' ? 'bg-orange-500' :
                        severity === 'Medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{total > 0 ? Math.round((count / total) * 100) : 0}%</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Recent Conflicts */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-h3 font-semibold text-gray-900">Recent Conflicts</h2>
          <Link href="/doa/sod/conflicts" className="text-sm text-[#F59E0B] hover:text-[#D97706]">
            View All →
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {allConflicts.slice(0, 5).map((conflict) => (
            <Link
              key={conflict.id}
              href={`/doa/sod/conflicts/${conflict.id}`}
              className="block px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(conflict.severity)}`}>
                      {conflict.severity}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(conflict.status)}`}>
                      {conflict.status}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{conflict.ruleName}</h3>
                  <p className="text-sm text-gray-600 mb-2">{conflict.conflictDescription}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Affected: {conflict.affectedUserNames.join(', ')}</span>
                    <span>•</span>
                    <span>{new Date(conflict.detectedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <Eye className="w-5 h-5 text-gray-400 ml-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
