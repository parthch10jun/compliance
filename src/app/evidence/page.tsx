'use client';

import { useState } from 'react';
import { Paperclip, Search, Plus, Grid3X3, List, CheckCircle, XCircle, Clock, Link2, FileText, Image, FileSpreadsheet, File, Upload, Calendar, User } from 'lucide-react';
import clsx from 'clsx';

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

export default function EvidencePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const types = ['all', 'Document', 'Screenshot', 'Report', 'Certificate', 'Log', 'Other'];
  const statuses = ['all', 'Approved', 'Pending Review', 'Rejected', 'Expired'];

  const filteredEvidence = mockEvidence.filter(ev => {
    const matchesSearch = ev.name.toLowerCase().includes(searchQuery.toLowerCase()) || ev.code.toLowerCase().includes(searchQuery.toLowerCase()) || ev.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
    const matchesType = typeFilter === 'all' || ev.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Evidence Library</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            Reusable evidence documents that can be linked to multiple controls and tests
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors">
          <Upload size={18} />
          <span>Upload Evidence</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 animate-fade-in-up">
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">Total Evidence</p>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">Approved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">Pending Review</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">Rejected</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--primary-lightest)] border border-[var(--primary)]">
          <p className="text-sm text-[var(--primary)]">Shared Evidence</p>
          <p className="text-2xl font-bold text-[var(--primary)] mt-1">{stats.sharedAcrossControls}</p>
          <p className="text-xs text-[var(--primary)] mt-0.5">Linked to 2+ controls</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 animate-fade-in-up delay-1">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <input type="text" placeholder="Search evidence, tags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] focus:outline-none">
          {types.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] focus:outline-none">
          {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
        </select>
        <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={clsx('p-2', viewMode === 'grid' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card-bg)] text-[var(--foreground-muted)]')}><Grid3X3 size={18} /></button>
          <button onClick={() => setViewMode('list')} className={clsx('p-2', viewMode === 'list' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card-bg)] text-[var(--foreground-muted)]')}><List size={18} /></button>
        </div>
      </div>

      <p className="text-sm text-[var(--foreground-muted)]">Showing {filteredEvidence.length} evidence items</p>

      {/* Evidence Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up delay-2">
          {filteredEvidence.map((ev, idx) => {
            const StatusIcon = statusConfig[ev.status as keyof typeof statusConfig].icon;
            const FileIcon = fileTypeIcons[ev.fileType] || File;
            return (
              <div key={ev.id} className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg transition-all cursor-pointer group" style={{ animationDelay: `${idx * 30}ms` }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary-lightest)] flex items-center justify-center flex-shrink-0">
                    <FileIcon size={20} className="text-[var(--primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">{ev.name}</h3>
                    <p className="text-xs text-[var(--foreground-muted)]">{ev.code} • {ev.fileType} • {ev.fileSize}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', statusConfig[ev.status as keyof typeof statusConfig].bg, statusConfig[ev.status as keyof typeof statusConfig].color)}>
                    <StatusIcon size={10} />{ev.status}
                  </span>
                  <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', ev.linkedControls.length > 1 ? 'bg-[var(--primary-lightest)] text-[var(--primary)]' : 'bg-gray-100 text-gray-600')}>
                    <Link2 size={10} />{ev.linkedControls.length} controls
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {ev.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">{tag}</span>
                  ))}
                </div>
                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--foreground-muted)]">
                  <span className="flex items-center gap-1"><User size={12} />{ev.uploadedBy}</span>
                  <span>{ev.uploadedAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden animate-fade-in-up delay-2">
          <table className="w-full">
            <thead className="bg-[var(--sidebar-bg)]">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Evidence</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Type</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Links</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredEvidence.map(ev => {
                const StatusIcon = statusConfig[ev.status as keyof typeof statusConfig].icon;
                const FileIcon = fileTypeIcons[ev.fileType] || File;
                return (
                  <tr key={ev.id} className="hover:bg-[var(--sidebar-hover)] cursor-pointer">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><FileIcon size={18} className="text-[var(--primary)]" /><div><p className="font-medium text-[var(--foreground)]">{ev.name}</p><p className="text-xs text-[var(--foreground-muted)]">{ev.code} • {ev.fileSize}</p></div></div></td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground)]">{ev.type}</td>
                    <td className="px-4 py-3 text-center"><span className="text-sm">{ev.linkedControls.length}C / {ev.linkedTests.length}T</span></td>
                    <td className="px-4 py-3"><span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', statusConfig[ev.status as keyof typeof statusConfig].bg, statusConfig[ev.status as keyof typeof statusConfig].color)}><StatusIcon size={12} />{ev.status}</span></td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground-muted)]">{ev.uploadedBy} • {ev.uploadedAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

