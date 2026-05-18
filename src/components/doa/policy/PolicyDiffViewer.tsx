'use client';

/**
 * Policy Diff Viewer
 * Implements BR-POL-04 - Side-by-side comparison with highlighted changes
 */

import { useState } from 'react';
import { ArrowRight, Plus, Minus, Edit, Info, ChevronDown, ChevronRight } from 'lucide-react';
import type { PolicyVersion } from '@/lib/doa/types/policy-types';

interface PolicyDiffViewerProps {
  versionA: PolicyVersion;
  versionB: PolicyVersion;
  policyData?: any; // Authority matrix or policy content data
}

export default function PolicyDiffViewer({ versionA, versionB, policyData }: PolicyDiffViewerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['metadata']));
  
  // Mock diff data - in production, this would be computed from actual policy data
  const diffs = [
    {
      section: 'metadata',
      label: 'Policy Metadata',
      changes: [
        {
          field: 'Effective Date',
          type: 'modified' as const,
          oldValue: versionA.effectiveDate,
          newValue: versionB.effectiveDate,
          annotation: 'Effective date updated for new version',
        },
        {
          field: 'Change Log',
          type: 'modified' as const,
          oldValue: versionA.changeLog,
          newValue: versionB.changeLog,
          annotation: 'Updated change log description',
        },
      ],
    },
    {
      section: 'thresholds',
      label: 'Approval Thresholds',
      changes: [
        {
          field: 'Manager Approval Limit',
          type: 'modified' as const,
          oldValue: '$25,000',
          newValue: '$50,000',
          annotation: 'Increased threshold to account for inflation',
        },
        {
          field: 'Director Approval Limit',
          type: 'modified' as const,
          oldValue: '$100,000',
          newValue: '$150,000',
          annotation: 'Adjusted for operational efficiency',
        },
        {
          field: 'VP Approval Limit',
          type: 'modified' as const,
          oldValue: '$500,000',
          newValue: '$750,000',
          annotation: 'Aligned with market standards',
        },
        {
          field: 'CFO Approval Limit',
          type: 'modified' as const,
          oldValue: '$2,000,000',
          newValue: '$3,000,000',
          annotation: 'Increased for strategic purchases',
        },
      ],
    },
    {
      section: 'currencies',
      label: 'Supported Currencies',
      changes: [
        {
          field: 'Currency: AED',
          type: 'added' as const,
          newValue: 'UAE Dirham (AED)',
          annotation: 'Added Middle Eastern currency support',
        },
        {
          field: 'Currency: SAR',
          type: 'added' as const,
          newValue: 'Saudi Riyal (SAR)',
          annotation: 'Added Middle Eastern currency support',
        },
        {
          field: 'Currency: QAR',
          type: 'added' as const,
          newValue: 'Qatari Riyal (QAR)',
          annotation: 'Added Middle Eastern currency support',
        },
      ],
    },
    {
      section: 'delegation',
      label: 'Delegation Rules',
      changes: [
        {
          field: 'Maximum Delegation Depth',
          type: 'modified' as const,
          oldValue: '2 levels',
          newValue: '3 levels',
          annotation: 'Allow deeper delegation chains for complex organizations',
        },
        {
          field: 'Circular Delegation Prevention',
          type: 'added' as const,
          newValue: 'Enabled - Graph-based detection',
          annotation: 'New security control to prevent delegation loops',
        },
      ],
    },
    {
      section: 'removed',
      label: 'Deprecated Items',
      changes: [
        {
          field: 'Legacy Approval Process',
          type: 'removed' as const,
          oldValue: 'Manual paper-based approvals',
          annotation: 'Fully migrated to digital approval system',
        },
      ],
    },
  ];
  
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };
  
  const getChangeColor = (type: 'added' | 'removed' | 'modified') => {
    switch (type) {
      case 'added': return 'bg-green-50 border-green-300';
      case 'removed': return 'bg-red-50 border-red-300';
      case 'modified': return 'bg-amber-50 border-amber-300';
    }
  };
  
  const getChangeIcon = (type: 'added' | 'removed' | 'modified') => {
    switch (type) {
      case 'added': return <Plus className="w-4 h-4 text-green-600" />;
      case 'removed': return <Minus className="w-4 h-4 text-red-600" />;
      case 'modified': return <Edit className="w-4 h-4 text-amber-600" />;
    }
  };
  
  const totalChanges = diffs.reduce((sum, section) => sum + section.changes.length, 0);
  const addedCount = diffs.flatMap(s => s.changes).filter(c => c.type === 'added').length;
  const removedCount = diffs.flatMap(s => s.changes).filter(c => c.type === 'removed').length;
  const modifiedCount = diffs.flatMap(s => s.changes).filter(c => c.type === 'modified').length;
  
  return (
    <div className="space-y-6">
      {/* Version Comparison Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Version Comparison</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-mono font-medium">v{versionA.versionNumber}</span>
            <ArrowRight className="w-4 h-4" />
            <span className="font-mono font-medium">v{versionB.versionNumber}</span>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{totalChanges}</div>
            <div className="text-xs text-gray-600">Total Changes</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700">{addedCount}</div>
            <div className="text-xs text-green-600">Added</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-2xl font-bold text-amber-700">{modifiedCount}</div>
            <div className="text-xs text-amber-600">Modified</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-700">{removedCount}</div>
            <div className="text-xs text-red-600">Removed</div>
          </div>
        </div>
      </div>

      {/* Diff Sections */}
      <div className="space-y-3">
        {diffs.map((section) => (
          <div key={section.section} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.section)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedSections.has(section.section) ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
                <span className="font-semibold text-gray-900">{section.label}</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                  {section.changes.length} change{section.changes.length !== 1 ? 's' : ''}
                </span>
              </div>
            </button>

            {/* Section Content */}
            {expandedSections.has(section.section) && (
              <div className="border-t border-gray-200">
                {section.changes.map((change, index) => (
                  <div
                    key={index}
                    className={`p-4 border-b border-gray-100 last:border-b-0 ${getChangeColor(change.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getChangeIcon(change.type)}
                      </div>

                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-2">{change.field}</div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          {/* Old Value */}
                          {change.oldValue && (
                            <div>
                              <div className="text-xs text-gray-600 mb-1 font-medium">Previous Value</div>
                              <div className="p-3 bg-white rounded border-2 border-red-200">
                                <div className="text-sm text-gray-900">
                                  {change.type === 'removed' && (
                                    <span className="line-through text-red-700">{change.oldValue}</span>
                                  )}
                                  {change.type !== 'removed' && change.oldValue}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* New Value */}
                          {change.newValue && (
                            <div>
                              <div className="text-xs text-gray-600 mb-1 font-medium">New Value</div>
                              <div className={`p-3 bg-white rounded border-2 ${
                                change.type === 'added' ? 'border-green-200' :
                                change.type === 'modified' ? 'border-amber-200' :
                                'border-gray-200'
                              }`}>
                                <div className={`text-sm font-medium ${
                                  change.type === 'added' ? 'text-green-700' :
                                  change.type === 'modified' ? 'text-amber-700' :
                                  'text-gray-900'
                                }`}>
                                  {change.newValue}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Annotation */}
                        {change.annotation && (
                          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-700">{change.annotation}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="text-sm font-semibold text-gray-900 mb-3">Legend</div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 rounded" />
            <span className="text-gray-700">Added - New items in v{versionB.versionNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-200 rounded" />
            <span className="text-gray-700">Modified - Changed from v{versionA.versionNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 rounded" />
            <span className="text-gray-700">Removed - Deleted in v{versionB.versionNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
