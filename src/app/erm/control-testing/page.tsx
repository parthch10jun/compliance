'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, AlertCircle, Plus, Filter, Download, Shield } from 'lucide-react';
import clsx from 'clsx';

type TestStatus = 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Tested' | 'In Progress';

interface ControlTest {
  id: string;
  controlId: string;
  controlTitle: string;
  category: string;
  testDate: string;
  tester: string;
  status: TestStatus;
  effectiveness: number;
  findings: number;
  nextTestDate: string;
  risksCovered: number;
}

// Mock ERM control testing data
const mockControlTests: ControlTest[] = [
  {
    id: 'CT-001',
    controlId: 'CTRL-001',
    controlTitle: 'Multi-factor Authentication (MFA)',
    category: 'Cybersecurity',
    testDate: '2024-04-15',
    tester: 'Sarah Chen',
    status: 'Effective',
    effectiveness: 95,
    findings: 0,
    nextTestDate: '2024-07-15',
    risksCovered: 3
  },
  {
    id: 'CT-002',
    controlId: 'CTRL-002',
    controlTitle: 'Security Awareness Training',
    category: 'Cybersecurity',
    testDate: '2024-04-10',
    tester: 'Michael Rodriguez',
    status: 'Effective',
    effectiveness: 88,
    findings: 1,
    nextTestDate: '2024-07-10',
    risksCovered: 2
  },
  {
    id: 'CT-003',
    controlId: 'CTRL-003',
    controlTitle: 'Vendor Due Diligence Process',
    category: 'Third Party',
    testDate: '2024-04-18',
    tester: 'Emily Watson',
    status: 'In Progress',
    effectiveness: 0,
    findings: 0,
    nextTestDate: '2024-07-18',
    risksCovered: 4
  },
  {
    id: 'CT-004',
    controlId: 'CTRL-004',
    controlTitle: 'Incident Response Plan',
    category: 'Operational',
    testDate: '2024-03-20',
    tester: 'David Kim',
    status: 'Partially Effective',
    effectiveness: 65,
    findings: 3,
    nextTestDate: '2024-06-20',
    risksCovered: 5
  },
  {
    id: 'CT-005',
    controlId: 'CTRL-005',
    controlTitle: 'Data Encryption Standards',
    category: 'Cybersecurity',
    testDate: '2024-04-01',
    tester: 'Sarah Chen',
    status: 'Effective',
    effectiveness: 98,
    findings: 0,
    nextTestDate: '2024-07-01',
    risksCovered: 2
  },
  {
    id: 'CT-006',
    controlId: 'CTRL-006',
    controlTitle: 'Financial Reconciliation Controls',
    category: 'Financial',
    testDate: '2024-03-15',
    tester: 'James Liu',
    status: 'Ineffective',
    effectiveness: 45,
    findings: 5,
    nextTestDate: '2024-06-15',
    risksCovered: 3
  }
];

export default function ERMControlTestingPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | TestStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['all', ...new Set(mockControlTests.map(t => t.category))];

  const filteredTests = mockControlTests.filter(test => {
    if (statusFilter !== 'all' && test.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && test.category !== categoryFilter) return false;
    return true;
  });

  const totalTests = mockControlTests.length;
  const effectiveTests = mockControlTests.filter(t => t.status === 'Effective').length;
  const partiallyEffective = mockControlTests.filter(t => t.status === 'Partially Effective').length;
  const ineffectiveTests = mockControlTests.filter(t => t.status === 'Ineffective').length;
  const inProgressTests = mockControlTests.filter(t => t.status === 'In Progress').length;
  const totalRisksCovered = mockControlTests.reduce((sum, t) => sum + t.risksCovered, 0);

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'Effective': return <CheckCircle size={16} className="text-green-600" />;
      case 'Partially Effective': return <AlertCircle size={16} className="text-yellow-600" />;
      case 'Ineffective': return <XCircle size={16} className="text-red-600" />;
      case 'In Progress': return <Clock size={16} className="text-blue-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: TestStatus) => {
    switch (status) {
      case 'Effective': return 'bg-green-100 text-green-700';
      case 'Partially Effective': return 'bg-yellow-100 text-yellow-700';
      case 'Ineffective': return 'bg-red-100 text-red-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <CheckCircle size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Control Testing</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => alert('Export control testing report')}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
            >
              <Download size={18} />
              Export
            </button>
            <button 
              onClick={() => router.push('/erm/control-testing/new')}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
            >
              <Plus size={18} />
              New Test
            </button>
          </div>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Test and validate control effectiveness across enterprise risk management
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Tests</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{totalTests}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1">Effective</div>
          <div className="text-2xl font-bold text-green-700">{effectiveTests}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-700 mb-1">Partial</div>
          <div className="text-2xl font-bold text-yellow-700">{partiallyEffective}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-1">Ineffective</div>
          <div className="text-2xl font-bold text-red-700">{ineffectiveTests}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-blue-700">{inProgressTests}</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-indigo-700 mb-1">
            <Shield size={14} />
            Risks Covered
          </div>
          <div className="text-2xl font-bold text-indigo-700">{totalRisksCovered}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--foreground-muted)]" />
            <span className="text-sm font-medium text-[var(--foreground-muted)]">Filters:</span>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--foreground-muted)]">Status:</span>
            <div className="flex gap-2">
              {(['all', 'Effective', 'Partially Effective', 'Ineffective', 'In Progress', 'Not Tested'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    statusFilter === status
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
                  )}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--foreground-muted)]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 border border-[var(--border)] rounded-lg text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-[var(--border)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Test ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Control</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Test Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Tester</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Effectiveness</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Findings</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Risks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredTests.map(test => (
              <tr
                key={test.id}
                onClick={() => router.push(`/erm/control-testing/${test.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-[var(--primary)]">{test.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-[var(--foreground)]">{test.controlTitle}</div>
                  <div className="text-xs text-[var(--foreground-muted)]">{test.controlId}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                    {test.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{new Date(test.testDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">{test.tester}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    <span className={clsx('px-2 py-1 text-xs font-medium rounded', getStatusColor(test.status))}>
                      {test.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {test.effectiveness > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className={clsx('h-2 rounded-full',
                            test.effectiveness >= 80 ? 'bg-green-600' :
                            test.effectiveness >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                          )}
                          style={{ width: `${test.effectiveness}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{test.effectiveness}%</span>
                    </div>
                  ) : (
                    <span className="text-sm text-[var(--foreground-muted)]">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {test.findings > 0 ? (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                      {test.findings} issue{test.findings > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-sm text-green-600">None</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Shield size={14} className="text-[var(--primary)]" />
                    <span className="font-medium">{test.risksCovered}</span>
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

