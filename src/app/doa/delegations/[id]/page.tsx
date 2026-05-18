'use client';

/**
 * Delegation Detail View
 * View a specific delegation record
 */

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, XCircle, CheckCircle, Calendar, User, AlertCircle } from 'lucide-react';
import { mockDelegations } from '@/lib/doa/data';

export default function DelegationDetail() {
  const params = useParams();
  const delegationId = params.id as string;
  
  const delegation = mockDelegations.find(d => d.id === delegationId);
  
  if (!delegation) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-h2 font-semibold text-gray-900 mb-2">Delegation Not Found</h2>
          <p className="text-gray-600 mb-4">The requested delegation could not be found.</p>
          <Link href="/doa/delegations" className="text-[#F59E0B] hover:text-[#D97706]">
            ← Back to Delegations
          </Link>
        </div>
      </div>
    );
  }
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'OOO':
        return 'bg-blue-100 text-blue-800';
      case 'Permanent':
        return 'bg-green-100 text-green-800';
      case 'Acting':
      case 'Interim':
        return 'bg-purple-100 text-purple-800';
      case 'Project-Based':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const isExpiringSoon = delegation.endDate && 
    new Date(delegation.endDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/doa/delegations"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-h1 font-semibold text-gray-900">Delegation #{delegation.id.slice(0, 8)}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(delegation.type)}`}>
                {delegation.type}
              </span>
              {delegation.isActive ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-p2 text-gray-600">{delegation.authorityType}</p>
          </div>
        </div>
        
        {delegation.isActive && (
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
              <XCircle className="w-5 h-5" />
              Revoke
            </button>
            <Link
              href={`/doa/delegations/${delegation.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
            >
              <Edit className="w-5 h-5" />
              Edit
            </Link>
          </div>
        )}
      </div>
      
      {/* Alert if expiring soon */}
      {isExpiringSoon && delegation.isActive && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-orange-900">Delegation Expiring Soon</h3>
              <p className="text-sm text-orange-700 mt-1">
                This delegation will expire on {new Date(delegation.endDate!).toLocaleDateString()}.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Delegation Details */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="col-span-2 space-y-6">
          {/* Parties Involved */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-h3 font-semibold text-gray-900 mb-4">Parties Involved</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 mb-2 font-medium">Delegator (From)</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{delegation.delegatorName}</div>
                    <div className="text-sm text-gray-600">ID: {delegation.delegatorId}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 mb-2 font-medium">Delegate (To)</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{delegation.delegateName}</div>
                    <div className="text-sm text-gray-600">ID: {delegation.delegateId}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Authority Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-h3 font-semibold text-gray-900 mb-4">Authority Details</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Authority Type</div>
                <div className="text-gray-900 font-medium">{delegation.authorityType}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Scope</div>
                <div className="text-gray-900">{delegation.scope}</div>
              </div>
              
              {delegation.limitations && delegation.limitations.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">Limitations</div>
                  <ul className="list-disc list-inside space-y-1">
                    {delegation.limitations.map((limitation, index) => (
                      <li key={index} className="text-sm text-gray-700">{limitation}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {delegation.reason && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Reason</div>
                  <div className="text-gray-900">{delegation.reason}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-h3 font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-600">Start Date</div>
                  <div className="text-gray-900 font-medium">
                    {new Date(delegation.startDate).toLocaleDateString()} at {new Date(delegation.startDate).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              {delegation.endDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600">End Date</div>
                    <div className="text-gray-900 font-medium">
                      {new Date(delegation.endDate).toLocaleDateString()} at {new Date(delegation.endDate).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-600">Created</div>
                  <div className="text-gray-900">{new Date(delegation.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-h4 font-semibold text-gray-900 mb-3">Status</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Current Status</div>
                {delegation.isActive ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 font-medium">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">Inactive</span>
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Type</div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(delegation.type)}`}>
                  {delegation.type}
                </span>
              </div>
            </div>
          </div>
          
          {/* Approval Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-h4 font-semibold text-gray-900 mb-3">Approval</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Approved By</div>
                <div className="text-gray-900">{delegation.approvedByName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Approval Date</div>
                <div className="text-gray-900">{new Date(delegation.approvedDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
