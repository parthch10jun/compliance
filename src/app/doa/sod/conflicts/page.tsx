'use client';

/**
 * SoD Conflicts List
 * All detected Segregation of Duties conflicts
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Search, Filter, Eye } from 'lucide-react';
import { mockSoDConflicts } from '@/lib/doa/data';

export default function SoDConflictsList() {
  const [activeTab, setActiveTab] = useState<'open' | 'remediated' | 'accepted' | 'all'>('open');
  const [searchQuery, setSearchQuery] = useState('');
  
  const allConflicts = mockSoDConflicts;
  
  const getConflictsForTab = () => {
    switch (activeTab) {
      case 'open':
        return allConflicts.filter(c => c.status === 'Open');
      case 'remediated':
        return allConflicts.filter(c => c.status === 'Remediated');
      case 'accepted':
        return allConflicts.filter(c => c.status === 'Accepted with Compensating Controls');
      default:
        return allConflicts;
    }
  };
  
  const conflicts = getConflictsForTab().filter(conflict =>
    conflict.ruleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conflict.conflictDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
  
  const openConflicts = allConflicts.filter(c => c.status === 'Open');
  const remediatedConflicts = allConflicts.filter(c => c.status === 'Remediated');
  const acceptedConflicts = allConflicts.filter(c => c.status === 'Accepted with Compensating Controls');
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">SoD Conflicts</h1>
          <p className="text-p2 text-gray-600 mt-1">
            All detected segregation of duties violations and conflicts
          </p>
        </div>
        
        <Link
          href="/doa/sod/rules"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
        >
          View Rules Library
        </Link>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="text-p3 text-gray-600">Open</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">{openConflicts.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="text-p3 text-gray-600">Remediated</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">{remediatedConflicts.length}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="text-p3 text-gray-600">Accepted</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">{acceptedConflicts.length}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="text-p3 text-gray-600">Critical Open</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">
            {allConflicts.filter(c => c.severity === 'Critical' && c.status === 'Open').length}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {[
            { key: 'open', label: 'Open', count: openConflicts.length },
            { key: 'remediated', label: 'Remediated', count: remediatedConflicts.length },
            { key: 'accepted', label: 'Accepted', count: acceptedConflicts.length },
            { key: 'all', label: 'All', count: allConflicts.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#F59E0B] text-[#F59E0B] font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>
      
      {/* Search and Filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conflicts..."
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
      
      {/* Conflicts List */}
      <div className="space-y-3">
        {conflicts.map((conflict) => (
          <Link
            key={conflict.id}
            href={`/doa/sod/conflicts/${conflict.id}`}
            className="block bg-white rounded-lg p-6 border border-gray-200 hover:border-[#F59E0B] transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(conflict.severity)}`}>
                    {conflict.severity}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(conflict.status)}`}>
                    {conflict.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{conflict.ruleName}</h3>
                <p className="text-sm text-gray-700 mb-3">{conflict.conflictDescription}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Affected: {conflict.affectedUserNames.join(', ')}</span>
                  <span>•</span>
                  <span>Detected: {new Date(conflict.detectedDate).toLocaleDateString()}</span>
                  {conflict.remediationDate && (
                    <>
                      <span>•</span>
                      <span>Remediated: {new Date(conflict.remediationDate).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
              <Eye className="w-5 h-5 text-gray-400 ml-4" />
            </div>
          </Link>
        ))}
        
        {conflicts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No conflicts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
