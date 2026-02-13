'use client';

import { useState } from 'react';
import { Paperclip, Search, Plus, Grid3X3, List, CheckCircle, XCircle, Clock, Link2, FileText, Image, FileSpreadsheet, File, Upload, Calendar, User, Edit, Eye } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, SearchFilterBar, FilterButtonGroup, EditEvidenceModal } from '@/components';
import Link from 'next/link';

// Mock Evidence Data (Shared Library - can be linked to multiple controls/tests)
const mockEvidence = [
  { id: 'EVD-001', code: 'EVD-001', name: 'Access Control Policy v2.3', type: 'Document', fileType: 'PDF', fileSize: '2.4 MB', linkedControls: ['CTRL-001', 'CTRL-005'], linkedTests: ['TST-001'], uploadedBy: 'John Smith', uploadedAt: '2024-01-15', validUntil: '2025-01-15', status: 'Approved', tags: ['Policy', 'Access'] },
  { id: 'EVD-002', code: 'EVD-002', name: 'Q4 Audit Report', type: 'Report', fileType: 'PDF', fileSize: '5.1 MB', linkedControls: ['CTRL-003', 'CTRL-007', 'CTRL-011'], linkedTests: ['TST-003', 'TST-007'], uploadedBy: 'Sarah Johnson', uploadedAt: '2024-01-10', validUntil: '2024-12-31', status: 'Approved', tags: ['Audit', 'Q4'] },
  { id: 'EVD-003', code: 'EVD-003', name: 'Backup Verification Screenshot', type: 'Screenshot', fileType: 'PNG', fileSize: '1.2 MB', linkedControls: ['CTRL-003'], linkedTests: ['TST-003'], uploadedBy: 'Mike Chen', uploadedAt: '2024-01-20', status: 'Pending Review', tags: ['Backup', 'Screenshot'] },
  { id: 'EVD-004', code: 'EVD-004', name: 'Encryption Certificate', type: 'Certificate', fileType: 'PDF', fileSize: '0.5 MB', linkedControls: ['CTRL-004', 'CTRL-009'], linkedTests: ['TST-004'], uploadedBy: 'Emily Davis', uploadedAt: '2024-01-22', validUntil: '2026-01-22', status: 'Approved', tags: ['Certificate', 'Encryption'] },
  { id: 'EVD-005', code: 'EVD-005', name: 'User Access Matrix', type: 'Document', fileType: 'XLSX', fileSize: '0.8 MB', linkedControls: ['CTRL-001', 'CTRL-002', 'CTRL-010'], linkedTests: ['TST-001', 'TST-002'], uploadedBy: 'Alex Wilson', uploadedAt: '2024-01-18', status: 'Approved', tags: ['Access', 'Matrix'] },
  { id: 'EVD-006', code: 'EVD-006', name: 'Incident Response Plan', type: 'Document', fileType: 'DOCX', fileSize: '1.8 MB', linkedControls: ['CTRL-006', 'CTRL-007'], linkedTests: ['TST-005'], uploadedBy: 'Lisa Brown', uploadedAt: '2024-01-05', validUntil: '2025-01-05', status: 'Approved', tags: ['Incident', 'Plan'] },
  { id: 'EVD-007', code: 'EVD-007', name: 'Network Diagram v3', type: 'Document', fileType: 'PDF', fileSize: '3.2 MB', linkedControls: ['CTRL-013'], linkedTests: ['TST-008'], uploadedBy: 'David Lee', uploadedAt: '2024-01-08', status: 'Pending Review', tags: ['Network', 'Diagram'] },
  { id: 'EVD-008', code: 'EVD-008', name: 'Vendor Assessment Form', type: 'Document', fileType: 'PDF', fileSize: '0.9 MB', linkedControls: ['CTRL-010'], linkedTests: ['TST-006'], uploadedBy: 'Rachel Kim', uploadedAt: '2024-01-25', status: 'Rejected', tags: ['Vendor', 'Assessment'] },
];

const statusConfig = {
  'Approved': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  'Pending Review': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  'Rejected': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  'Expired': { icon: Calendar, color: 'text-gray-500', bg: 'bg-gray-50' },
};

const fileTypeIcons: Record<string, typeof FileText> = {
  'PDF': FileText, 'DOCX': FileText, 'DOC': FileText,
  'XLSX': FileSpreadsheet, 'XLS': FileSpreadsheet, 'CSV': FileSpreadsheet,
  'PNG': Image, 'JPG': Image, 'JPEG': Image, 'GIF': Image,
};

type StatusFilter = 'all' | 'Approved' | 'Pending Review' | 'Rejected' | 'Expired';

export default function EvidencePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<typeof mockEvidence[0] | null>(null);

  const filteredEvidence = mockEvidence.filter(ev => {
    const matchesSearch = ev.name.toLowerCase().includes(searchQuery.toLowerCase()) || ev.code.toLowerCase().includes(searchQuery.toLowerCase()) || ev.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockEvidence.length,
    approved: mockEvidence.filter(e => e.status === 'Approved').length,
    pending: mockEvidence.filter(e => e.status === 'Pending Review').length,
    rejected: mockEvidence.filter(e => e.status === 'Rejected').length,
    sharedAcrossControls: mockEvidence.filter(e => e.linkedControls.length > 1).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Evidence Library"
        description="Reusable evidence documents that can be linked to multiple controls and tests"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md">
            <Upload size={18} />
            Upload Evidence
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 animate-fade-in-up delay-1">
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Total Evidence</p>
          <p className="text-h2 font-bold text-[var(--foreground)] mt-1">{stats.total}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Approved</p>
          <p className="text-h2 font-bold text-green-600 mt-1">{stats.approved}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Pending Review</p>
          <p className="text-h2 font-bold text-amber-600 mt-1">{stats.pending}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Rejected</p>
          <p className="text-h2 font-bold text-red-600 mt-1">{stats.rejected}</p>
        </div>
        <div className="p-5 rounded-xl bg-[var(--primary-lightest)] border border-[var(--primary)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--primary)] font-medium">Shared Evidence</p>
          <p className="text-h2 font-bold text-[var(--primary)] mt-1">{stats.sharedAcrossControls}</p>
          <p className="text-p3 text-[var(--primary)] mt-0.5">Linked to 2+ controls</p>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search evidence by code, name, or tags..."
        filters={
          <FilterButtonGroup
            options={['all', 'Approved', 'Pending Review', 'Rejected', 'Expired']}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
            label="Status"
          />
        }
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Evidence Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up delay-2">
          {filteredEvidence.map((ev, idx) => {
            const StatusIcon = statusConfig[ev.status as keyof typeof statusConfig].icon;
            const FileIcon = fileTypeIcons[ev.fileType] || File;
            return (
              <div key={ev.id} className="p-4 rounded-xl bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg transition-all group relative" style={{ animationDelay: `${idx * 30}ms` }}>
                <Link href={`/evidence/${ev.id}`} className="absolute inset-0 z-0" />
                <div className="flex items-start gap-3 mb-3 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary-lightest)] flex items-center justify-center flex-shrink-0">
                    <FileIcon size={20} className="text-[var(--primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-p2 font-medium text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">{ev.name}</h3>
                    <p className="text-p3 text-[var(--foreground-muted)]">{ev.code} • {ev.fileType} • {ev.fileSize}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedEvidence(ev);
                      setShowEditModal(true);
                    }}
                    className="p-1.5 rounded hover:bg-rose-100 text-[var(--foreground-muted)] hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Edit Evidence"
                  >
                    <Edit size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-p3 font-medium', statusConfig[ev.status as keyof typeof statusConfig].bg, statusConfig[ev.status as keyof typeof statusConfig].color)}>
                    <StatusIcon size={10} />{ev.status}
                  </span>
                  <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-p3 font-medium', ev.linkedControls.length > 1 ? 'bg-[var(--primary-lightest)] text-[var(--primary)]' : 'bg-gray-100 text-gray-600')}>
                    <Link2 size={10} />{ev.linkedControls.length} controls
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3 relative z-10">
                  {ev.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-p3">{tag}</span>
                  ))}
                </div>
                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-p3 text-[var(--foreground-muted)] relative z-10">
                  <span className="flex items-center gap-1"><User size={12} />{ev.uploadedBy}</span>
                  <span>{ev.uploadedAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden animate-fade-in-up delay-2 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-[var(--background-secondary)]">
              <tr>
                <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Evidence</th>
                <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Type</th>
                <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Links</th>
                <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-white">
              {filteredEvidence.map(ev => {
                const StatusIcon = statusConfig[ev.status as keyof typeof statusConfig].icon;
                const FileIcon = fileTypeIcons[ev.fileType] || File;
                return (
                  <tr key={ev.id} className="hover:bg-[var(--background-secondary)] transition-colors group">
                    <td className="px-6 py-4">
                      <Link href={`/evidence/${ev.id}`} className="flex items-center gap-3">
                        <FileIcon size={18} className="text-[var(--primary)]" />
                        <div>
                          <p className="text-p2 font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">{ev.name}</p>
                          <p className="text-p3 text-[var(--foreground-muted)]">{ev.code} • {ev.fileSize}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-p2 text-[var(--foreground)]">{ev.type}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-p2 text-[var(--foreground)]">{ev.linkedControls.length}C / {ev.linkedTests.length}T</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full text-p3 font-medium', statusConfig[ev.status as keyof typeof statusConfig].bg, statusConfig[ev.status as keyof typeof statusConfig].color)}>
                        <StatusIcon size={12} />{ev.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <span className="text-p2 text-[var(--foreground-muted)]">{ev.uploadedBy} • {ev.uploadedAt}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedEvidence(ev);
                              setShowEditModal(true);
                            }}
                            className="p-1.5 rounded hover:bg-rose-100 text-[var(--foreground-muted)] hover:text-rose-600 transition-colors"
                            title="Edit Evidence"
                          >
                            <Edit size={14} />
                          </button>
                          <Link
                            href={`/evidence/${ev.id}`}
                            className="p-1.5 rounded hover:bg-blue-100 text-[var(--foreground-muted)] hover:text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Evidence Modal */}
      <EditEvidenceModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedEvidence(null); }}
        evidence={selectedEvidence ? {
          id: selectedEvidence.id,
          code: selectedEvidence.code,
          name: selectedEvidence.name,
          description: '',
          type: selectedEvidence.type,
          status: selectedEvidence.status,
          validationStatus: 'Not Reviewed',
          expiresAt: selectedEvidence.validUntil,
          reminderDays: 14,
          tags: selectedEvidence.tags,
          notes: '',
        } : undefined}
        onSave={(evidence) => {
          console.log('Updated evidence:', evidence);
          setShowEditModal(false);
          setSelectedEvidence(null);
        }}
      />
    </div>
  );
}

