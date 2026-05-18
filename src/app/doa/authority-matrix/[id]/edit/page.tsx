'use client';

/**
 * Authority Matrix Builder - Screen 4
 * Two-pane editor: Structure tree (left) + Row editor (right)
 * Live validation, threshold bands, compound conditions
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Save, Send, X, Plus, ChevronDown, ChevronRight,
  AlertCircle, CheckCircle2, Trash2, Edit2, Search
} from 'lucide-react';

type TreeNode = {
  id: string;
  label: string;
  type: 'function' | 'category' | 'scope';
  children?: TreeNode[];
  expanded?: boolean;
  metadata?: {
    scope?: string;
    role?: string;
    override?: boolean;
  };
};

type ThresholdBand = {
  min: string;
  max: string;
  additionalApprover: string;
  cumulativeWindow: string;
};

export default function EditAuthorityMatrix() {
  const params = useParams();
  const matrixId = params.id as string;
  const [selectedNode, setSelectedNode] = useState<string>('eu-proc-director');
  const [hasChanges, setHasChanges] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    function: 'Procurement',
    category: 'Indirect SaaS',
    entityScope: 'EU',
    role: 'Proc. Director',
    inheritFrom: 'Global - Proc. Director (override)',
    currency: 'EUR',
    fxRateBook: 'ECB - daily',
    fourEyesAbove: '1,000,000',
    compoundCondition: "AND risk_score ≤ 'Medium' AND contract_term ≤ 36 months",
  });

  const [thresholdBands, setThresholdBands] = useState<ThresholdBand[]>([
    { min: '0', max: '25,000', additionalApprover: '—', cumulativeWindow: 'n/a' },
    { min: '25,001', max: '250,000', additionalApprover: 'Finance Mgr', cumulativeWindow: '12-mo' },
    { min: '250,001', max: '1,000,000', additionalApprover: 'CFO', cumulativeWindow: '12-mo' },
    { min: '1,000,001', max: '5,000,000', additionalApprover: 'CEO + ARC', cumulativeWindow: 'Annual' },
  ]);

  const [overlapDetected] = useState(false);

  // Tree structure
  const [treeData, setTreeData] = useState<TreeNode[]>([
    {
      id: 'procurement',
      label: 'Procurement',
      type: 'function',
      expanded: true,
      children: [
        {
          id: 'indirect-saas',
          label: 'Indirect SaaS',
          type: 'category',
          expanded: true,
          children: [
            { id: 'global-cat-manager', label: 'Global · Cat. Manager', type: 'scope', metadata: { scope: 'Global', role: 'Cat. Manager' } },
            { id: 'eu-proc-director', label: 'EU · Proc. Director', type: 'scope', metadata: { scope: 'EU', role: 'Proc. Director', override: true } },
            { id: 'eu-vp-procurement', label: 'EU · VP Procurement', type: 'scope', metadata: { scope: 'EU', role: 'VP Procurement' } },
            { id: 'global-cfo', label: 'Global · CFO', type: 'scope', metadata: { scope: 'Global', role: 'CFO' } },
            { id: 'global-board', label: 'Global · Board', type: 'scope', metadata: { scope: 'Global', role: 'Board' } },
          ],
        },
        { id: 'services', label: 'Services', type: 'category', children: [] },
        { id: 'capex', label: 'Capex', type: 'category', children: [] },
      ],
    },
    { id: 'hr', label: 'HR', type: 'function', children: [] },
    { id: 'finance', label: 'Finance', type: 'function', children: [] },
    { id: 'it', label: 'IT', type: 'function', children: [] },
  ]);

  const toggleNode = (nodeId: string) => {
    const toggleRecursive = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: toggleRecursive(node.children) };
        }
        return node;
      });
    };
    setTreeData(toggleRecursive(treeData));
  };

  const addBand = () => {
    setThresholdBands([
      ...thresholdBands,
      { min: '', max: '', additionalApprover: '—', cumulativeWindow: 'n/a' }
    ]);
    setHasChanges(true);
  };

  const deleteBand = (index: number) => {
    setThresholdBands(thresholdBands.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const updateBand = (index: number, field: keyof ThresholdBand, value: string) => {
    const newBands = [...thresholdBands];
    newBands[index] = { ...newBands[index], [field]: value };
    setThresholdBands(newBands);
    setHasChanges(true);
  };

  const renderTreeNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode === node.id;
    const isOverride = node.metadata?.override;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-1.5 py-1.5 px-2 rounded cursor-pointer transition-colors ${
            isSelected ? 'bg-amber-100 text-amber-900' : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'scope') {
              setSelectedNode(node.id);
            }
            if (hasChildren) {
              toggleNode(node.id);
            }
          }}
        >
          {hasChildren && (
            <button onClick={(e) => { e.stopPropagation(); toggleNode(node.id); }} className="p-0.5">
              {node.expanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          <span className="text-sm flex-1">{node.label}</span>
          {isOverride && (
            <span className="px-1.5 py-0.5 bg-amber-200 text-amber-800 text-xs rounded font-medium">
              Override
            </span>
          )}
        </div>
        {hasChildren && node.expanded && node.children?.map(child => renderTreeNode(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link href={`/doa/authority-matrix/${matrixId}`} className="p-1.5 hover:bg-gray-100 rounded transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Authority Matrix · Procurement</h1>
            <div className="text-xs text-gray-600">
              Edit row — Procurement · Indirect SaaS · EU · Proc. Director
              <span className="mx-2">•</span>
              Draft version 2026.3 — auto-saved 2 min ago
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <X className="w-4 h-4 inline mr-1" />
            Cancel
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <Save className="w-4 h-4" />
            Save draft
          </button>
          <button className="px-3 py-1.5 bg-[#F59E0B] text-white rounded text-sm hover:bg-amber-600 transition-colors flex items-center gap-1.5">
            <Send className="w-4 h-4" />
            Send for review
          </button>
        </div>
      </div>

      {/* Two-pane layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Structure Tree */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search structure..."
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <div className="mb-2 text-xs font-semibold text-gray-500 uppercase px-2">Structure</div>
            {treeData.map(node => renderTreeNode(node))}
          </div>

          <div className="p-3 border-t border-gray-200 flex gap-2">
            <button className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
              <Plus className="w-3 h-3" />
              Add function
            </button>
            <button className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
              <Plus className="w-3 h-3" />
              Add category
            </button>
          </div>
        </div>

        {/* Right Pane: Row Editor */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Row Metadata */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Row metadata</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Function*</label>
                  <select
                    value={formData.function}
                    onChange={(e) => setFormData({ ...formData, function: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  >
                    <option>Procurement</option>
                    <option>Finance</option>
                    <option>HR</option>
                    <option>IT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Category*</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  >
                    <option>Indirect SaaS</option>
                    <option>Services</option>
                    <option>Capex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Role*</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  >
                    <option>Proc. Director</option>
                    <option>Cat. Manager</option>
                    <option>VP Procurement</option>
                    <option>CFO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Inherit from</label>
                  <input
                    type="text"
                    value={formData.inheritFrom}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 text-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Entity scope</label>
                  <input
                    type="text"
                    value={formData.entityScope}
                    onChange={(e) => setFormData({ ...formData, entityScope: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Currency*</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  >
                    <option>EUR</option>
                    <option>USD</option>
                    <option>GBP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">FX rate book</label>
                  <select
                    value={formData.fxRateBook}
                    onChange={(e) => setFormData({ ...formData, fxRateBook: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  >
                    <option>ECB - daily</option>
                    <option>In-house spot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">4-eyes above</label>
                  <input
                    type="text"
                    value={formData.fourEyesAbove}
                    onChange={(e) => setFormData({ ...formData, fourEyesAbove: e.target.value })}
                    placeholder="1,000,000 EUR"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            {/* Threshold Bands Editor */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Threshold bands</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Inclusive lower bound · exclusive upper bound (configurable in matrix settings)
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 bg-gray-50">Min EUR</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 bg-gray-50">Max EUR</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 bg-gray-50">Add'l approver</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700 bg-gray-50">Cumul. window</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-700 bg-gray-50">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {thresholdBands.map((band, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={band.min}
                            onChange={(e) => updateBand(index, 'min', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#F59E0B] focus:border-transparent"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={band.max}
                            onChange={(e) => updateBand(index, 'max', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#F59E0B] focus:border-transparent"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={band.additionalApprover}
                            onChange={(e) => updateBand(index, 'additionalApprover', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#F59E0B] focus:border-transparent"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={band.cumulativeWindow}
                            onChange={(e) => updateBand(index, 'cumulativeWindow', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#F59E0B] focus:border-transparent"
                          >
                            <option>n/a</option>
                            <option>12-mo</option>
                            <option>Annual</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteBand(index)}
                              className="p-1 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <X className="w-3.5 h-3.5 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={addBand}
                  className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add band
                </button>

                {overlapDetected ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-700 font-medium">Overlap detected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">No overlaps detected</span>
                  </div>
                )}
              </div>

              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                <strong>Real-time validation:</strong> Bands validated in real-time — overlaps shown inline with severity badge
              </div>
            </div>

            {/* Compound Condition */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Compound condition (optional)</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Additional business logic constraints beyond thresholds
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit rule
                </button>
              </div>

              <textarea
                value={formData.compoundCondition}
                onChange={(e) => setFormData({ ...formData, compoundCondition: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent font-mono text-gray-700"
                placeholder="e.g., AND risk_score ≤ 'Medium' AND contract_term ≤ 36 months"
              />

              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                <strong>Rule builder:</strong> Compound conditions: free-text or no-code rule builder via 'Edit rule' (Phase 1.2)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
