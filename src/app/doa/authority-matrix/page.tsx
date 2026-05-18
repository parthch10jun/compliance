'use client';

/**
 * Authority Matrix Hub
 * List all authority matrices with filtering and search
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Download, Search, Filter, Eye, Edit, Copy, Archive, Upload, Wand2, Calendar } from 'lucide-react';
import { getAllMatrices } from '@/lib/doa/data/enhancedData';
import { usePersona } from '@/contexts/PersonaContext';
import ExcelImportDialog from '@/components/doa/ExcelImportDialog';

export default function AuthorityMatrixHub() {
  const { hasPermission } = usePersona();
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importMode, setImportMode] = useState<'import' | 'export'>('import');
  const [effectiveDate, setEffectiveDate] = useState('');
  const matrices = getAllMatrices();
  
  // Filter matrices based on search
  const filteredMatrices = matrices.filter(matrix =>
    matrix.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    matrix.function.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">Authority Matrix</h1>
          <p className="text-p2 text-gray-600 mt-1">
            Centralized authority matrices for all business functions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/doa/authority-matrix/designer"
            className="flex items-center gap-2 px-4 py-2 border border-[#F59E0B] text-[#F59E0B] rounded-lg hover:bg-amber-50 transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            Visual Designer
          </Link>
          <button
            onClick={() => {
              setImportMode('import');
              setShowImportDialog(true);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={() => {
              setImportMode('export');
              setShowImportDialog(true);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          {hasPermission('createMatrix') && (
            <Link
              href="/doa/authority-matrix/new"
              className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Matrix
            </Link>
          )}
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Total Matrices</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">{matrices.length}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Active Matrices</div>
          <div className="text-h2 font-bold text-green-600 mt-1">
            {matrices.filter(m => m.status === 'Active').length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Functions Covered</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">
            {new Set(matrices.map(m => m.function)).size}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Total Entries</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">
            {matrices.reduce((sum, m) => sum + m.entries.length, 0)}
          </div>
        </div>
      </div>
      
      {/* Search, Filter, and Effective Date */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search matrices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            placeholder="View as of date..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {effectiveDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div className="text-sm text-blue-900">
              Viewing matrices as of <span className="font-semibold">{effectiveDate}</span>
              <button
                onClick={() => setEffectiveDate('')}
                className="ml-3 text-blue-600 hover:text-blue-800 underline"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Matrices Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matrix Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Function
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Version
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entries
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Effective Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMatrices.map((matrix) => (
              <tr key={matrix.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/doa/authority-matrix/${matrix.id}`} className="font-medium text-gray-900 hover:text-[#F59E0B]">
                    {matrix.name}
                  </Link>
                  <div className="text-p3 text-gray-500 mt-1">{matrix.description.slice(0, 60)}...</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {matrix.function}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  v{matrix.version}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {matrix.entries.length}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    matrix.status === 'Active' ? 'bg-green-100 text-green-800' :
                    matrix.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {matrix.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(matrix.effectiveDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/doa/authority-matrix/${matrix.id}`}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                    <Link
                      href={`/doa/authority-matrix/${matrix.id}/edit`}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExcelImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        mode={importMode}
      />
    </div>
  );
}
