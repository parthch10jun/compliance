'use client';

/**
 * Authority Matrix Detail View
 * View a specific authority matrix with all entries
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, Download, Archive, Copy, Eye, Calendar, User, DollarSign } from 'lucide-react';
import { mockAuthorityMatrices } from '@/lib/doa/data';

export default function AuthorityMatrixDetail() {
  const params = useParams();
  const matrixId = params.id as string;
  
  const matrix = mockAuthorityMatrices.find(m => m.id === matrixId);
  
  if (!matrix) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-h2 font-semibold text-gray-900 mb-2">Matrix Not Found</h2>
          <p className="text-gray-600 mb-4">The requested authority matrix could not be found.</p>
          <Link href="/doa/authority-matrix" className="text-[#F59E0B] hover:text-[#D97706]">
            ← Back to Authority Matrices
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/doa/authority-matrix"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">{matrix.name}</h1>
            <p className="text-p2 text-gray-600 mt-1">{matrix.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            href={`/doa/authority-matrix/${matrix.id}/grid`}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#F59E0B] text-[#F59E0B] rounded text-sm hover:bg-amber-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View in Grid
          </Link>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors text-gray-700">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors text-gray-700">
            <Copy className="w-3.5 h-3.5" />
            Duplicate
          </button>
          <Link
            href={`/doa/authority-matrix/${matrix.id}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded text-sm transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Matrix
          </Link>
        </div>
      </div>
      
      {/* Matrix Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Function</div>
          <div className="text-h3 font-semibold text-gray-900 mt-1">{matrix.function}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Version</div>
          <div className="text-h3 font-semibold text-gray-900 mt-1">v{matrix.version}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Status</div>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              matrix.status === 'Active' ? 'bg-green-100 text-green-800' :
              matrix.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {matrix.status}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Total Entries</div>
          <div className="text-h3 font-semibold text-gray-900 mt-1">{matrix.entries.length}</div>
        </div>
      </div>
      
      {/* Matrix Metadata */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Matrix Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Effective Date</div>
            <div className="text-gray-900">{new Date(matrix.effectiveDate).toLocaleDateString()}</div>
          </div>
          {matrix.expiryDate && (
            <div>
              <div className="text-sm text-gray-600 mb-1">Expiry Date</div>
              <div className="text-gray-900">{new Date(matrix.expiryDate).toLocaleDateString()}</div>
            </div>
          )}
          <div>
            <div className="text-sm text-gray-600 mb-1">Owner</div>
            <div className="text-gray-900">{matrix.ownerName}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Created</div>
            <div className="text-gray-900">{new Date(matrix.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      
      {/* Authority Entries Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-h3 font-semibold text-gray-900">Authority Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Decision Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Authority Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Required
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Threshold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documentation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {matrix.entries.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{entry.decisionType}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{entry.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {entry.authorityLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {entry.requiredRole}
                    {entry.requiredGrade && (
                      <div className="text-xs text-gray-500 mt-0.5">Grade: {entry.requiredGrade}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {entry.monetaryThreshold ? (
                      <div className="text-sm">
                        <div className="text-gray-900 font-medium">
                          ${entry.monetaryThreshold.min.toLocaleString()} - ${entry.monetaryThreshold.max.toLocaleString()}
                        </div>
                        <div className="text-gray-500 text-xs">{entry.monetaryThreshold.currency}</div>
                      </div>
                    ) : entry.nonMonetaryCondition ? (
                      <div className="text-sm text-gray-900">{entry.nonMonetaryCondition}</div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.approvalType === 'Single' ? 'bg-green-100 text-green-800' :
                      entry.approvalType === 'Multi-Level' ? 'bg-amber-100 text-amber-800' :
                      entry.approvalType === 'Parallel' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {entry.approvalType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {entry.requiresDocumentation && (
                        <div className="text-xs text-gray-600">✓ Docs required</div>
                      )}
                      {entry.requiresJustification && (
                        <div className="text-xs text-gray-600">✓ Justification required</div>
                      )}
                      {!entry.requiresDocumentation && !entry.requiresJustification && (
                        <span className="text-sm text-gray-500">None</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
