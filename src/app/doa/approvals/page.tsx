'use client';

/**
 * Approvals Dashboard
 * My approvals and team approvals with filtering
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, CheckCircle2, XCircle, Plus, Search, Filter, AlertCircle } from 'lucide-react';
import { getPendingApprovals, getApprovedRequests, getRejectedRequests } from '@/lib/doa/data/enhancedData';
import { usePersona } from '@/contexts/PersonaContext';

export default function ApprovalsDashboard() {
  const { hasPermission } = usePersona();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  const pendingApprovals = getPendingApprovals();
  const approvedRequests = getApprovedRequests();
  const rejectedRequests = getRejectedRequests();
  
  const getCurrentApprovals = () => {
    switch (activeTab) {
      case 'pending':
        return pendingApprovals;
      case 'approved':
        return approvedRequests;
      case 'rejected':
        return rejectedRequests;
      default:
        return [];
    }
  };
  
  const filteredApprovals = getCurrentApprovals().filter(approval =>
    approval.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    approval.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    approval.requestedByName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">Approvals</h1>
          <p className="text-p2 text-gray-600 mt-1">
            Manage approval requests and view approval history
          </p>
        </div>

        {hasPermission('submitRequests') && (
          <Link
            href="/doa/approvals/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Submit Request
          </Link>
        )}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-[#F59E0B]" />
            <div>
              <div className="text-h2 font-bold text-gray-900">{pendingApprovals.length}</div>
              <div className="text-p3 text-gray-600">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">{approvedRequests.length}</div>
              <div className="text-p3 text-gray-600">Approved</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">{rejectedRequests.length}</div>
              <div className="text-p3 text-gray-600">Rejected</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">{pendingApprovals.length + approvedRequests.length + rejectedRequests.length}</div>
              <div className="text-p3 text-gray-600">Total Requests</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-[#F59E0B] text-[#F59E0B] font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending ({pendingApprovals.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'approved'
                ? 'border-[#F59E0B] text-[#F59E0B] font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Approved ({approvedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'rejected'
                ? 'border-[#F59E0B] text-[#F59E0B] font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Rejected ({rejectedRequests.length})
          </button>
        </nav>
      </div>
      
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search approvals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>
      
      {/* Approvals List */}
      <div className="space-y-3">
        {filteredApprovals.map((approval) => (
          <Link
            key={approval.id}
            href={`/doa/approvals/${approval.id}`}
            className="block bg-white rounded-lg p-6 border border-gray-200 hover:border-[#F59E0B] transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm text-gray-500">{approval.requestNumber}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                    {approval.status}
                  </span>
                  {approval.isEmergency && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Emergency
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{approval.description}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Requested by: {approval.requestedByName}</span>
                  <span>•</span>
                  <span>{new Date(approval.requestedDate).toLocaleDateString()}</span>
                  {approval.monetaryAmount && (
                    <>
                      <span>•</span>
                      <span className="font-semibold">${approval.monetaryAmount.toLocaleString()}</span>
                    </>
                  )}
                </div>
              </div>
              
              {approval.slaStatus && (
                <div className="ml-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    approval.slaStatus === 'On Time' ? 'bg-green-100 text-green-800' :
                    approval.slaStatus === 'At Risk' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {approval.slaStatus}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
        
        {filteredApprovals.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No approvals found</p>
          </div>
        )}
      </div>
    </div>
  );
}
