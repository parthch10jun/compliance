'use client';

/**
 * Excel Import/Export Dialog
 * Bulk matrix operations with validation preview
 */

import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';

interface ExcelImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'import' | 'export';
}

export default function ExcelImportDialog({ isOpen, onClose, mode }: ExcelImportDialogProps) {
  const [step, setStep] = useState<'upload' | 'validate' | 'complete'>('upload');
  const [validationResults, setValidationResults] = useState({
    totalRows: 0,
    validRows: 0,
    invalidRows: 0,
    warnings: 0,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate validation
      setTimeout(() => {
        setValidationResults({
          totalRows: 156,
          validRows: 148,
          invalidRows: 8,
          warnings: 12,
        });
        setStep('validate');
      }, 1500);
    }
  };

  const handleExport = () => {
    // Simulate export
    alert('Exporting matrix to Excel... (Demo)');
    setStep('complete');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-6 h-6 text-[#F59E0B]" />
            <h2 className="text-h2 font-semibold text-gray-900">
              {mode === 'import' ? 'Import from Excel' : 'Export to Excel'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'import' && step === 'upload' && (
            <div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Excel File
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a .xlsx or .csv file with authority matrix entries
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-5 h-5" />
                  Choose File
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-900 mb-2">Template Format</div>
                <div className="text-xs text-blue-700">
                  Download the template to ensure correct column headers: Role, Level, Min Amount, Max Amount, Currency, Entity, Business Unit
                </div>
                <button className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Download Template →
                </button>
              </div>
            </div>
          )}

          {mode === 'import' && step === 'validate' && (
            <div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div className="text-sm font-medium text-green-900">Valid Rows</div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">{validationResults.validRows}</div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <div className="text-sm font-medium text-red-900">Invalid Rows</div>
                    </div>
                    <div className="text-2xl font-bold text-red-900">{validationResults.invalidRows}</div>
                  </div>
                </div>

                {validationResults.warnings > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-amber-900">
                          {validationResults.warnings} Warnings Found
                        </div>
                        <ul className="mt-2 text-xs text-amber-700 space-y-1">
                          <li>• Row 23: Currency 'EUR' not in approved list, defaulting to USD</li>
                          <li>• Row 45: Approval level exceeds recommended depth (9 levels)</li>
                          <li>• Row 67: Overlapping threshold with existing rule</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {validationResults.invalidRows > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-red-900">
                          {validationResults.invalidRows} Errors Must Be Fixed
                        </div>
                        <ul className="mt-2 text-xs text-red-700 space-y-1">
                          <li>• Row 12: Missing required field 'Role'</li>
                          <li>• Row 34: Invalid amount format '$5K' (use numeric only)</li>
                          <li>• Row 89: Entity 'APAC-Sales' not found in system</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep('upload')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Upload Different File
                </button>
                <button
                  onClick={() => {
                    alert('Importing valid rows... (Demo)');
                    setStep('complete');
                  }}
                  disabled={validationResults.validRows === 0}
                  className="flex-1 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import {validationResults.validRows} Valid Rows
                </button>
              </div>
            </div>
          )}

          {mode === 'export' && (
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Export Format</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]">
                    <option>Excel (.xlsx)</option>
                    <option>CSV (.csv)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Include</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#F59E0B] focus:ring-[#F59E0B]" />
                      <span className="text-sm text-gray-700">Authority entries</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#F59E0B] focus:ring-[#F59E0B]" />
                      <span className="text-sm text-gray-700">Approval hierarchies</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-[#F59E0B] focus:ring-[#F59E0B]" />
                      <span className="text-sm text-gray-700">SoD rules linkage</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-[#F59E0B] focus:ring-[#F59E0B]" />
                      <span className="text-sm text-gray-700">Audit metadata</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
                >
                  <Download className="w-5 h-5" />
                  Export
                </button>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {mode === 'import' ? 'Import Complete!' : 'Export Complete!'}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {mode === 'import' 
                  ? `Successfully imported ${validationResults.validRows} authority entries`
                  : 'Your file has been downloaded to your computer'
                }
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
