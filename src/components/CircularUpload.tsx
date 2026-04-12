'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { extractCircularActionItems, validateCircularPDF, type ActionItem } from '@/lib/services/regulatory-ai';
import clsx from 'clsx';

interface CircularUploadProps {
  onExtractComplete: (actionItems: ActionItem[], metadata?: any) => void;
}

export function CircularUpload({ onExtractComplete }: CircularUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setSuccess(false);

    const validation = validateCircularPDF(selectedFile);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setFile(selectedFile);
  };

  const handleExtract = async () => {
    if (!file) return;

    setIsExtracting(true);
    setError(null);

    // eslint-disable-next-line no-console
    console.log('🚀 Starting extraction for file:', file.name);

    try {
      const result = await extractCircularActionItems(file);

      // eslint-disable-next-line no-console
      console.log('📊 Extraction result:', result);

      if (result.success && result.actionItems && result.actionItems.length > 0) {
        setSuccess(true);
        onExtractComplete(result.actionItems, result.metadata);
      } else {
        const errorMsg = result.error || 'No action items found in the circular';
        // eslint-disable-next-line no-console
        console.log('⚠️ Extraction issue:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('❌ Exception during extraction:', err);
      setError('Failed to process circular. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-lg flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">AI Circular Analyzer</h3>
          <p className="text-sm text-[var(--foreground-muted)]">Upload a regulatory circular PDF for instant analysis</p>
        </div>
      </div>

      {/* Upload Area */}
      {!file && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={clsx(
            'border-2 border-dashed rounded-lg p-8 text-center transition-all',
            isDragging
              ? 'border-[var(--primary)] bg-[var(--primary-lightest)]'
              : 'border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--background-secondary)]'
          )}
        >
          <Upload size={48} className="mx-auto mb-4 text-[var(--foreground-muted)]" />
          <p className="text-sm font-medium text-[var(--foreground)] mb-1">
            Drop your regulatory circular here
          </p>
          <p className="text-xs text-[var(--foreground-muted)] mb-4">
            or click to browse (PDF, max 10MB)
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors"
          >
            Select PDF
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </div>
      )}

      {/* Selected File */}
      {file && !success && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[var(--background-secondary)] rounded-lg">
            <div className="flex items-center gap-3">
              <FileText size={40} className="text-[var(--primary)]" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{file.name}</p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              disabled={isExtracting}
              className="p-2 hover:bg-[var(--background-tertiary)] rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={20} className="text-[var(--foreground-muted)]" />
            </button>
          </div>

          <button
            onClick={handleExtract}
            disabled={isExtracting}
            className="w-full px-4 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isExtracting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Extract Action Items
              </>
            )}
          </button>
        </div>
      )}

      {/* Success State */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 size={24} className="text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-900">Analysis Complete!</p>
              <p className="text-xs text-green-700">Action items extracted and displayed below</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="mt-3 text-sm text-green-700 hover:text-green-900 font-medium"
          >
            Upload Another Circular →
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">Error</p>
            <p className="text-xs text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
