'use client';

/**
 * Screen 6 - Delegations · List & Calendar
 * Coverage visibility and lifecycle management with integrated calendar
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePersona } from '@/contexts/PersonaContext';

type TabType = 'active' | 'scheduled' | 'expired' | 'revoked' | 'my';

export default function DelegationsDashboard() {
  const { hasPermission } = usePersona();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [selectedDelegation, setSelectedDelegation] = useState<number | null>(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filters, setFilters] = useState({
    functionType: 'All',
    delegationType: 'All',
    delegator: 'All',
    scope: 'Any',
  });

  // Mock delegations data
  const allDelegations = [
    {
      id: 1,
      delegator: 'J. Muller (Proc Dir)',
      delegate: 'L. Tan (Cat Mgr)',
      function: 'Procurement',
      role: 'Indirect',
      scope: 'EU · cap 250K',
      start: '10 May',
      end: '20 May',
      status: 'Active',
      type: 'OOO',
      details: {
        changeType: 'Procurement (indirect only) · Scope: EU · cap 250K · Type: OOO',
        approvalChain: 'Self-service (within 1 grade) · auto-approved · audit-logged',
        timeline: 'Created 06 May → Active 10-20 May → Auto-expire 20 May',
      }
    },
    {
      id: 2,
      delegator: 'Anna F. (CFO)',
      delegate: 'B. Singh (Dpty)',
      function: 'Finance',
      role: 'all',
      scope: 'Global · cap 5M',
      start: '12 May',
      end: '22 May',
      status: 'Active',
      type: 'OOO',
    },
    {
      id: 3,
      delegator: 'Pierre G. (VP Proc)',
      delegate: 'M. Lopez (Dir)',
      function: 'Procurement',
      role: 'all',
      scope: 'EU · cap 1M',
      start: '01 Jun',
      end: '15 Jun',
      status: 'Scheduled',
      type: 'Planned leave',
    },
  ];

  const tabCounts = {
    active: 23,
    scheduled: 8,
    expired: 147,
    revoked: 12,
    my: 5,
  };

  const filteredDelegations = allDelegations.filter(d => {
    if (activeTab === 'active') return d.status === 'Active';
    if (activeTab === 'scheduled') return d.status === 'Scheduled';
    return true;
  });

  const selectedDel = selectedDelegation !== null ? filteredDelegations[selectedDelegation] : null;

  // Calendar data - May 2026
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const activeDays = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  // Get date range for selected delegation
  const getSelectedDateRange = () => {
    if (selectedDel) {
      // Parse "10 May" format to day number
      const startDay = parseInt(selectedDel.start.split(' ')[0]);
      const endDay = parseInt(selectedDel.end.split(' ')[0]);
      return { startDay, endDay };
    }
    return null;
  };

  const selectedRange = getSelectedDateRange();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Delegations</h1>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              Export
            </button>
            {hasPermission('createDelegation') && (
              <Link
                href="/doa/delegations/new"
                className="px-3 py-1.5 bg-[#F59E0B] text-white rounded text-sm hover:bg-amber-600 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                New delegation
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50 px-4">
            <div className="flex gap-6">
              {[
                { id: 'active', label: `Active (${tabCounts.active})` },
                { id: 'scheduled', label: `Scheduled (${tabCounts.scheduled})`, badge: '12 expiring in 7 days' },
                { id: 'expired', label: `Expired (${tabCounts.expired})` },
                { id: 'revoked', label: `Revoked (${tabCounts.revoked})` },
                { id: 'my', label: 'My delegations' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative px-3 py-3 text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#F59E0B] text-[#F59E0B] font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {tab.badge && activeTab === tab.id && (
                    <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-normal">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Strip */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Function:</span>
                <select
                  value={filters.functionType}
                  onChange={(e) => setFilters({ ...filters, functionType: e.target.value })}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option>All</option>
                  <option>Procurement</option>
                  <option>Finance</option>
                  <option>HR</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Type:</span>
                <select
                  value={filters.delegationType}
                  onChange={(e) => setFilters({ ...filters, delegationType: e.target.value })}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option>All</option>
                  <option>OOO</option>
                  <option>Planned leave</option>
                  <option>Permanent</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Delegator:</span>
                <select
                  value={filters.delegator}
                  onChange={(e) => setFilters({ ...filters, delegator: e.target.value })}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option>All</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Scope:</span>
                <select
                  value={filters.scope}
                  onChange={(e) => setFilters({ ...filters, scope: e.target.value })}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option>Any</option>
                  <option>Global</option>
                  <option>EU</option>
                </select>
              </div>
            </div>
          </div>

          {/* Two-column layout: Table + Calendar */}
          <div className="flex">
            {/* Delegations Table */}
            <div className="flex-1 overflow-x-auto border-r border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Delegator</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Delegate</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Function</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Role</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Scope</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Start</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">End</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDelegations.map((delegation, index) => (
                    <tr
                      key={delegation.id}
                      onClick={() => setSelectedDelegation(index)}
                      className={`border-b border-gray-100 cursor-pointer transition-colors ${
                        selectedDelegation === index ? 'bg-amber-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-2.5 font-medium text-gray-900">{delegation.delegator}</td>
                      <td className="px-4 py-2.5 text-gray-700">{delegation.delegate}</td>
                      <td className="px-4 py-2.5 text-gray-700">{delegation.function}</td>
                      <td className="px-4 py-2.5 text-gray-700">{delegation.role}</td>
                      <td className="px-4 py-2.5 text-gray-700">{delegation.scope}</td>
                      <td className="px-4 py-2.5 text-gray-700">{delegation.start}</td>
                      <td className="px-4 py-2.5 text-gray-700">{delegation.end}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          delegation.status === 'Active' ? 'bg-green-100 text-green-700' :
                          delegation.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {delegation.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-600 text-xs">{delegation.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mini-Calendar on Right */}
            <div className="w-72 bg-gray-50 p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <h3 className="text-sm font-semibold text-gray-900">May 2026</h3>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div key={i} className="text-xs text-gray-600 text-center font-medium py-1">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day) => {
                    const isInSelectedRange = selectedRange && day >= selectedRange.startDay && day <= selectedRange.endDay;
                    const hasActiveDelegation = activeDays.includes(day);

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(new Date(2026, 4, day))}
                        className={`aspect-square text-xs rounded flex items-center justify-center transition-colors ${
                          isInSelectedRange
                            ? 'bg-amber-500 text-white font-bold hover:bg-amber-600 ring-2 ring-amber-600'
                            : hasActiveDelegation
                            ? 'bg-amber-100 text-amber-900 font-medium hover:bg-amber-200'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-100 rounded"></div>
                    <span>Days with active delegations</span>
                  </div>
                </div>
              </div>

              {/* Selected Delegation Detail */}
              {selectedDel && selectedDel.details && (
                <div className="bg-white rounded border border-gray-200 p-3 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900">Selected delegation</h4>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-gray-600">Change:</span>
                      <p className="text-gray-900 mt-0.5">{selectedDel.details.changeType}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Approval chain:</span>
                      <p className="text-gray-900 mt-0.5">{selectedDel.details.approvalChain}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Timeline:</span>
                      <p className="text-gray-900 mt-0.5">{selectedDel.details.timeline}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
