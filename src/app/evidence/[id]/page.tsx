'use client';

import { use, useState } from 'react';
import { PageHeader, EditEvidenceModal, ReviewEvidenceModal } from '@/components';
import { evidence } from '@/lib/data/evidence';
import { controls } from '@/lib/data/controls';
import { requirements } from '@/lib/data/requirements-obligations';
import { controlTests } from '@/lib/data/control-tests';
import { FileText, Upload, Download, Eye, Clock, CheckCircle, XCircle, AlertCircle, Calendar, User, Tag, Link2, History, Edit, Shield, Target, FlaskConical, FileCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { formatDate } from '@/lib/utils/date-formatter';

export default function EvidenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  
  const evidenceItem = evidence.find(e => e.id === id);
  
  if (!evidenceItem) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FileText size={48} className="mx-auto text-[var(--foreground-muted)] mb-4" />
          <h2 className="text-h2 font-semibold text-[var(--foreground)] mb-2">Evidence Not Found</h2>
          <p className="text-p2 text-[var(--foreground-muted)]">The evidence you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Get linked entities
  const linkedControls = controls.filter(c => evidenceItem.linkedControlIds.includes(c.id));
  const linkedRequirements = requirements.filter(r => evidenceItem.linkedRequirementIds.includes(r.id));
  const linkedTests = controlTests.filter(t => evidenceItem.linkedTestIds.includes(t.id));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending Review': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Expired': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Draft': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getValidationStatusColor = (status: string) => {
    switch (status) {
      case 'Sufficient': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Insufficient': return 'bg-red-100 text-red-700 border-red-200';
      case 'Needs Update': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Not Reviewed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return CheckCircle;
      case 'Pending Review': return Clock;
      case 'Rejected': return XCircle;
      case 'Expired': return AlertCircle;
      case 'Draft': return FileText;
      default: return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const StatusIcon = getStatusIcon(evidenceItem.status);

  const daysUntilExpiry = evidenceItem.expiresAt 
    ? Math.ceil((new Date(evidenceItem.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={evidenceItem.code}
        description={evidenceItem.name}
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVersionModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--border)] text-[var(--foreground)] rounded-xl hover:bg-[var(--background-secondary)] transition-all duration-200 text-p2 font-medium"
            >
              <Upload size={18} />
              New Version
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md"
            >
              <Edit size={18} />
              Edit Evidence
            </button>
          </div>
        }
      />

      {/* Evidence Overview */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="col-span-2 p-6 rounded-xl bg-white border border-[var(--border)] animate-fade-in-up">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <FileText size={28} className="text-rose-600" />
              </div>
              <div>
                <h2 className="text-h3 font-bold text-[var(--foreground)] mb-1">{evidenceItem.name}</h2>
                <p className="text-p2 text-[var(--foreground-muted)]">{evidenceItem.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className={clsx('px-3 py-1 rounded-full text-xs font-medium border', getStatusColor(evidenceItem.status))}>
                    <StatusIcon size={12} className="inline mr-1" />
                    {evidenceItem.status}
                  </span>
                  <span className={clsx('px-3 py-1 rounded-full text-xs font-medium border', getValidationStatusColor(evidenceItem.validationStatus))}>
                    {evidenceItem.validationStatus}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">
                    {evidenceItem.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* File Information */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--background-secondary)] rounded-lg mb-6">
            <div>
              <p className="text-p3 text-[var(--foreground-muted)] mb-1">File Name</p>
              <p className="text-p2 font-medium text-[var(--foreground)]">{evidenceItem.fileName}</p>
            </div>
            <div>
              <p className="text-p3 text-[var(--foreground-muted)] mb-1">File Size</p>
              <p className="text-p2 font-medium text-[var(--foreground)]">{formatFileSize(evidenceItem.fileSize)}</p>
            </div>
            <div>
              <p className="text-p3 text-[var(--foreground-muted)] mb-1">File Type</p>
              <p className="text-p2 font-medium text-[var(--foreground)]">{evidenceItem.fileType}</p>
            </div>
            <div>
              <p className="text-p3 text-[var(--foreground-muted)] mb-1">Version</p>
              <p className="text-p2 font-medium text-[var(--foreground)]">v{evidenceItem.version}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-all font-medium">
              <Download size={18} />
              Download
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[var(--background-secondary)] transition-all font-medium">
              <Eye size={18} />
              Preview
            </button>
            <button
              onClick={() => setShowLinkModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[var(--background-secondary)] transition-all font-medium"
            >
              <Link2 size={18} />
              Link to Items
            </button>
          </div>

          {/* Notes */}
          {evidenceItem.notes && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">Notes</p>
              <p className="text-sm text-blue-700">{evidenceItem.notes}</p>
            </div>
          )}
        </div>

        {/* Metadata Sidebar */}
        <div className="space-y-4">
          {/* Dates Card */}
          <div className="p-5 rounded-xl bg-white border border-[var(--border)] animate-fade-in-up delay-1">
            <h3 className="text-p2 font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-violet-600" />
              Important Dates
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Uploaded</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">{formatDate(evidenceItem.uploadedAt)}</p>
              </div>
              {evidenceItem.reviewedAt && (
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-1">Reviewed</p>
                  <p className="text-p2 font-medium text-[var(--foreground)]">{formatDate(evidenceItem.reviewedAt)}</p>
                </div>
              )}
              {evidenceItem.approvedAt && (
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-1">Approved</p>
                  <p className="text-p2 font-medium text-[var(--foreground)]">{formatDate(evidenceItem.approvedAt)}</p>
                </div>
              )}
              {evidenceItem.expiresAt && (
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-1">Expires</p>
                  <p className={clsx('text-p2 font-medium', daysUntilExpiry && daysUntilExpiry < 30 ? 'text-red-600' : 'text-[var(--foreground)]')}>
                    {formatDate(evidenceItem.expiresAt)}
                    {daysUntilExpiry && daysUntilExpiry > 0 && (
                      <span className="text-xs ml-2">({daysUntilExpiry} days)</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* People Card */}
          <div className="p-5 rounded-xl bg-white border border-[var(--border)] animate-fade-in-up delay-2">
            <h3 className="text-p2 font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-600" />
              People
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Uploaded By</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">{evidenceItem.uploadedBy}</p>
              </div>
              {evidenceItem.reviewedBy && (
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-1">Reviewed By</p>
                  <p className="text-p2 font-medium text-[var(--foreground)]">{evidenceItem.reviewedBy}</p>
                </div>
              )}
              {evidenceItem.approvedBy && (
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-1">Approved By</p>
                  <p className="text-p2 font-medium text-[var(--foreground)]">{evidenceItem.approvedBy}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tags Card */}
          {evidenceItem.tags && evidenceItem.tags.length > 0 && (
            <div className="p-5 rounded-xl bg-white border border-[var(--border)] animate-fade-in-up delay-3">
              <h3 className="text-p2 font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <Tag size={18} className="text-emerald-600" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {evidenceItem.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Review Action */}
          {evidenceItem.status === 'Pending Review' && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium shadow-sm hover:shadow-md"
            >
              <FileCheck size={18} />
              Review Evidence
            </button>
          )}
        </div>
      </div>

      {/* Version History */}
      <div className="p-6 rounded-xl bg-white border border-[var(--border)] animate-fade-in-up delay-4">
        <div className="flex items-center gap-2 mb-4">
          <History size={20} className="text-violet-600" />
          <h3 className="text-h3 font-semibold text-[var(--foreground)]">Version History</h3>
          <span className="ml-auto px-3 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-full text-p3 font-medium">
            {evidenceItem.versionHistory.length} {evidenceItem.versionHistory.length === 1 ? 'Version' : 'Versions'}
          </span>
        </div>

        <div className="space-y-3">
          {evidenceItem.versionHistory.map((version, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-[var(--background-secondary)] rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-violet-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-p2 font-semibold text-[var(--foreground)]">Version {version.version}</p>
                  {version.status === 'Current' && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">Current</span>
                  )}
                  {version.status === 'Superseded' && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">Superseded</span>
                  )}
                </div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-2">{version.fileName} • {formatFileSize(version.fileSize)}</p>
                {version.changes && (
                  <p className="text-p3 text-[var(--foreground-muted)] mb-2">{version.changes}</p>
                )}
                <div className="flex items-center gap-4 text-p3 text-[var(--foreground-muted)]">
                  <span>{version.uploadedBy}</span>
                  <span>•</span>
                  <span>{formatDate(version.uploadedAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white rounded-lg transition-colors" title="Download">
                  <Download size={16} className="text-[var(--foreground-muted)]" />
                </button>
                <button className="p-2 hover:bg-white rounded-lg transition-colors" title="Preview">
                  <Eye size={16} className="text-[var(--foreground-muted)]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Linked Controls */}
      {linkedControls.length > 0 && (
        <div className="p-6 rounded-xl bg-white border border-[var(--border)] animate-fade-in-up delay-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} className="text-blue-600" />
            <h3 className="text-h3 font-semibold text-[var(--foreground)]">Linked Controls</h3>
            <span className="ml-auto px-3 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-full text-p3 font-medium">
              {linkedControls.length} {linkedControls.length === 1 ? 'Control' : 'Controls'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {linkedControls.map(control => (
              <Link
                key={control.id}
                href={`/controls/${control.id}`}
                className="flex items-start gap-3 p-4 bg-[var(--background-secondary)] rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-p2 font-semibold text-[var(--foreground)]">{control.code}</p>
                    <ExternalLink size={14} className="text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-2">{control.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white text-[var(--foreground)] rounded text-xs font-medium border border-[var(--border)]">
                      {control.category}
                    </span>
                    <span className={clsx('px-2 py-0.5 rounded text-xs font-medium',
                      control.effectiveness === 'Effective' ? 'bg-emerald-100 text-emerald-700' :
                      control.effectiveness === 'Partially Effective' ? 'bg-amber-100 text-amber-700' :
                      control.effectiveness === 'Ineffective' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {control.effectiveness}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Linked Requirements */}
      {linkedRequirements.length > 0 && (
        <div className="p-6 rounded-xl bg-white border border-[var(--border)] animate-fade-in-up delay-6">
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-violet-600" />
            <h3 className="text-h3 font-semibold text-[var(--foreground)]">Linked Requirements</h3>
            <span className="ml-auto px-3 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-full text-p3 font-medium">
              {linkedRequirements.length} {linkedRequirements.length === 1 ? 'Requirement' : 'Requirements'}
            </span>
          </div>

          <div className="space-y-3">
            {linkedRequirements.map(req => (
              <Link
                key={req.id}
                href={`/requirements/${req.id}`}
                className="flex items-start gap-3 p-4 bg-[var(--background-secondary)] rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <Target size={20} className="text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-p2 font-semibold text-[var(--foreground)]">{req.code}</p>
                    <ExternalLink size={14} className="text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-2">{req.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white text-[var(--foreground)] rounded text-xs font-medium border border-[var(--border)]">
                      {req.programName}
                    </span>
                    <span className={clsx('px-2 py-0.5 rounded text-xs font-medium',
                      req.status === 'Compliant' ? 'bg-emerald-100 text-emerald-700' :
                      req.status === 'Partially Compliant' ? 'bg-amber-100 text-amber-700' :
                      req.status === 'Non-Compliant' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {req.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Linked Tests */}
      {linkedTests.length > 0 && (
        <div className="p-6 rounded-xl bg-white border border-[var(--border)] animate-fade-in-up delay-7">
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical size={20} className="text-indigo-600" />
            <h3 className="text-h3 font-semibold text-[var(--foreground)]">Linked Tests</h3>
            <span className="ml-auto px-3 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-full text-p3 font-medium">
              {linkedTests.length} {linkedTests.length === 1 ? 'Test' : 'Tests'}
            </span>
          </div>

          <div className="space-y-3">
            {linkedTests.map(test => (
              <div key={test.id} className="flex items-start gap-3 p-4 bg-[var(--background-secondary)] rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <FlaskConical size={20} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-p2 font-semibold text-[var(--foreground)] mb-1">{test.code}</p>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-2">{test.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white text-[var(--foreground)] rounded text-xs font-medium border border-[var(--border)]">
                      {test.type}
                    </span>
                    <span className={clsx('px-2 py-0.5 rounded text-xs font-medium',
                      test.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' :
                      test.status === 'Failed' ? 'bg-red-100 text-red-700' :
                      test.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      test.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {test.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <EditEvidenceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        evidence={evidenceItem}
        onSave={(updatedEvidence) => {
          console.log('Updated evidence:', updatedEvidence);
          setShowEditModal(false);
        }}
      />

      <ReviewEvidenceModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        evidence={evidenceItem}
        onReview={(review) => {
          console.log('Evidence reviewed:', review);
          setShowReviewModal(false);
        }}
      />
    </div>
  );
}

