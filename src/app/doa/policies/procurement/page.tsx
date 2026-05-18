'use client';

/**
 * Screen 8 - Policy Versions & Diff View
 * Version timeline + visual diff between any two policy versions
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Download, Plus, ArrowLeftRight } from 'lucide-react';

type VersionStatus = 'Archived' | 'Superseded' | 'Effective' | 'In Review' | 'Draft';

interface PolicyVersion {
  version: string;
  status: VersionStatus;
  date: string;
}

interface DiffRow {
  id: number;
  rule: string;
  v20262: string;
  v20263: string;
  status: 'added' | 'changed' | 'removed';
}

export default function ProcurementPolicyPage() {
  const [selectedVersions, setSelectedVersions] = useState<string[]>(['v2026.2', 'v2026.3']);
  const [filter, setFilter] = useState<'all' | 'added' | 'changed' | 'removed'>('all');

  const handleVersionClick = (version: string, event: React.MouseEvent) => {
    if (event.shiftKey) {
      // Shift-click: select for comparison
      if (selectedVersions.includes(version)) {
        // Deselect
        setSelectedVersions(selectedVersions.filter(v => v !== version));
      } else if (selectedVersions.length < 2) {
        // Add as second version
        setSelectedVersions([...selectedVersions, version]);
      } else {
        // Replace the second version
        setSelectedVersions([selectedVersions[0], version]);
      }
    } else {
      // Regular click: select as first version (left side)
      if (selectedVersions.length === 2) {
        // Keep second version, replace first
        setSelectedVersions([version, selectedVersions[1]]);
      } else {
        setSelectedVersions([version]);
      }
    }
  };

  // Get the actual version labels for the diff header
  const leftVersion = selectedVersions[0] || 'v2026.2';
  const rightVersion = selectedVersions[1] || 'v2026.3';

  const handleSwitchSides = () => {
    if (selectedVersions.length === 2) {
      setSelectedVersions([selectedVersions[1], selectedVersions[0]]);
    }
  };
  
  const versions: PolicyVersion[] = [
    { version: 'v2024.1', status: 'Archived', date: '01 Jan 2024' },
    { version: 'v2025.1', status: 'Superseded', date: '01 Jan 2025' },
    { version: 'v2025.2', status: 'Superseded', date: '01 Jul 2025' },
    { version: 'v2026.1', status: 'Superseded', date: '01 Jan 2026' },
    { version: 'v2026.2', status: 'Effective', date: '01 Apr 2026' },
    { version: 'v2026.3', status: 'In Review', date: '01 Jul 2026' },
  ];

  // Version-specific data
  const versionData: Record<string, Record<string, string>> = {
    'v2024.1': {
      'proc-indirect-cat': '0 – 10,000',
      'proc-indirect-dir': '10,001 – 100,000',
      'proc-services-cat': '0 – 25,000',
      'proc-capex-cfo': '250K – 5M',
      'proc-hardware-cat': '0 – 5,000',
      'hr-severance-chro': '≤ 3 mo. base',
    },
    'v2025.1': {
      'proc-indirect-cat': '0 – 15,000',
      'proc-indirect-dir': '15,001 – 150,000',
      'proc-services-cat': '0 – 30,000',
      'proc-capex-cfo': '300K – 7M',
      'proc-hardware-cat': '0 – 7,500',
      'hr-severance-chro': '≤ 4 mo. base',
    },
    'v2025.2': {
      'proc-indirect-cat': '0 – 20,000',
      'proc-indirect-dir': '20,001 – 200,000',
      'proc-services-cat': '0 – 40,000',
      'proc-capex-cfo': '400K – 8M',
      'proc-hardware-cat': '0 – 10,000',
      'hr-severance-chro': '≤ 5 mo. base',
    },
    'v2026.1': {
      'proc-indirect-cat': '0 – 20,000',
      'proc-indirect-dir': '20,001 – 200,000',
      'proc-services-cat': '0 – 45,000',
      'proc-capex-cfo': '450K – 9M',
      'proc-capex-vp': '0 – 450K',
      'proc-hardware-cat': '0 – 10,000',
      'hr-severance-chro': '≤ 6 mo. base',
    },
    'v2026.2': {
      'proc-indirect-cat': '0 – 25,000',
      'proc-indirect-dir': '25,001 – 250,000',
      'proc-services-cat': '0 – 50,000',
      'proc-capex-cfo': '500K – 10M',
      'proc-hardware-cat': '0 – 10,000',
      'hr-severance-chro': '≤ 6 mo. base',
    },
    'v2026.3': {
      'proc-indirect-cat': '0 – 50,000',
      'proc-indirect-dir': '50,001 – 500,000',
      'proc-services-cat': '0 – 100,000',
      'proc-capex-cfo': '500K – 10M',
      'proc-capex-vp': '0 – 500K',
      'hr-severance-chro': '≤ 9 mo. base',
    },
  };

  // Generate diff between selected versions
  const generateDiff = (leftVer: string, rightVer: string): DiffRow[] => {
    const leftData = versionData[leftVer] || {};
    const rightData = versionData[rightVer] || {};
    const allKeys = new Set([...Object.keys(leftData), ...Object.keys(rightData)]);

    const ruleNames: Record<string, string> = {
      'proc-indirect-cat': 'Procurement · Indirect SaaS · EU · Cat. Manager',
      'proc-indirect-dir': 'Procurement · Indirect SaaS · EU · Proc. Director',
      'proc-services-cat': 'Procurement · Services · EU · Cat. Manager',
      'proc-capex-cfo': 'Procurement · Capex · APAC · CFO',
      'proc-capex-vp': 'Procurement · Capex · APAC · Function VP',
      'proc-hardware-cat': 'Procurement · Hardware · Global · Cat. Manager',
      'hr-severance-chro': 'HR · Severance · APAC · CHRO',
    };

    const diff: DiffRow[] = [];
    let id = 1;

    allKeys.forEach(key => {
      const leftVal = leftData[key] || '';
      const rightVal = rightData[key] || '';

      let status: 'added' | 'changed' | 'removed';
      if (!leftVal && rightVal) status = 'added';
      else if (leftVal && !rightVal) status = 'removed';
      else if (leftVal !== rightVal) status = 'changed';
      else return; // No change, skip

      diff.push({
        id: id++,
        rule: ruleNames[key] || key,
        v20262: leftVal,
        v20263: rightVal,
        status,
      });
    });

    return diff;
  };

  const diffData = generateDiff(leftVersion, rightVersion);
  
  const counts = {
    added: diffData.filter(r => r.status === 'added').length,
    changed: diffData.filter(r => r.status === 'changed').length,
    removed: diffData.filter(r => r.status === 'removed').length,
    total: diffData.length,
  };

  const filteredData = filter === 'all' ? diffData : diffData.filter(r => r.status === filter);

  // Show message if no changes
  const hasChanges = diffData.length > 0;
  
  const getStatusColor = (status: VersionStatus) => {
    switch (status) {
      case 'Effective': return 'bg-green-100 text-green-700 border-green-300';
      case 'In Review': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Superseded': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Archived': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Draft': return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/doa/policies" className="text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">DOA Policy · Procurement</h1>
              <p className="text-sm text-gray-600">5 versions · current effective: v2026.2 · next: v2026.3 (in review)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
              Compare versions
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-1">
              <Download className="w-4 h-4" />
              Export signed PDF
            </button>
            <button className="px-3 py-1.5 bg-gray-900 text-white rounded text-sm hover:bg-gray-800 transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" />
              New version
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Version Timeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Version timeline</h2>
            <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded px-3 py-1.5">
              <strong>How to compare:</strong> Click = Left (L), Shift+Click = Right (R)
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-4">
            {selectedVersions.length === 2
              ? `Comparing ${leftVersion} (L) vs ${rightVersion} (R)`
              : selectedVersions.length === 1
              ? `Viewing ${leftVersion} - Shift+click another version to compare`
              : 'Click a version to inspect; shift-click two to diff'}
          </p>

          <div className="flex items-center gap-3">
            {versions.map((v, index) => {
              const isSelected = selectedVersions.includes(v.version);
              const selectionIndex = selectedVersions.indexOf(v.version);

              return (
                <React.Fragment key={v.version}>
                  <div
                    onClick={(e) => handleVersionClick(v.version, e)}
                    className={`flex-1 p-3 border-2 rounded cursor-pointer transition-all relative ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {selectionIndex === 0 ? 'L' : 'R'}
                      </div>
                    )}
                    <div className="font-semibold text-sm text-gray-900">{v.version}</div>
                    <div className={`inline-block px-2 py-0.5 rounded text-xs mt-1 border ${getStatusColor(v.status)}`}>
                      {v.status}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{v.date}</div>
                  </div>
                  {index < versions.length - 1 && (
                    <div className="text-gray-400 text-xl">→</div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Diff View */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">Diff: {leftVersion} (left)</h2>
                <ArrowLeftRight className="w-4 h-4 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900">{rightVersion} (right)</h2>
              </div>
              <button
                onClick={handleSwitchSides}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                Switch sides
              </button>
            </div>

            {/* Diff legend chips */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'all' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('added')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'added' ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                +{counts.added} added
              </button>
              <button
                onClick={() => setFilter('changed')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'changed' ? 'bg-amber-100 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {counts.changed} changed
              </button>
              <button
                onClick={() => setFilter('removed')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'removed' ? 'bg-red-100 text-red-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                −{counts.removed} removed
              </button>
            </div>
          </div>

          {/* No changes message */}
          {!hasChanges && (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Changes</h3>
              <p className="text-sm text-gray-600">
                Versions {leftVersion} and {rightVersion} are identical
              </p>
            </div>
          )}

          {/* Diff table */}
          {hasChanges && (
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Rule (function · category · scope · role)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">{leftVersion}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">{rightVersion}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.id} className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    row.status === 'added' ? 'bg-green-50/30' :
                    row.status === 'removed' ? 'bg-red-50/30' :
                    row.status === 'changed' ? 'bg-amber-50/30' :
                    ''
                  }`}>
                    <td className="px-4 py-2.5 text-sm text-gray-900 font-medium">{row.rule}</td>
                    <td className={`px-4 py-2.5 text-sm font-mono relative ${
                      row.status === 'removed'
                        ? 'bg-red-100 text-red-800 line-through font-semibold' :
                      row.status === 'changed'
                        ? 'bg-amber-100 text-amber-900 font-semibold' :
                      'text-gray-700'
                    }`}>
                      {row.status === 'removed' && (
                        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-red-600 font-bold text-lg">−</span>
                      )}
                      <span className={row.status === 'removed' ? 'ml-6' : ''}>{row.v20262 || '—'}</span>
                    </td>
                    <td className={`px-4 py-2.5 text-sm font-mono relative ${
                      row.status === 'added'
                        ? 'bg-green-100 text-green-800 font-semibold' :
                      row.status === 'changed'
                        ? 'bg-amber-100 text-amber-900 font-semibold' :
                      'text-gray-700'
                    }`}>
                      {row.status === 'added' && (
                        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-green-600 font-bold text-lg">+</span>
                      )}
                      <span className={row.status === 'added' ? 'ml-6' : ''}>{row.v20263 || '—'}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        row.status === 'added' ? 'bg-green-600 text-white' :
                        row.status === 'changed' ? 'bg-amber-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {row.status === 'added' ? '+ Added' :
                         row.status === 'removed' ? '− Removed' :
                         '• Changed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>

        {/* Info boxes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-800">
            <strong>Diff legend with counts:</strong> click any row to see field-level details
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800">
            <strong>Side-by-side diff</strong> anchors at top; click a chip to filter by kind
          </div>
        </div>
      </div>
    </div>
  );
}
