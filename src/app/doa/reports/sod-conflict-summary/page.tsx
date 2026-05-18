'use client';

/**
 * SoD Conflict Summary Report
 * Overview of segregation of duties conflicts and remediation status
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { mockSoDConflicts } from '@/lib/doa/data';

export default function SoDConflictSummaryReport() {
  const conflicts = mockSoDConflicts;
  const criticalCount = conflicts.filter(c => c.severity === 'Critical').length;
  const highCount = conflicts.filter(c => c.severity === 'High').length;
  const mediumCount = conflicts.filter(c => c.severity === 'Medium').length;
  const resolvedCount = conflicts.filter(c => c.status === 'Resolved').length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/reports" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">SoD Conflict Summary</h1>
            <p className="text-p2 text-gray-600 mt-1">
              Segregation of Duties conflict tracking and remediation status
            </p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Shield className="w-5 h-5" />
            <span className="text-p3">Total Conflicts</span>
          </div>
          <div className="text-h2 font-bold text-gray-900">{conflicts.length}</div>
          <p className="text-sm text-gray-500 mt-2">Detected conflicts</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-p3">Critical Severity</span>
          </div>
          <div className="text-h2 font-bold text-red-600">{criticalCount}</div>
          <p className="text-sm text-red-600 mt-2">Require immediate action</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-green-200 bg-green-50">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-p3">Resolved</span>
          </div>
          <div className="text-h2 font-bold text-green-600">{resolvedCount}</div>
          <p className="text-sm text-green-600 mt-2">Successfully remediated</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-p3">Avg Resolution Time</span>
          </div>
          <div className="text-h2 font-bold text-gray-900">12.5d</div>
          <p className="text-sm text-gray-500 mt-2">From detection to closure</p>
        </div>
      </div>
      
      {/* Severity Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Conflicts by Severity</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Critical</span>
              <span className="text-sm font-bold text-red-600">{criticalCount} conflicts</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600" 
                style={{ width: `${(criticalCount / conflicts.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">High</span>
              <span className="text-sm font-bold text-amber-600">{highCount} conflicts</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-600" 
                style={{ width: `${(highCount / conflicts.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Medium</span>
              <span className="text-sm font-bold text-blue-600">{mediumCount} conflicts</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600" 
                style={{ width: `${(mediumCount / conflicts.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Conflicts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Active Conflicts Requiring Attention</h2>
        
        <div className="space-y-3">
          {conflicts.filter(c => c.status !== 'Resolved').slice(0, 5).map((conflict) => (
            <Link
              key={conflict.id}
              href={`/doa/sod/conflicts/${conflict.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-[#F59E0B] hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-gray-900">{conflict.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      conflict.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      conflict.severity === 'High' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {conflict.severity}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      conflict.status === 'Under Review' ? 'bg-purple-100 text-purple-800' :
                      conflict.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {conflict.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{conflict.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Detected: {new Date(conflict.detectedDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Users affected: {conflict.affectedUsers.length}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Remediation Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Remediation Progress</h2>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Overall Remediation Rate</span>
            <span className="text-sm font-bold text-gray-900">
              {((resolvedCount / conflicts.length) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600" 
              style={{ width: `${(resolvedCount / conflicts.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-h3 font-bold text-gray-900">{conflicts.filter(c => c.status === 'Detected').length}</div>
            <div className="text-sm text-gray-600 mt-1">Detected</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-h3 font-bold text-purple-600">{conflicts.filter(c => c.status === 'Under Review').length}</div>
            <div className="text-sm text-gray-600 mt-1">Under Review</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-h3 font-bold text-green-600">{resolvedCount}</div>
            <div className="text-sm text-gray-600 mt-1">Resolved</div>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Recommendations</h2>
        <ul className="space-y-2 list-disc list-inside text-gray-700">
          <li>Prioritize remediation of {criticalCount} critical severity conflicts within 7 days</li>
          <li>Conduct role-based access review for users with multiple conflicts</li>
          <li>Implement automated SoD conflict detection for new role assignments</li>
          <li>Schedule monthly SoD governance committee meetings to review new conflicts</li>
        </ul>
      </div>
    </div>
  );
}
