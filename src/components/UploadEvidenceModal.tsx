'use client';

import { useState, useRef } from 'react';
import { X, Upload, FileCheck, Image, FileText, File, Trash2, Link2, Calendar } from 'lucide-react';
import clsx from 'clsx';

interface UploadEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  controlId?: string;
  controlName?: string;
  testId?: string;
  testName?: string;
  onUpload?: (files: { name: string; type: string; size: number }[]) => void;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
}

export function UploadEvidenceModal({ isOpen, onClose, controlId, controlName, testId, testName, onUpload }: UploadEvidenceModalProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [evidenceType, setEvidenceType] = useState('Document');
  const [notes, setNotes] = useState('');
  const [validityDate, setValidityDate] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const evidenceTypes = ['Document', 'Screenshot', 'Report', 'Certificate', 'Log File', 'Configuration Export', 'Other'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={20} className="text-violet-600" />;
    if (type.includes('pdf')) return <FileText size={20} className="text-red-600" />;
    return <File size={20} className="text-gray-600" />;
  };

  const handleUpload = () => {
    if (onUpload && files.length > 0) {
      onUpload(files.map(f => ({ name: f.name, type: f.type, size: f.size })));
    }
    onClose();
  };

  const linkedTo = testName || controlName || 'Compliance Item';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center">
                <Upload size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">Upload Evidence</h2>
                <p className="text-sm text-[var(--foreground-muted)] mt-0.5 flex items-center gap-1">
                  <Link2 size={12} />
                  Linking to: {linkedTo}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
              <X size={24} className="text-[var(--foreground-muted)]" />
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 transition-all"
          >
            <Upload size={32} className="mx-auto text-[var(--foreground-muted)] mb-3" />
            <p className="font-medium text-[var(--foreground)]">Click to upload files</p>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">or drag and drop</p>
            <p className="text-xs text-[var(--foreground-muted)] mt-3">PDF, PNG, JPG, DOC, XLS up to 10MB each</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.csv,.txt,.log"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--foreground)]">{files.length} file(s) selected</p>
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 bg-[var(--background-secondary)] rounded-lg">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{file.name}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{formatFileSize(file.size)}</p>
                  </div>
                  <button onClick={() => removeFile(file.id)} className="p-1 hover:bg-red-100 rounded text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Evidence Type</label>
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
              >
                {evidenceTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                <Calendar size={14} className="inline mr-1" />
                Valid Until
              </label>
              <input
                type="date"
                value={validityDate}
                onChange={(e) => setValidityDate(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--background-secondary)] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[var(--foreground-muted)]">Cancel</button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0}
            className="px-6 py-2.5 bg-rose-600 text-white rounded-lg font-medium text-sm hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FileCheck size={16} />
            Upload Evidence
          </button>
        </div>
      </div>
    </div>
  );
}

