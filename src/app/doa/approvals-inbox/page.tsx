'use client';

/**
 * Approver Inbox - Screen 1
 * Production-grade pending approvals inbox with bulk actions, inline approve/reject,
 * SoD status, SLA bars, advanced filtering, and keyboard shortcuts
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Download, CheckCircle2, XCircle, MoreVertical, AlertTriangle,
  Info, Clock, Filter as FilterIcon, X, Search
} from 'lucide-react';
import { mockApprovalRequests } from '@/lib/doa/data/mockApprovals';

type SoDStatus = 'CLR' | 'WRN' | 'BLK';

interface FilterState {
  function: string[];
  entity: string[];
  amount: { min: number; max: number } | null;
  sla: string[];
  sod: SoDStatus[];
  age: number | null;
  keyword: string;
}

export default function ApproverInboxPage() {
  // State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    function: [],
    entity: [],
    amount: null,
    sla: [],
    sod: [],
    age: null,
    keyword: '',
  });
  const [showBulkApproveDialog, setShowBulkApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [bulkComment, setBulkComment] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  // Get pending approvals
  const pendingApprovals = mockApprovalRequests.filter(req => req.status === 'Pending');
  
  // Apply filters
  const filteredApprovals = pendingApprovals.filter(approval => {
    // Keyword search
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const matchesKeyword = 
        approval.requestNumber.toLowerCase().includes(keyword) ||
        approval.description.toLowerCase().includes(keyword) ||
        approval.requestedByName.toLowerCase().includes(keyword) ||
        (approval.function && approval.function.toLowerCase().includes(keyword));
      
      if (!matchesKeyword) return false;
    }
    
    // Function filter
    if (filters.function.length > 0 && approval.function) {
      if (!filters.function.includes(approval.function)) return false;
    }
    
    // SoD filter
    if (filters.sod.length > 0 && approval.sodStatus) {
      if (!filters.sod.includes(approval.sodStatus as SoDStatus)) return false;
    }
    
    // SLA filter
    if (filters.sla.length > 0) {
      if (!filters.sla.includes(approval.slaStatus || '')) return false;
    }
    
    return true;
  });
  
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredApprovals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedApprovals = filteredApprovals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  // Get unique functions for filter
  const availableFunctions = Array.from(new Set(pendingApprovals.map(a => a.function).filter(Boolean)));
  
  // Toggle selection
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };
  
  // Select all
  const selectAll = () => {
    if (selectedIds.size === paginatedApprovals.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedApprovals.map(a => a.id)));
    }
  };
  
  // Get SoD chip styling
  const getSoDChip = (status: SoDStatus | undefined) => {
    if (!status) status = 'CLR';
    
    switch (status) {
      case 'CLR':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">CLR</span>;
      case 'WRN':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">WRN</span>;
      case 'BLK':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">BLK</span>;
    }
  };
  
  // Get SLA bar color
  const getSLABarColor = (percentage: number) => {
    if (percentage < 50) return 'bg-gray-400';
    if (percentage < 80) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Inline approve (only for CLR and < $50K)
  const canInlineApprove = (approval: any) => {
    return approval.sodStatus === 'CLR' && (approval.monetaryAmount || 0) < 50000;
  };
  
  // Handle inline approve
  const handleInlineApprove = (id: string) => {
    console.log('Inline approve:', id);
    // In production, this would call the API
    alert(`Approved request ${id}`);
  };
  
  // Handle inline reject
  const handleInlineReject = (id: string) => {
    setRejectId(id);
    setShowRejectDialog(true);
  };
  
  // Confirm reject
  const confirmReject = () => {
    if (!rejectComment.trim()) {
      alert('Rejection comment is required');
      return;
    }
    console.log('Reject:', rejectId, rejectComment);
    alert(`Rejected request ${rejectId}`);
    setShowRejectDialog(false);
    setRejectId(null);
    setRejectComment('');
  };
  
  // Handle bulk approve
  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;
    setShowBulkApproveDialog(true);
  };

  // Confirm bulk approve
  const confirmBulkApprove = () => {
    if (!bulkComment.trim()) {
      alert('Bulk approve comment is required');
      return;
    }
    console.log('Bulk approve:', Array.from(selectedIds), bulkComment);
    alert(`Bulk approved ${selectedIds.size} requests`);
    setShowBulkApproveDialog(false);
    setSelectedIds(new Set());
    setBulkComment('');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // J/K navigation
      if (e.key === 'j' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, paginatedApprovals.length - 1));
      } else if (e.key === 'k' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
      }

      // A approve, R reject
      else if (e.key === 'a' && !e.metaKey && !e.ctrlKey && paginatedApprovals[focusedIndex]) {
        e.preventDefault();
        const approval = paginatedApprovals[focusedIndex];
        if (canInlineApprove(approval)) {
          handleInlineApprove(approval.id);
        }
      } else if (e.key === 'r' && !e.metaKey && !e.ctrlKey && paginatedApprovals[focusedIndex]) {
        e.preventDefault();
        handleInlineReject(paginatedApprovals[focusedIndex].id);
      }

      // Cmd+Enter for bulk approve
      else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && selectedIds.size > 0) {
        e.preventDefault();
        handleBulkApprove();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, paginatedApprovals, selectedIds]);

  // Toggle filter chip
  const toggleFilterChip = (type: keyof FilterState, value: any) => {
    setFilters(prev => {
      if (type === 'function' || type === 'sod' || type === 'sla') {
        const current = prev[type] as string[];
        const newValues = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value];
        return { ...prev, [type]: newValues };
      }
      return prev;
    });
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-sm text-gray-600 mt-1">
            {filteredApprovals.length} item{filteredApprovals.length !== 1 ? 's' : ''} requiring your action
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkApprove}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <CheckCircle2 className="w-4 h-4" />
              Bulk approve ({selectedIds.size})
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          {/* Function Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Function:</span>
            <select
              className="text-sm border border-gray-300 rounded px-2 py-1"
              onChange={(e) => e.target.value && toggleFilterChip('function', e.target.value)}
            >
              <option value="">Any</option>
              {availableFunctions.map(func => (
                <option key={func} value={func}>{func}</option>
              ))}
            </select>
          </div>

          {/* Amount Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Amount:</span>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option>Any</option>
              <option>&lt; $50K</option>
              <option>$50K - $500K</option>
              <option>&gt; $500K</option>
            </select>
          </div>

          {/* SLA Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">SLA:</span>
            <select
              className="text-sm border border-gray-300 rounded px-2 py-1"
              onChange={(e) => e.target.value && toggleFilterChip('sla', e.target.value)}
            >
              <option value="">Any</option>
              <option value="On Time">On Time</option>
              <option value="At Risk">At Risk</option>
              <option value="Breached">Breached</option>
            </select>
          </div>

          {/* SoD Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">SoD:</span>
            <select
              className="text-sm border border-gray-300 rounded px-2 py-1"
              onChange={(e) => e.target.value && toggleFilterChip('sod', e.target.value)}
            >
              <option value="">Any</option>
              <option value="CLR">Clear</option>
              <option value="WRN">Warning</option>
              <option value="BLK">Blocked</option>
            </select>
          </div>

          {/* Age Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Older than:</span>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option>24h</option>
              <option>3 days</option>
              <option>7 days</option>
            </select>
          </div>

          {/* Keyword Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Filter by keyword..."
                value={filters.keyword}
                onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              />
            </div>
          </div>

          {/* Active filters */}
          {(filters.function.length > 0 || filters.sod.length > 0 || filters.sla.length > 0) && (
            <div className="flex items-center gap-2 ml-auto">
              {filters.function.map(f => (
                <span key={f} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  {f}
                  <button onClick={() => toggleFilterChip('function', f)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.sod.map(s => (
                <span key={s} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  SoD: {s}
                  <button onClick={() => toggleFilterChip('sod', s)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paginatedApprovals.length && paginatedApprovals.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Request</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Function / Cat.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Originator</th>
                <th className="px-4 py-3 text-left text-sm font-semibold w-32">Age vs SLA</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">SoD</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Step</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedApprovals.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <CheckCircle2 className="w-12 h-12 text-gray-300" />
                      <div>
                        <p className="text-gray-900 font-medium">No pending approvals</p>
                        <p className="text-sm text-gray-600 mt-1">You're all caught up!</p>
                      </div>
                      <Link
                        href="/doa/approvals"
                        className="text-sm text-[#F59E0B] hover:text-amber-700"
                      >
                        View recent activity →
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedApprovals.map((approval, index) => {
                  const isSelected = selectedIds.has(approval.id);
                  const isFocused = index === focusedIndex;
                  const slaPercentage = approval.slaPercentageElapsed || 0;

                  return (
                    <tr
                      key={approval.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        isFocused ? 'ring-2 ring-[#F59E0B] ring-inset' : ''
                      } ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelection(approval.id)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </td>

                      {/* Request Number */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/doa/approvals/${approval.id}`}
                          className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {approval.requestNumber}
                        </Link>
                      </td>

                      {/* Request Title */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/doa/approvals/${approval.id}`}
                          className="text-sm text-gray-900 hover:text-[#F59E0B] line-clamp-2"
                        >
                          {approval.description}
                        </Link>
                      </td>

                      {/* Function / Category */}
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">
                          {approval.function || approval.requestType}
                          {approval.category && (
                            <>
                              <span className="text-gray-400 mx-1">/</span>
                              <span className="text-gray-600">{approval.category}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-gray-900">
                          {approval.monetaryDisplay || (
                            approval.monetaryAmount
                              ? `$${approval.monetaryAmount.toLocaleString()} ${approval.currency || 'USD'}`
                              : '—'
                          )}
                        </div>
                      </td>

                      {/* Originator */}
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">{approval.requestedByName}</div>
                      </td>

                      {/* Age vs SLA Bar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 relative">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-full ${getSLABarColor(slaPercentage)} transition-all`}
                                style={{ width: `${Math.min(slaPercentage, 100)}%` }}
                                title={`${slaPercentage}% elapsed`}
                              />
                            </div>
                          </div>
                          {slaPercentage >= 80 && (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                      </td>

                      {/* SoD Chip */}
                      <td className="px-4 py-3 text-center">
                        {getSoDChip(approval.sodStatus as SoDStatus)}
                      </td>

                      {/* Step */}
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-gray-700">
                          {approval.currentStep}/{approval.totalSteps || '?'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {canInlineApprove(approval) ? (
                            <button
                              onClick={() => handleInlineApprove(approval.id)}
                              className="px-3 py-1.5 bg-gray-800 text-white rounded text-xs font-medium hover:bg-gray-700 transition-colors"
                            >
                              Approve
                            </button>
                          ) : (
                            <Link
                              href={`/doa/approvals/${approval.id}`}
                              className="px-3 py-1.5 bg-gray-800 text-white rounded text-xs font-medium hover:bg-gray-700 transition-colors"
                            >
                              Review
                            </Link>
                          )}
                          <button
                            onClick={() => handleInlineReject(approval.id)}
                            className="px-3 py-1.5 bg-gray-800 text-white rounded text-xs font-medium hover:bg-gray-700 transition-colors"
                          >
                            Reject
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredApprovals.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredApprovals.length)} of {filteredApprovals.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Help Annotations (from wireframe) */}
      <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <strong>SLA bar</strong> — colour shifts to red when &gt;80% elapsed
        </div>
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <strong>SoD chip:</strong> CLR (clear), WRN (warning), BLK (blocked)
        </div>
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <strong>Bulk actions:</strong> shift-click; bulk actions appear in toolbar
        </div>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Keyboard shortcuts:</strong> J/K navigate • A approve • R reject • ⌘+Enter submit bulk approve
          </div>
        </div>
      </div>

      {/* Bulk Approve Dialog */}
      {showBulkApproveDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowBulkApproveDialog(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Bulk Approve</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Approve {selectedIds.size} selected request{selectedIds.size !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Items ({selectedIds.size})
                  </label>
                  <div className="max-h-40 overflow-y-auto bg-gray-50 rounded p-3 space-y-1">
                    {Array.from(selectedIds).map(id => {
                      const approval = filteredApprovals.find(a => a.id === id);
                      return approval ? (
                        <div key={id} className="text-sm text-gray-700 font-mono">
                          {approval.requestNumber} — {approval.description.substring(0, 50)}...
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={bulkComment}
                    onChange={(e) => setBulkComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                    placeholder="Provide a reason for bulk approval..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowBulkApproveDialog(false);
                    setBulkComment('');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkApprove}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve All ({selectedIds.size})
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && rejectId && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setShowRejectDialog(false);
              setRejectId(null);
              setRejectComment('');
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Reject Request</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Provide a reason for rejection
                </p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Request:</div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="font-mono text-sm text-gray-900 mb-1">
                      {filteredApprovals.find(a => a.id === rejectId)?.requestNumber}
                    </div>
                    <div className="text-sm text-gray-700">
                      {filteredApprovals.find(a => a.id === rejectId)?.description}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                    placeholder="Explain why this request is being rejected..."
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectDialog(false);
                    setRejectId(null);
                    setRejectComment('');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

