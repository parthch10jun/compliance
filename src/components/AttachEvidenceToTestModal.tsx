'use client';

import { useState, useRef } from 'react';
import { X, Upload, FileText, Image, File, Trash2, CheckCircle, Calendar, Tag } from 'lucide-react';
import clsx from 'clsx';

interface AttachEvidenceToTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  test?: {
    id: string;
    code: string;
    name: string;
  };
  onAttach?: (evidence: {
    files: { name: string; type: string; size: number }[];
    evidenceType: string;
    description: string;
    validityDate: string;
    tags: string[];
  }) => void;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
}

export function AttachEvidenceToTestModal({ isOpen, onClose, test, onAttach }: AttachEvidenceToTestModalProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [evidenceType, setEvidenceType] = useState('Report');
  const [description, setDescription] = useState('');
  const [validityDate, setValidityDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !test) return null;

  const evidenceTypes = [
    'Report',
    'Screenshot',
    'Certificate',
    'Log File',
    'Configuration Export',
    'Policy Document',
    'Audit Trail',
    'Test Results',
    'Other'
  ];

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

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={20} className="text-violet-600" />;
    if (type.includes('pdf')) return <FileText size={20} className="text-red-600" />;
    return <File size={20} className="text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      alert('Please upload at least one file');
      return;
    }

    if (!description.trim()) {
      alert('Please provide a description');
      return;
    }

    if (onAttach) {
      onAttach({
        files: files.map(f => ({ name: f.name, type: f.type, size: f.size })),
        evidenceType,
        description,
        validityDate,
        tags,
      });
    }

    // Reset form
    setFiles([]);
    setEvidenceType('Report');
    setDescription('');
    setValidityDate('');
    setTags([]);
    onClose();
  };

  const handleClose = () => {
    setFiles([]);
    setEvidenceType('Report');
    setDescription('');
    setValidityDate('');
    setTags([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Upload size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-h3 font-bold text-[var(--foreground)]">Attach Evidence</h2>
              <p className="text-p3 text-[var(--foreground-muted)] mt-0.5">
                {test.code} - {test.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-[var(--foreground-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="text-p2 font-semibold text-[var(--foreground)] block mb-3">Upload Files *</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all"
            >
              <Upload size={32} className="mx-auto text-[var(--foreground-muted)] mb-3" />
              <p className="font-medium text-[var(--foreground)]">Click to upload files</p>
              <p className="text-sm text-[var(--foreground-muted)] mt-1">or drag and drop</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-3">PDF, PNG, JPG, DOC, XLS, CSV up to 10MB each</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.csv,.txt,.log"
              />
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-p3 font-medium text-[var(--foreground-muted)]">
                  {files.length} file{files.length > 1 ? 's' : ''} selected
                </p>
                {files.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-[var(--background-secondary)] rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-p2 font-medium text-[var(--foreground)] truncate">{file.name}</p>
                        <p className="text-p3 text-[var(--foreground-muted)]">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Evidence Type */}
          <div>
            <label className="text-p2 font-semibold text-[var(--foreground)] block mb-2">Evidence Type *</label>
            <select
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-p2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              {evidenceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-p2 font-semibold text-[var(--foreground)] block mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this evidence demonstrates..."
              rows={4}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-p2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
            />
          </div>

          {/* Validity Date */}
          <div>
            <label className="text-p2 font-semibold text-[var(--foreground)] block mb-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                Validity/Expiration Date
              </div>
            </label>
            <input
              type="date"
              value={validityDate}
              onChange={(e) => setValidityDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-p2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
            <p className="text-p3 text-[var(--foreground-muted)] mt-1">
              Optional: Set when this evidence expires or needs renewal
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="text-p2 font-semibold text-[var(--foreground)] block mb-2">
              <div className="flex items-center gap-2">
                <Tag size={16} />
                Tags
              </div>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tags (press Enter)"
                className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded-lg text-p2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2.5 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-p2 font-medium hover:bg-[var(--primary-lightest)] hover:border-[var(--primary)] transition-all"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--primary-lightest)] text-[var(--primary)] rounded-full text-p3 font-medium"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:bg-[var(--primary)]/20 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-[var(--border)] bg-[var(--background-secondary)]">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 border border-[var(--border)] rounded-xl text-p2 font-medium text-[var(--foreground)] hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || !description.trim()}
            className={clsx(
              'flex items-center gap-2 px-6 py-2.5 rounded-xl text-p2 font-medium transition-all shadow-sm',
              files.length === 0 || !description.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] hover:shadow-md'
            )}
          >
            <CheckCircle size={18} />
            Attach Evidence
          </button>
        </div>
      </div>
    </div>
  );
}


