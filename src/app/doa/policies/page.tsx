'use client';

/**
 * DoA Policies List Page
 * Browse and manage policy versions
 */

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, FileText, Clock, CheckCircle, Archive, AlertTriangle,
  Search, Filter, Eye, GitCompare
} from 'lucide-react';
import { mockDoAPolicies } from '@/lib/doa/data/mockPolicies';
import type { PolicyState } from '@/lib/doa/types/policy-types';

export default function PoliciesPage() {
  const [filterState, setFilterState] = useState<PolicyState | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPolicies = mockDoAPolicies.filter(policy => {
    const matchesSearch = policy.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         policy.metadata.policyNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = filterState === 'all' || policy.state === filterState;
    return matchesSearch && matchesState;
  });
  
  const getStateIcon = (state: PolicyState) => {
    switch (state) {
      case 'draft': return FileText;
      case 'in_review': return Clock;
      case 'approved': return CheckCircle;
      case 'effective': return CheckCircle;
      case 'superseded': return Archive;
      case 'archived': return Archive;
    }
  };
  
  const getStateColor = (state: PolicyState) => {
    switch (state) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'in_review': return 'bg-blue-100 text-blue-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'effective': return 'bg-amber-100 text-amber-700';
      case 'superseded': return 'bg-orange-100 text-orange-700';
      case 'archived': return 'bg-slate-100 text-slate-700';
    }
  };
  
  const stateStats = {
    all: mockDoAPolicies.length,
    draft: mockDoAPolicies.filter(p => p.state === 'draft').length,
    in_review: mockDoAPolicies.filter(p => p.state === 'in_review').length,
    approved: mockDoAPolicies.filter(p => p.state === 'approved').length,
    effective: mockDoAPolicies.filter(p => p.state === 'effective').length,
    superseded: mockDoAPolicies.filter(p => p.state === 'superseded').length,
    archived: mockDoAPolicies.filter(p => p.state === 'archived').length,
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">DoA Policy Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage versioned policies with approval workflows and compliance tracking
          </p>
        </div>
        
        <Link
          href="/doa/policies/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          New Policy
        </Link>
      </div>
      
      {/* State Filter Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3 overflow-x-auto">
          {[
            { value: 'all', label: 'All Policies', count: stateStats.all },
            { value: 'effective', label: 'Effective', count: stateStats.effective },
            { value: 'in_review', label: 'In Review', count: stateStats.in_review },
            { value: 'approved', label: 'Approved', count: stateStats.approved },
            { value: 'draft', label: 'Drafts', count: stateStats.draft },
            { value: 'superseded', label: 'Superseded', count: stateStats.superseded },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterState(tab.value as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                filterState === tab.value
                  ? 'bg-[#F59E0B] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="font-medium">{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                filterState === tab.value
                  ? 'bg-white/20 text-white'
                  : 'bg-white text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search policies by title or number..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* Featured: Procurement Policy (Screen 8 Demo) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-300 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-amber-600" />
              <h3 className="text-xl font-bold text-gray-900">DOA Policy · Procurement</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-300">
                Effective
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              5 versions · current effective: v2026.2 · next: v2026.3 (in review)
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Policy Number: DOA-PROC-Policy</span>
              <span>•</span>
              <span>Last updated: 01 Apr 2026</span>
              <span>•</span>
              <span className="text-amber-700 font-medium">+12 added, 8 changed, −3 removed in v2026.3</span>
            </div>
          </div>
          <Link
            href="/doa/policies/procurement"
            className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            <GitCompare className="w-4 h-4" />
            View Versions & Diff
          </Link>
        </div>
      </div>

      {/* Policies List */}
      <div className="space-y-3">
        {filteredPolicies.map((policy) => {
          const StateIcon = getStateIcon(policy.state);
          
          return (
            <Link
              key={policy.metadata.policyId}
              href={`/doa/policies/${policy.metadata.policyId}`}
              className="block bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-[#F59E0B] transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <FileText className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{policy.metadata.title}</h3>
                      {policy.metadata.isHotfix && (
                        <span className="px-2 py-1 bg-red-100 border border-red-300 text-red-700 rounded text-xs font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          HOTFIX
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="font-mono">{policy.metadata.policyNumber}</span>
                      <span>•</span>
                      <span>v{policy.metadata.version}</span>
                      <span>•</span>
                      <span>{policy.metadata.department}</span>
                      <span>•</span>
                      <span>Effective: {new Date(policy.metadata.effectiveDate).toLocaleDateString()}</span>
                    </div>
                    
                    <p className="text-sm text-gray-700 line-clamp-2">{policy.metadata.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStateColor(policy.state)}`}>
                    <StateIcon className="w-4 h-4" />
                    {policy.state.replace('_', ' ').charAt(0).toUpperCase() + policy.state.slice(1).replace('_', ' ')}
                  </span>
                  
                  {policy.approvalWorkflow && (
                    <div className="text-sm text-gray-600">
                      {policy.approvalWorkflow.requiredApprovers.filter(a => a.status === 'approved').length}/
                      {policy.approvalWorkflow.requiredApprovers.length} approvals
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
        
        {filteredPolicies.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No policies found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
