'use client';

import { useState, useRef } from 'react';
import { X, FlaskConical, Play, CheckCircle2, XCircle, AlertCircle, Clock, Upload, FileCheck } from 'lucide-react';
import clsx from 'clsx';

interface ExecuteTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  test?: {
    id: string;
    name: string;
    procedure: string;
    controlName?: string;
    lastResult?: 'Pass' | 'Fail' | 'Pending';
  };
  onExecute?: (result: { result: 'Pass' | 'Fail'; notes: string; evidenceCount: number }) => void;
}

interface EvidenceFile {
  id: string;
  name: string;
  size: number;
}

export function ExecuteTestModal({ isOpen, onClose, test, onExecute }: ExecuteTestModalProps) {
  const [result, setResult] = useState<'Pass' | 'Fail' | null>(null);
  const [notes, setNotes] = useState('');
  const [evidence, setEvidence] = useState<EvidenceFile[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !test) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
      }));
      setEvidence(prev => [...prev, ...newFiles]);
    }
  };

  const removeEvidence = (id: string) => {
    setEvidence(prev => prev.filter(e => e.id !== id));
  };

  const handleExecute = async () => {
    if (!result) return;
    
    setIsExecuting(true);
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onExecute) {
      onExecute({ result, notes, evidenceCount: evidence.length });
    }
    setIsExecuting(false);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <Play size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">Execute Test</h2>
                <p className="text-sm text-[var(--foreground-muted)] mt-0.5">{test.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
              <X size={24} className="text-[var(--foreground-muted)]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Test Procedure */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <FlaskConical size={16} />
              Test Procedure
            </h3>
            <p className="text-sm text-blue-800">{test.procedure}</p>
          </div>

          {/* Result Selection */}
          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">Test Result *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setResult('Pass')}
                className={clsx(
                  'p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                  result === 'Pass'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-[var(--border)] hover:border-emerald-300 hover:bg-emerald-50/50'
                )}
              >
                <CheckCircle2 size={32} className={result === 'Pass' ? 'text-emerald-600' : 'text-gray-400'} />
                <span className={clsx('font-semibold', result === 'Pass' ? 'text-emerald-700' : 'text-[var(--foreground)]')}>
                  Pass
                </span>
                <span className="text-xs text-[var(--foreground-muted)]">Test criteria met</span>
              </button>
              
              <button
                onClick={() => setResult('Fail')}
                className={clsx(
                  'p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                  result === 'Fail'
                    ? 'border-red-500 bg-red-50'
                    : 'border-[var(--border)] hover:border-red-300 hover:bg-red-50/50'
                )}
              >
                <XCircle size={32} className={result === 'Fail' ? 'text-red-600' : 'text-gray-400'} />
                <span className={clsx('font-semibold', result === 'Fail' ? 'text-red-700' : 'text-[var(--foreground)]')}>
                  Fail
                </span>
                <span className="text-xs text-[var(--foreground-muted)]">Test criteria not met</span>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">Execution Notes</label>
            <textarea
              rows={3}
              placeholder="Add observations, findings, or additional context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">Attach Evidence</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[var(--border)] rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
            >
              <Upload size={20} className="mx-auto text-[var(--foreground-muted)] mb-2" />
              <p className="text-sm text-[var(--foreground-muted)]">Click to upload evidence files</p>
              <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
            </div>
            {evidence.length > 0 && (
              <div className="mt-2 space-y-1">
                {evidence.map(e => (
                  <div key={e.id} className="flex items-center justify-between p-2 bg-[var(--background-secondary)] rounded-lg text-sm">
                    <span className="truncate">{e.name}</span>
                    <button onClick={() => removeEvidence(e.id)} className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--background-secondary)] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[var(--foreground-muted)]">Cancel</button>
          <button
            onClick={handleExecute}
            disabled={!result || isExecuting}
            className={clsx(
              'px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors',
              result === 'Pass' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' :
              result === 'Fail' ? 'bg-red-600 hover:bg-red-700 text-white' :
              'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            {isExecuting ? (
              <><Clock size={16} className="animate-spin" /> Recording...</>
            ) : (
              <><FileCheck size={16} /> Record Result</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

