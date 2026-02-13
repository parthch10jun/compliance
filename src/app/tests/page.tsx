'use client';

import { useState } from 'react';
import { FlaskConical, Plus, Grid3X3, List, CheckCircle, XCircle, Clock, PlayCircle, Circle, Link2, Calendar, Search } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, SearchFilterBar, FilterButtonGroup, TestDetailModal, AttachEvidenceToTestModal, ExecuteTestModal } from '@/components';

// Mock Tests Data (Shared Library - can be linked to multiple controls)
const mockTests = [
  { id: 'TST-001', code: 'TST-001', name: 'Access Control Verification', type: 'Operating Effectiveness', frequency: 'Quarterly', linkedControls: ['CTRL-001', 'CTRL-005', 'CTRL-012'], status: 'Passed', scheduledDate: '2024-01-15', completedDate: '2024-01-15', tester: 'John Smith', evidenceCount: 3 },
  { id: 'TST-002', code: 'TST-002', name: 'Password Policy Compliance', type: 'Design', frequency: 'Annual', linkedControls: ['CTRL-002'], status: 'Passed', scheduledDate: '2024-01-10', completedDate: '2024-01-10', tester: 'Sarah Johnson', evidenceCount: 2 },
  { id: 'TST-003', code: 'TST-003', name: 'Data Backup Verification', type: 'Operating Effectiveness', frequency: 'Monthly', linkedControls: ['CTRL-003', 'CTRL-008'], status: 'Failed', scheduledDate: '2024-01-20', completedDate: '2024-01-20', tester: 'Mike Chen', evidenceCount: 4 },
  { id: 'TST-004', code: 'TST-004', name: 'Encryption Standards Check', type: 'Design', frequency: 'Quarterly', linkedControls: ['CTRL-004', 'CTRL-009', 'CTRL-015'], status: 'In Progress', scheduledDate: '2024-01-25', tester: 'Emily Davis', evidenceCount: 1 },
  { id: 'TST-005', code: 'TST-005', name: 'Incident Response Drill', type: 'Walkthrough', frequency: 'Annual', linkedControls: ['CTRL-006', 'CTRL-007'], status: 'Pending', scheduledDate: '2024-02-01', tester: 'Alex Wilson', evidenceCount: 0 },
  { id: 'TST-006', code: 'TST-006', name: 'Vendor Access Review', type: 'Operating Effectiveness', frequency: 'Quarterly', linkedControls: ['CTRL-010'], status: 'Not Started', scheduledDate: '2024-02-15', tester: 'Lisa Brown', evidenceCount: 0 },
  { id: 'TST-007', code: 'TST-007', name: 'Change Management Audit', type: 'Operating Effectiveness', frequency: 'Monthly', linkedControls: ['CTRL-011', 'CTRL-014'], status: 'Passed', scheduledDate: '2024-01-05', completedDate: '2024-01-05', tester: 'David Lee', evidenceCount: 5 },
  { id: 'TST-008', code: 'TST-008', name: 'Network Segmentation Test', type: 'Design', frequency: 'Annual', linkedControls: ['CTRL-013'], status: 'Passed', scheduledDate: '2024-01-08', completedDate: '2024-01-08', tester: 'Rachel Kim', evidenceCount: 2 },
];

const statusConfig = {
  'Passed': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  'Failed': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  'In Progress': { icon: PlayCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  'Pending': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  'Not Started': { icon: Circle, color: 'text-gray-500', bg: 'bg-gray-50' },
};

type StatusFilter = 'all' | 'Passed' | 'Failed' | 'In Progress' | 'Pending' | 'Not Started';

export default function TestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedTest, setSelectedTest] = useState<typeof mockTests[0] | null>(null);
  const [isTestDetailOpen, setIsTestDetailOpen] = useState(false);
  const [isAttachEvidenceOpen, setIsAttachEvidenceOpen] = useState(false);
  const [isExecuteTestOpen, setIsExecuteTestOpen] = useState(false);

  const filteredTests = mockTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) || test.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockTests.length,
    passed: mockTests.filter(t => t.status === 'Passed').length,
    failed: mockTests.filter(t => t.status === 'Failed').length,
    inProgress: mockTests.filter(t => t.status === 'In Progress').length,
    pending: mockTests.filter(t => t.status === 'Pending' || t.status === 'Not Started').length,
    reusedAcrossControls: mockTests.filter(t => t.linkedControls.length > 1).length,
  };

  const handleTestClick = (test: typeof mockTests[0]) => {
    setSelectedTest(test);
    setIsTestDetailOpen(true);
  };

  const handleAttachEvidence = () => {
    setIsTestDetailOpen(false);
    setIsAttachEvidenceOpen(true);
  };

  const handleExecuteTest = () => {
    setIsTestDetailOpen(false);
    setIsExecuteTestOpen(true);
  };

  const handleEvidenceAttached = (evidence: any) => {
    console.log('Evidence attached:', evidence);
    setIsAttachEvidenceOpen(false);
    setIsTestDetailOpen(true);
  };

  const handleTestExecuted = (result: any) => {
    console.log('Test executed:', result);
    setIsExecuteTestOpen(false);
    setIsTestDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Test Library"
        description="Reusable tests that can be linked to multiple controls across programs"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md">
            <Plus size={18} />
            <span>Add Test</span>
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-4 animate-fade-in-up delay-1">
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Total Tests</p>
          <p className="text-h2 font-bold text-[var(--foreground)] mt-1">{stats.total}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Passed</p>
          <p className="text-h2 font-bold text-green-600 mt-1">{stats.passed}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Failed</p>
          <p className="text-h2 font-bold text-red-600 mt-1">{stats.failed}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">In Progress</p>
          <p className="text-h2 font-bold text-blue-600 mt-1">{stats.inProgress}</p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[var(--border)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--foreground-muted)] font-medium">Pending</p>
          <p className="text-h2 font-bold text-amber-600 mt-1">{stats.pending}</p>
        </div>
        <div className="p-5 rounded-xl bg-[var(--primary-lightest)] border border-[var(--primary)] hover:shadow-md transition-shadow">
          <p className="text-p3 text-[var(--primary)] font-medium">Reused Tests</p>
          <p className="text-h2 font-bold text-[var(--primary)] mt-1">{stats.reusedAcrossControls}</p>
          <p className="text-p3 text-[var(--primary)] mt-0.5">Linked to 2+ controls</p>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search tests by code or name..."
        filters={
          <FilterButtonGroup
            options={['all', 'Passed', 'Failed', 'In Progress', 'Pending', 'Not Started']}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
            label="Status"
          />
        }
      />

      {/* Tests Table */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden animate-fade-in-up delay-2 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-[var(--background-secondary)]">
            <tr>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Test</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Type</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Frequency</th>
              <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Linked Controls</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Scheduled</th>
              <th className="text-center px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Evidence</th>
              <th className="text-left px-6 py-4 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Tester</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-white">
            {filteredTests.map(test => {
              const StatusIcon = statusConfig[test.status as keyof typeof statusConfig].icon;
              return (
                <tr
                  key={test.id}
                  onClick={() => handleTestClick(test)}
                  className="hover:bg-[var(--background-secondary)] cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FlaskConical size={18} className="text-[var(--primary)]" />
                      <div>
                        <p className="text-p2 font-medium text-[var(--foreground)]">{test.name}</p>
                        <p className="text-p3 text-[var(--foreground-muted)]">{test.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-p2 text-[var(--foreground)]">{test.type}</td>
                  <td className="px-6 py-4 text-p2 text-[var(--foreground)]">{test.frequency}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full text-p3 font-medium', test.linkedControls.length > 1 ? 'bg-[var(--primary-lightest)] text-[var(--primary)]' : 'bg-gray-100 text-gray-600')}>
                      <Link2 size={12} />
                      {test.linkedControls.length}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full text-p3 font-medium', statusConfig[test.status as keyof typeof statusConfig].bg, statusConfig[test.status as keyof typeof statusConfig].color)}>
                      <StatusIcon size={12} />{test.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-p2 text-[var(--foreground)]">
                    <div className="flex items-center gap-1"><Calendar size={14} className="text-[var(--foreground-muted)]" />{test.scheduledDate}</div>
                  </td>
                  <td className="px-6 py-4 text-center text-p2 font-medium text-[var(--foreground)]">{test.evidenceCount}</td>
                  <td className="px-6 py-4 text-p2 text-[var(--foreground)]">{test.tester}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <TestDetailModal
        isOpen={isTestDetailOpen}
        onClose={() => setIsTestDetailOpen(false)}
        test={selectedTest ? {
          ...selectedTest,
          description: `${selectedTest.type} test for ${selectedTest.name}`,
          procedure: `1. Review test requirements\n2. Execute test steps\n3. Document results\n4. Attach evidence`,
          expectedResult: 'Test should pass all criteria',
          actualResult: selectedTest.status === 'Passed' ? 'All criteria met successfully' : selectedTest.status === 'Failed' ? 'Some criteria not met' : undefined,
        } : undefined}
        onAttachEvidence={handleAttachEvidence}
        onExecuteTest={handleExecuteTest}
      />

      <AttachEvidenceToTestModal
        isOpen={isAttachEvidenceOpen}
        onClose={() => setIsAttachEvidenceOpen(false)}
        test={selectedTest ? {
          id: selectedTest.id,
          code: selectedTest.code,
          name: selectedTest.name,
        } : undefined}
        onAttach={handleEvidenceAttached}
      />

      <ExecuteTestModal
        isOpen={isExecuteTestOpen}
        onClose={() => setIsExecuteTestOpen(false)}
        test={selectedTest ? {
          id: selectedTest.id,
          name: selectedTest.name,
          procedure: `1. Review test requirements\n2. Execute test steps\n3. Document results\n4. Attach evidence`,
        } : undefined}
        onExecute={handleTestExecuted}
      />
    </div>
  );
}

