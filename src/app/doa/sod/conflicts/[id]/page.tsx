'use client';

/**
 * SoD Conflict Detail
 * Detailed view of a specific SoD conflict
 */

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, AlertTriangle, CheckCircle, User, Calendar, Shield } from 'lucide-react';
import { mockSoDConflicts } from '@/lib/doa/data';

export default function SoDConflictDetail() {
  const params = useParams();
  const conflictId = params.id as string;
  
  const conflict = mockSoDConflicts.find(c => c.id === conflictId);
  
  if (!conflict) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-h2 font-semibold text-gray-900 mb-2">Conflict Not Found</h2>
          <p className="text-gray-600 mb-4">The requested SoD conflict could not be found.</p>
          <Link href="/doa/sod/conflicts" className="text-[#F59E0B] hover:text-[#D97706]">
            ← Back to Conflicts
          </Link>
        </div>
      </div>
    );
  }
  
  const getSeverityColor = (severity: string) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-800 border-red-200',
      'High': 'bg-orange-100 text-orange-800 border-orange-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Low': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/doa/sod/conflicts"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-h1 font-semibold text-gray-900">SoD Conflict #{conflict.id.slice(0, 8)}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(conflict.severity)}`}>
                {conflict.severity}
              </span>
            </div>
            <p className="text-p2 text-gray-600">{conflict.ruleName}</p>
          </div>
        </div>
        
        {conflict.status === 'Open' && (
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
              Accept with Controls
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              Mark Remediated
            </button>
          </div>
        )}
      </div>
      
      {/* Status Banner */}
      {conflict.status === 'Open' && conflict.severity === 'Critical' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Critical SoD Conflict</h3>
              <p className="text-sm text-red-700 mt-1">
                This critical conflict requires immediate attention and remediation.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Conflict Details */}
        <div className="col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-h3 font-semibold text-gray-900 mb-4">Conflict Description</h2>
            <p className="text-gray-700">{conflict.conflictDescription}</p>
          </div>
          
          {/* Affected Users */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-h3 font-semibold text-gray-900 mb-4">Affected Users</h2>
            <div className="space-y-3">
              {conflict.affectedUserNames.map((userName, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-700" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{userName}</div>
                    <div className="text-sm text-gray-600">User ID: {conflict.affectedUserIds[index]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Conflicting Functions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-h3 font-semibold text-gray-900 mb-4">Conflicting Functions</h2>
            <div className="grid grid-cols-2 gap-4">
              {conflict.conflictingFunctions.map((func, index) => (
                <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="font-medium text-red-900">{func}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Remediation Actions */}
          {conflict.remediationActions && conflict.remediationActions.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-h3 font-semibold text-gray-900 mb-4">Remediation Actions</h2>
              <div className="space-y-2">
                {conflict.remediationActions.map((action, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-gray-700">{action}</span>
                  </div>
                ))}
              </div>
              {conflict.remediatedByName && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Remediated by <span className="font-medium">{conflict.remediatedByName}</span> on{' '}
                    {new Date(conflict.remediationDate!).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Compensating Controls */}
          {conflict.compensatingControls && conflict.compensatingControls.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-h3 font-semibold text-gray-900 mb-4">Compensating Controls</h2>
              <div className="space-y-2">
                {conflict.compensatingControls.map((control, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span className="text-gray-700">{control}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-h4 font-semibold text-gray-900 mb-3">Status</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Current Status</div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  conflict.status === 'Open' ? 'bg-red-100 text-red-800' :
                  conflict.status === 'Remediated' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {conflict.status}
                </span>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Severity</div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(conflict.severity)}`}>
                  {conflict.severity}
                </span>
              </div>
            </div>
          </div>
          
          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-h4 font-semibold text-gray-900 mb-3">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-600">Detected</div>
                  <div className="text-gray-900 font-medium">
                    {new Date(conflict.detectedDate).toLocaleString()}
                  </div>
                </div>
              </div>
              
              {conflict.remediationDate && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600">Remediated</div>
                    <div className="text-gray-900 font-medium">
                      {new Date(conflict.remediationDate).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Rule Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-h4 font-semibold text-gray-900 mb-3">Related Rule</h3>
            <div>
              <div className="text-sm text-gray-600 mb-1">Rule ID</div>
              <Link href={`/doa/sod/rules`} className="text-[#F59E0B] hover:text-[#D97706]">
                {conflict.ruleId}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
