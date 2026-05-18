'use client';

/**
 * Authority Matrix - Grid View (Screen 3)
 * Read-only operational view of the effective matrix, browsable as a table
 * with time-travel, row inspector, inheritance lineage, and export
 */

import { useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Calendar, Download, Play, Settings, Eye,
  Check, X, Info, ChevronDown, ChevronRight, FileText
} from 'lucide-react';

type Tab = 'grid' | 'tree' | 'versions' | 'diff' | 'settings';

export default function MatrixGridViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<Tab>('grid');
  const [effectiveDate, setEffectiveDate] = useState('2026-05-15');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(1);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [filters, setFilters] = useState({
    entity: 'All',
    bu: 'All',
    category: 'All',
    role: 'All',
    currency: 'EUR base',
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock matrix data - in production, this would come from API
  const matrixRows = [
    {
      function: 'Procurement',
      category: 'Indirect SaaS',
      scope: 'Global',
      role: 'Cat. Manager',
      min: 0,
      max: 25000,
      additionalApprover: '—',
      cumulative: 'n/a',
      fourEyes: false,
      inherit: true,
    },
    {
      function: 'Procurement',
      category: 'Indirect SaaS',
      scope: 'EU',
      role: 'Proc. Director',
      min: 25001,
      max: 250000,
      additionalApprover: 'Finance Mgr',
      cumulative: '12-mo',
      fourEyes: false,
      inherit: false,
      override: true,
    },
    {
      function: 'Procurement',
      category: 'Indirect SaaS',
      scope: 'EU',
      role: 'VP Procurement',
      min: 250001,
      max: 1000000,
      additionalApprover: 'CFO',
      cumulative: '12-mo',
      fourEyes: false,
      inherit: false,
    },
    {
      function: 'Procurement',
      category: 'Indirect SaaS',
      scope: 'Global',
      role: 'CFO',
      min: 1000001,
      max: 5000000,
      additionalApprover: 'CEO + ARC',
      cumulative: 'annual',
      fourEyes: true,
      inherit: true,
    },
    {
      function: 'Procurement',
      category: 'Indirect SaaS',
      scope: 'Global',
      role: 'Board',
      min: 5000001,
      max: Infinity,
      additionalApprover: '∞',
      cumulative: 'annual',
      fourEyes: true,
      inherit: false,
    },
    {
      function: 'Procurement',
      category: 'Services',
      scope: 'EU',
      role: 'Cat. Manager',
      min: 0,
      max: 50000,
      additionalApprover: '—',
      cumulative: 'n/a',
      fourEyes: false,
      inherit: true,
    },
    {
      function: 'Procurement',
      category: 'Services',
      scope: 'EU',
      role: 'Proc. Director',
      min: 50001,
      max: 500000,
      additionalApprover: 'Legal',
      cumulative: '12-mo',
      fourEyes: false,
      inherit: false,
    },
    {
      function: 'Procurement',
      category: 'Services',
      scope: 'EU',
      role: 'VP Procurement',
      min: 500001,
      max: 2000000,
      additionalApprover: 'CFO',
      cumulative: 'n/a',
      fourEyes: false,
      inherit: true,
    },
    {
      function: 'Procurement',
      category: 'Capex',
      scope: 'Global',
      role: 'Proc. Director',
      min: 0,
      max: 100000,
      additionalApprover: 'Hiring Manager',
      cumulative: '12-mo',
      fourEyes: false,
      inherit: false,
      override: true,
    },
  ];
  
  // Filter rows based on filters and search
  const filteredRows = matrixRows.filter(row => {
    const matchesSearch = searchQuery === '' || 
      row.function.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEntity = filters.entity === 'All' || row.scope === filters.entity;
    const matchesCategory = filters.category === 'All' || row.category === filters.category;
    const matchesRole = filters.role === 'All' || row.role === filters.role;
    
    return matchesSearch && matchesEntity && matchesCategory && matchesRole;
  });
  
  const selectedRow = selectedRowIndex !== null ? filteredRows[selectedRowIndex] : null;
  
  // Format amount
  const formatAmount = (amount: number) => {
    if (amount === Infinity) return '∞';
    return amount.toLocaleString();
  };
  
  // Get row inspector data
  const getRowInspectorData = () => {
    if (!selectedRow) return null;

    return {
      effectiveRule: `IF function = 'Procurement' AND category = '${selectedRow.category}' AND scope = '${selectedRow.scope}' AND amount ≥ ${formatAmount(selectedRow.min)} AND amount ≤ ${formatAmount(selectedRow.max)} THEN route_to('${selectedRow.role}')`,
      cumulativeWindow: selectedRow.cumulative === 'n/a' ? 'No cumulative tracking' : `${selectedRow.cumulative} per vendor`,
      inheritanceLineage: selectedRow.inherit ? 'Inherits from Global > EU defaults (overridden)' : 'Standalone rule (no inheritance)',
      lastEdited: '22 Mar 2026 by J. Muller',
    };
  };

  const inspectorData = getRowInspectorData();

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/doa/authority-matrix" className="p-1.5 hover:bg-gray-100 rounded transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Authority Matrix · Procurement</h1>
            <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
              <span>Grid view</span>
              <span>•</span>
              <span>2 functions · scope: Global {' > '} EU</span>
              <span>•</span>
              <span>9 rows</span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/doa/authority-matrix/simulate"
            className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            Simulate
          </Link>
          <button
            onClick={() => setShowExportDialog(true)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <div className="flex items-center gap-2 px-2.5 py-1.5 border border-gray-300 rounded bg-white">
            <span className="text-xs text-gray-700 whitespace-nowrap">Show effective at:</span>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="text-xs border-none focus:ring-0 px-1 py-0.5 w-28"
            />
            <button className="px-2 py-0.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700 transition-colors">
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Tab Strip */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex gap-4 px-4">
          {[
            { id: 'grid', label: 'Grid', icon: null },
            { id: 'tree', label: 'Tree view', icon: null },
            { id: 'versions', label: 'Versions', icon: null },
            { id: 'diff', label: 'Diff', icon: null },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition-colors text-sm ${
                activeTab === tab.id
                  ? 'border-[#F59E0B] text-[#F59E0B] font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'grid' && (
        <>
      {/* Filter Strip */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Entity:</span>
            <select
              value={filters.entity}
              onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
              className="text-sm border border-gray-300 rounded px-3 py-1.5"
            >
              <option>All</option>
              <option>EU</option>
              <option>Global</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">BU:</span>
            <select
              value={filters.bu}
              onChange={(e) => setFilters({ ...filters, bu: e.target.value })}
              className="text-sm border border-gray-300 rounded px-3 py-1.5"
            >
              <option>All</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Category:</span>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="text-sm border border-gray-300 rounded px-3 py-1.5"
            >
              <option>All</option>
              <option>Indirect SaaS</option>
              <option>Services</option>
              <option>Capex</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Role:</span>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="text-sm border border-gray-300 rounded px-3 py-1.5"
            >
              <option>All</option>
              <option>Cat. Manager</option>
              <option>Proc. Director</option>
              <option>VP Procurement</option>
              <option>CFO</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Currency:</span>
            <select
              value={filters.currency}
              onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
              className="text-sm border border-gray-300 rounded px-3 py-1.5"
            >
              <option>EUR base ▼</option>
              <option>USD</option>
              <option>GBP</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rows..."
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Function</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Scope</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Min</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Max</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Add'l approver</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Cumul.</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">4-eyes</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Inherit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRows.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedRowIndex(index)}
                  className={`cursor-pointer transition-colors ${
                    selectedRowIndex === index
                      ? 'bg-amber-50 border-l-4 border-l-[#F59E0B]'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">{row.function}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.scope}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
                    {formatAmount(row.min)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
                    {formatAmount(row.max)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.additionalApprover}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.cumulative}</td>
                  <td className="px-4 py-3 text-center">
                    {row.fourEyes ? (
                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.override ? (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">
                        Override
                      </span>
                    ) : row.inherit ? (
                      <Check className="w-4 h-4 text-gray-600 mx-auto" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row Inspector */}
      {selectedRow && inspectorData && (
        <div className="bg-white rounded-lg border-2 border-[#F59E0B] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Row Inspector — selected: {selectedRow.function} · {selectedRow.category} · {selectedRow.scope} · {selectedRow.role}
            </h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Edit row
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Duplicate
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Effective rule expression</div>
              <div className="p-3 bg-gray-50 rounded font-mono text-sm text-gray-900">
                {inspectorData.effectiveRule}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Cumulative window:</div>
                <div className="text-sm text-gray-900">{inspectorData.cumulativeWindow}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Inherits from:</div>
                <div className="text-sm text-gray-900">{inspectorData.inheritanceLineage}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Last edited:</div>
                <div className="text-sm text-gray-900">{inspectorData.lastEdited}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Dialog */}
      {showExportDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowExportDialog(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Export Authority Matrix</h3>
                <p className="text-sm text-gray-600 mt-1">Choose format and options</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="format" value="xlsx" defaultChecked className="w-4 h-4" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Excel (XLSX)</div>
                        <div className="text-xs text-gray-600">Best for further analysis and editing</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="format" value="csv" className="w-4 h-4" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">CSV</div>
                        <div className="text-xs text-gray-600">Plain text, compatible with all systems</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="format" value="pdf" className="w-4 h-4" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Signed PDF</div>
                        <div className="text-xs text-gray-600">Audit-grade, tamper-proof document</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                    <span className="text-sm text-gray-700">Include metadata and version info</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span className="text-sm text-gray-700">Apply current filters ({filteredRows.length} rows)</span>
                  </label>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      Large exports run asynchronously. You'll receive a notification when ready (typically ≤ 30s for 10,000 rows).
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowExportDialog(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Export job queued. You will be notified when ready.');
                    setShowExportDialog(false);
                  }}
                  className="px-6 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Start Export
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Help Annotations */}
      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <strong>Effective-date picker</strong> — view matrix as of any past/future date
        </div>
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <strong>Inherit / Override chips</strong> show inheritance lineage with one-click drill-up
        </div>
      </div>
      </>
      )}

      {/* Tree View Tab */}
      {activeTab === 'tree' && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChevronRight className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tree View</h3>
            <p className="text-sm text-gray-600 mb-4">
              Hierarchical view showing inheritance relationships between global, regional, and local rules.
            </p>
            <div className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded p-3">
              <strong>Coming soon:</strong> Visual tree diagram with expandable nodes showing how rules cascade from Global → EU → Country level.
            </div>
          </div>
        </div>
      )}

      {/* Versions Tab */}
      {activeTab === 'versions' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Version History</h3>
            <div className="space-y-3">
              {[
                { version: '2.0', date: '01 Jan 2026', author: 'J. Muller', status: 'Current', changes: 'Added EU-specific overrides for Indirect SaaS' },
                { version: '1.9', date: '15 Nov 2025', author: 'J. Muller', status: 'Superseded', changes: 'Increased CFO threshold from 500K to 1M EUR' },
                { version: '1.8', date: '22 Oct 2025', author: 'P. Chen', status: 'Superseded', changes: 'Added 4-eyes requirement for Board-level approvals' },
              ].map((v, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">v{v.version}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          v.status === 'Current' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {v.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{v.date} • {v.author}</div>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
                  </div>
                  <div className="text-sm text-gray-700">{v.changes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Diff Tab */}
      {activeTab === 'diff' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compare Versions</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Compare from:</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded">
                  <option>v1.9 (15 Nov 2025)</option>
                  <option>v1.8 (22 Oct 2025)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Compare to:</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded">
                  <option>v2.0 (01 Jan 2026 - Current)</option>
                  <option>v1.9 (15 Nov 2025)</option>
                </select>
              </div>
            </div>
            <button className="px-4 py-2 bg-[#F59E0B] text-white rounded hover:bg-amber-600 transition-colors text-sm mb-6">
              Generate Diff
            </button>
            <div className="border border-gray-200 rounded p-4 bg-gray-50 text-sm text-gray-600">
              Select two versions to see a side-by-side comparison of changes, additions, and deletions.
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Matrix Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                <select className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded">
                  <option>EUR - Euro</option>
                  <option>USD - US Dollar</option>
                  <option>GBP - British Pound</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Frequency</label>
                <select className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded">
                  <option>Quarterly</option>
                  <option>Semi-annually</option>
                  <option>Annually</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" defaultChecked />
                  <span className="text-sm text-gray-700">Require SoD check before approval routing</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" defaultChecked />
                  <span className="text-sm text-gray-700">Enable automatic escalation for breaches</span>
                </label>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <button className="px-4 py-2 bg-[#F59E0B] text-white rounded hover:bg-amber-600 transition-colors text-sm">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
