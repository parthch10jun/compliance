'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Unlock, GitBranch, User, Clock, FileText, CheckCircle, XCircle, Edit, Eye } from 'lucide-react';
import clsx from 'clsx';

type LockStatus = 'Locked' | 'Unlocked' | 'Checked Out';
type DocumentType = 'Risk Assessment' | 'Treatment Plan' | 'Control Test' | 'Assessment Campaign' | 'Risk Matrix';

interface VersionControlItem {
  id: string;
  documentId: string;
  documentType: DocumentType;
  documentTitle: string;
  currentVersion: string;
  status: LockStatus;
  lockedBy?: string;
  lockedAt?: string;
  lastModified: string;
  lastModifiedBy: string;
  changesSinceCheckout?: number;
  autoSaveEnabled: boolean;
}

const mockVersionControl: VersionControlItem[] = [
  {
    id: 'VC-001',
    documentId: 'RSK-001',
    documentType: 'Risk Assessment',
    documentTitle: 'Third-party vendor data breach',
    currentVersion: 'v2.3',
    status: 'Checked Out',
    lockedBy: 'sarah.chen@company.com',
    lockedAt: '2024-04-20T14:30:00',
    lastModified: '2024-04-20T15:45:00',
    lastModifiedBy: 'sarah.chen@company.com',
    changesSinceCheckout: 12,
    autoSaveEnabled: true
  },
  {
    id: 'VC-002',
    documentId: 'TRT-045',
    documentType: 'Treatment Plan',
    documentTitle: 'MFA Implementation Plan',
    currentVersion: 'v1.5',
    status: 'Locked',
    lockedBy: 'michael.rodriguez@company.com',
    lockedAt: '2024-04-20T10:15:00',
    lastModified: '2024-04-20T10:15:00',
    lastModifiedBy: 'michael.rodriguez@company.com',
    changesSinceCheckout: 0,
    autoSaveEnabled: true
  },
  {
    id: 'VC-003',
    documentId: 'CTRL-TEST-023',
    documentType: 'Control Test',
    documentTitle: 'Security Awareness Training Effectiveness Test',
    currentVersion: 'v1.0',
    status: 'Unlocked',
    lastModified: '2024-04-19T16:20:00',
    lastModifiedBy: 'emily.watson@company.com',
    autoSaveEnabled: true
  },
  {
    id: 'VC-004',
    documentId: 'CAMP-2024-Q2',
    documentType: 'Assessment Campaign',
    documentTitle: 'Q2 2024 Enterprise Risk Assessment',
    currentVersion: 'v3.1',
    status: 'Checked Out',
    lockedBy: 'jennifer.walsh@company.com',
    lockedAt: '2024-04-20T09:00:00',
    lastModified: '2024-04-20T16:30:00',
    lastModifiedBy: 'jennifer.walsh@company.com',
    changesSinceCheckout: 45,
    autoSaveEnabled: true
  },
  {
    id: 'VC-005',
    documentId: 'MTX-ENT-2024',
    documentType: 'Risk Matrix',
    documentTitle: 'Enterprise Risk Matrix 2024',
    currentVersion: 'v2.0',
    status: 'Locked',
    lockedBy: 'david.kim@company.com',
    lockedAt: '2024-04-20T13:45:00',
    lastModified: '2024-04-20T13:45:00',
    lastModifiedBy: 'david.kim@company.com',
    changesSinceCheckout: 0,
    autoSaveEnabled: false
  }
];

export default function VersionControlPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | LockStatus>('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const currentUser = 'sarah.chen@company.com'; // Mock current user

  const filteredItems = mockVersionControl.filter(item => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  const handleCheckOut = (itemId: string) => {
    alert(`Checked out successfully! You now have exclusive edit access.`);
  };

  const handleCheckIn = (itemId: string) => {
    alert(`Checked in successfully! Document is now available for others.`);
  };

  const handleForceLock = (itemId: string) => {
    if (confirm('Force unlock this document? The current user will lose their lock.')) {
      alert('Document force unlocked successfully');
    }
  };

  const getStatusIcon = (status: LockStatus) => {
    switch (status) {
      case 'Locked': return <Lock size={16} className="text-red-600" />;
      case 'Unlocked': return <Unlock size={16} className="text-green-600" />;
      case 'Checked Out': return <Edit size={16} className="text-blue-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: LockStatus) => {
    switch (status) {
      case 'Locked': return 'bg-red-100 text-red-700 border-red-200';
      case 'Unlocked': return 'bg-green-100 text-green-700 border-green-200';
      case 'Checked Out': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const canEdit = (item: VersionControlItem) => {
    if (item.status === 'Unlocked') return true;
    if (item.status === 'Checked Out' && item.lockedBy === currentUser) return true;
    return false;
  };

  const lockedCount = mockVersionControl.filter(i => i.status === 'Locked' || i.status === 'Checked Out').length;
  const myCheckouts = mockVersionControl.filter(i => i.status === 'Checked Out' && i.lockedBy === currentUser).length;
  const availableCount = mockVersionControl.filter(i => i.status === 'Unlocked').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <GitBranch size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Version Control & Locking</h1>
          </div>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Manage document locks, check-in/check-out, and version history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Documents</div>
          <div className="text-2xl font-bold text-gray-900">{mockVersionControl.length}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 mb-1">My Checkouts</div>
          <div className="text-2xl font-bold text-blue-700">{myCheckouts}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-1">Locked</div>
          <div className="text-2xl font-bold text-red-700">{lockedCount}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1">Available</div>
          <div className="text-2xl font-bold text-green-700">{availableCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--border)] rounded-lg px-6 py-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-[var(--foreground)]">Status:</span>
          <div className="flex gap-2">
            {(['all', 'Unlocked', 'Locked', 'Checked Out'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={clsx(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all border',
                  statusFilter === status
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'bg-white text-[var(--foreground-muted)] border-gray-300 hover:bg-gray-50'
                )}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Document</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Version</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Locked By</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Last Modified</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Changes</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 text-sm">{item.documentTitle}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.documentId}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">{item.documentType}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <GitBranch size={14} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{item.currentVersion}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm font-medium text-gray-700">{item.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {item.lockedBy ? (
                    <div>
                      <div className="text-sm text-gray-900">{item.lockedBy.split('@')[0]}</div>
                      <div className="text-xs text-gray-500">
                        {item.lockedAt && new Date(item.lockedAt).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700">{new Date(item.lastModified).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{item.lastModifiedBy.split('@')[0]}</div>
                </td>
                <td className="px-6 py-4">
                  {item.changesSinceCheckout !== undefined && item.changesSinceCheckout > 0 ? (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-700">
                      {item.changesSinceCheckout} changes
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {item.status === 'Unlocked' && (
                      <button
                        onClick={() => handleCheckOut(item.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Edit size={12} />
                        Check Out
                      </button>
                    )}
                    {item.status === 'Checked Out' && item.lockedBy === currentUser && (
                      <button
                        onClick={() => handleCheckIn(item.id)}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle size={12} />
                        Check In
                      </button>
                    )}
                    {item.status !== 'Unlocked' && item.lockedBy !== currentUser && (
                      <button
                        onClick={() => handleForceLock(item.id)}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <XCircle size={12} />
                        Force Unlock
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/erm/version-control/${item.documentId}/history`)}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
                    >
                      <Eye size={12} />
                      History
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

