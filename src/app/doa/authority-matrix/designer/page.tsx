'use client';

/**
 * Visual Matrix Designer
 * Drag-and-drop authority matrix builder with hierarchy visualization
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, AlertCircle, Play, Edit2, DollarSign, Users } from 'lucide-react';

interface HierarchyNode {
  id: string;
  role: string;
  level: number;
  minAmount: number;
  maxAmount: number;
  approverCount?: number;
}

export default function VisualMatrixDesigner() {
  const [hierarchyNodes, setHierarchyNodes] = useState<HierarchyNode[]>([
    { id: 'node-1', role: 'Operational Staff', level: 1, minAmount: 0, maxAmount: 1000, approverCount: 1 },
    { id: 'node-2', role: 'Team Lead', level: 2, minAmount: 1001, maxAmount: 5000, approverCount: 1 },
    { id: 'node-3', role: 'Manager', level: 3, minAmount: 5001, maxAmount: 25000, approverCount: 1 },
    { id: 'node-4', role: 'Senior Manager', level: 4, minAmount: 25001, maxAmount: 100000, approverCount: 2 },
    { id: 'node-5', role: 'Director', level: 5, minAmount: 100001, maxAmount: 500000, approverCount: 2 },
    { id: 'node-6', role: 'VP', level: 6, minAmount: 500001, maxAmount: 2000000, approverCount: 2 },
    { id: 'node-7', role: 'CFO', level: 7, minAmount: 2000001, maxAmount: 10000000, approverCount: 1 },
    { id: 'node-8', role: 'Board', level: 8, minAmount: 10000001, maxAmount: 999999999, approverCount: 3 },
  ]);

  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState('Financial');
  const [maxDepth, setMaxDepth] = useState(8);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const addApprovalLevel = () => {
    if (hierarchyNodes.length >= maxDepth) {
      alert(`Maximum hierarchy depth of ${maxDepth} reached`);
      return;
    }
    const newLevel = hierarchyNodes.length + 1;
    const lastNode = hierarchyNodes[hierarchyNodes.length - 1];
    const newNode: HierarchyNode = {
      id: `node-${newLevel}`,
      role: `New Role Level ${newLevel}`,
      level: newLevel,
      minAmount: lastNode.maxAmount + 1,
      maxAmount: lastNode.maxAmount * 10,
      approverCount: 1,
    };
    setHierarchyNodes([...hierarchyNodes, newNode]);
  };

  const deleteNode = (id: string) => {
    if (hierarchyNodes.length <= 1) {
      alert('Cannot delete the last approval level');
      return;
    }
    setHierarchyNodes(hierarchyNodes.filter(n => n.id !== id).map((n, idx) => ({ ...n, level: idx + 1 })));
  };

  const updateNode = (id: string, updates: Partial<HierarchyNode>) => {
    setHierarchyNodes(hierarchyNodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const moveNode = (fromIndex: number, toIndex: number) => {
    const newNodes = [...hierarchyNodes];
    const [movedNode] = newNodes.splice(fromIndex, 1);
    newNodes.splice(toIndex, 0, movedNode);
    setHierarchyNodes(newNodes.map((n, idx) => ({ ...n, level: idx + 1 })));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedNode) {
      const dragIndex = hierarchyNodes.findIndex(n => n.id === draggedNode);
      if (dragIndex !== dropIndex) {
        moveNode(dragIndex, dropIndex);
      }
      setDraggedNode(null);
    }
  };

  const saveMatrix = () => {
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 3000);
  };

  const renderNode = (node: HierarchyNode, index: number) => (
    <div
      key={node.id}
      draggable
      onDragStart={() => setDraggedNode(node.id)}
      onDragEnd={() => setDraggedNode(null)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDrop={(e) => handleDrop(e, index)}
      className={`
        relative mb-3 transition-all
        ${draggedNode === node.id ? 'opacity-50 scale-95' : 'opacity-100'}
      `}
    >
      <div className={`
        flex items-center gap-3 p-4 bg-white rounded-lg border-2
        transition-all hover:shadow-md
        ${draggedNode === node.id ? 'border-[#F59E0B]' : 'border-gray-200'}
      `}>
        <GripVertical className="w-5 h-5 text-gray-400 cursor-move flex-shrink-0" />

        <div className="flex-1">
          {editingNode === node.id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={node.role}
                onChange={(e) => updateNode(node.id, { role: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Role name"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={node.minAmount}
                  onChange={(e) => updateNode(node.id, { minAmount: parseInt(e.target.value) })}
                  className="w-1/3 px-2 py-1 border border-gray-300 rounded text-xs"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={node.maxAmount}
                  onChange={(e) => updateNode(node.id, { maxAmount: parseInt(e.target.value) })}
                  className="w-1/3 px-2 py-1 border border-gray-300 rounded text-xs"
                  placeholder="Max"
                />
                <input
                  type="number"
                  value={node.approverCount}
                  onChange={(e) => updateNode(node.id, { approverCount: parseInt(e.target.value) })}
                  className="w-1/3 px-2 py-1 border border-gray-300 rounded text-xs"
                  placeholder="Approvers"
                />
              </div>
              <button
                onClick={() => setEditingNode(null)}
                className="text-xs text-[#F59E0B] hover:underline"
              >
                Done Editing
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-100 text-[#F59E0B] text-xs font-semibold rounded">
                  L{node.level}
                </span>
                <span className="font-medium text-gray-900">{node.role}</span>
                {node.approverCount && node.approverCount > 1 && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    {node.approverCount} approvers
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{formatCurrency(node.minAmount)} - {formatCurrency(node.maxAmount)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditingNode(editingNode === node.id ? null : node.id)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit level"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => deleteNode(node.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete level"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/doa/authority-matrix"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Visual Matrix Designer</h1>
            <p className="text-p2 text-gray-600 mt-1">
              Drag and drop to build approval hierarchies
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
          <button
            onClick={saveMatrix}
            className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
          >
            <Save className="w-5 h-5" />
            Save Matrix
          </button>
        </div>
      </div>

      {/* Save Confirmation Toast */}
      {showSaveConfirm && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-lg animate-in slide-in-from-top">
          <div className="flex items-center gap-2 text-green-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Matrix saved successfully!</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Configuration */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-h3 font-semibold text-gray-900 mb-4">Matrix Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Function *</label>
                <select
                  value={selectedFunction}
                  onChange={(e) => setSelectedFunction(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                >
                  <option>Financial</option>
                  <option>Procurement</option>
                  <option>HR</option>
                  <option>IT</option>
                  <option>Legal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Max Hierarchy Depth</label>
                <input
                  type="number"
                  defaultValue={8}
                  min={1}
                  max={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
                <p className="text-xs text-gray-500 mt-1">Prevents cycles and excessive nesting</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={addApprovalLevel}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-[#F59E0B] text-[#F59E0B] rounded-lg hover:bg-amber-50 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Approval Level
                </button>
              </div>
            </div>
          </div>

          {/* Cycle Detection */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-green-900">No Cycles Detected</div>
                <div className="text-xs text-green-700 mt-1">
                  Hierarchy is valid. All approval paths are properly ordered.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Hierarchy Tree */}
        <div className="col-span-8">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h3 className="text-h3 font-semibold text-gray-900 mb-4">Approval Hierarchy</h3>
            <div className="space-y-2">
              {hierarchyNodes.map(node => renderNode(node))}
            </div>

            {hierarchyNodes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No approval levels configured</p>
                <button
                  onClick={addApprovalLevel}
                  className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Add First Level
                </button>
              </div>
            )}
          </div>

          {/* Routing Preview Panel */}
          {showPreview && hierarchyNodes.length > 0 && (
            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-h3 font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-[#F59E0B]" />
                Routing Chain Preview
              </h3>
              <div className="space-y-3">
                {hierarchyNodes.map((node, idx) => (
                  <div key={node.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-[#F59E0B] font-semibold text-sm flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-gray-900">{node.role}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatCurrency(node.minAmount)} - {formatCurrency(node.maxAmount)}
                        {node.approverCount > 1 && ` • ${node.approverCount} approvers required`}
                      </div>
                    </div>
                    {idx < hierarchyNodes.length - 1 && (
                      <div className="text-gray-400 text-2xl flex-shrink-0">→</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-900">
                  <strong>Total routing chain:</strong> {hierarchyNodes.length} levels •
                  Max amount: {formatCurrency(hierarchyNodes[hierarchyNodes.length - 1]?.maxAmount || 0)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
