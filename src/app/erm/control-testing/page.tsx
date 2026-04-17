'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, AlertCircle, Plus, Filter, Download, Shield, ChevronDown, ChevronRight, Star } from 'lucide-react';
import clsx from 'clsx';

type TestStatus = 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Tested' | 'In Progress';
type RiskRating = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Critical';

interface Risk {
  id: string;
  title: string;
  category: string;
  inherentRating: RiskRating;
  controlEffectiveness: TestStatus;
  residualRating: RiskRating;
  isAdhoc?: boolean;
}

interface RiskCategory {
  id: string;
  name: string;
  category: string;
  risks: Risk[];
  expanded?: boolean;
}

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

interface ControlEffectivenessData {
  category: string;
  effective: number;
  partiallyEffective: number;
  ineffective: number;
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

// Assessment Summary Mock Data
const assessmentRisks: RiskCategory[] = [
  {
    id: 'cat-1',
    name: 'Retail Banking → Enterprise Risk → Americas → NA',
    category: 'Retail Banking',
    expanded: true,
    risks: [
      {
        id: 'risk-1',
        title: 'Employee turnover and retention',
        category: 'Retail Banking',
        inherentRating: 'Very Low',
        controlEffectiveness: 'Ineffective',
        residualRating: 'Very Low',
        isAdhoc: true
      },
      {
        id: 'risk-2',
        title: 'New hires are not aligned to corporate goals',
        category: 'Retail Banking',
        inherentRating: 'Medium',
        controlEffectiveness: 'Effective',
        residualRating: 'Very Low'
      }
    ]
  }
];

// Control Effectiveness by Category
const controlEffectivenessData: ControlEffectivenessData[] = [
  { category: 'Compliance', effective: 8, partiallyEffective: 2, ineffective: 1 },
  { category: 'Financial', effective: 5, partiallyEffective: 3, ineffective: 2 },
  { category: 'Health & Safety', effective: 6, partiallyEffective: 2, ineffective: 1 },
  { category: 'Information Security', effective: 7, partiallyEffective: 4, ineffective: 2 },
  { category: 'Legal', effective: 5, partiallyEffective: 1, ineffective: 1 },
  { category: 'Market', effective: 4, partiallyEffective: 2, ineffective: 1 },
  { category: 'Operational', effective: 12, partiallyEffective: 5, ineffective: 3 },
  { category: 'Operational Resilience', effective: 6, partiallyEffective: 3, ineffective: 2 },
  { category: 'Strategic', effective: 5, partiallyEffective: 3, ineffective: 2 }
];

export default function ERMControlTestingPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['cat-1']));
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | TestStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'summary' | 'effectiveness' | 'tests'>('summary');

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

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

  const getRatingColor = (rating: RiskRating) => {
    switch (rating) {
      case 'Very Low': return 'bg-green-100 text-green-700';
      case 'Low': return 'bg-blue-100 text-blue-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRatingBadge = (rating: RiskRating) => {
    const colors = {
      'Very Low': 'bg-green-500',
      'Low': 'bg-blue-500',
      'Medium': 'bg-yellow-500',
      'High': 'bg-orange-500',
      'Critical': 'bg-red-500'
    };
    return <div className={`w-3 h-3 rounded-full ${colors[rating]}`} />;
  };

  // Calculate max value for chart scaling
  const maxTotal = Math.max(...controlEffectivenessData.map(d => d.effective + d.partiallyEffective + d.ineffective));

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

      {/* Tabs */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-2 mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('summary')}
          className={clsx(
            'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'summary'
              ? 'bg-[var(--primary)] text-white'
              : 'text-[var(--foreground-muted)] hover:bg-gray-100'
          )}
        >
          Assessment Summary
        </button>
        <button
          onClick={() => setActiveTab('effectiveness')}
          className={clsx(
            'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'effectiveness'
              ? 'bg-[var(--primary)] text-white'
              : 'text-[var(--foreground-muted)] hover:bg-gray-100'
          )}
        >
          Control Effectiveness
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={clsx(
            'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'tests'
              ? 'bg-[var(--primary)] text-white'
              : 'text-[var(--foreground-muted)] hover:bg-gray-100'
          )}
        >
          All Tests
        </button>
      </div>

      {/* Assessment Summary */}
      {activeTab === 'summary' && (
        <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Assessment Summary</h3>
          <p className="text-sm text-[var(--foreground-muted)] mb-6">
            The scope of the assessment is displayed here. Click on the Risk name to perform the inherent, residual and control effectiveness assessment. The star indicates that the risk is added Ad-hoc during assessment. This Ad-hoc risk can be added from the library or typed in during assessment.
          </p>

          {/* Risk Categories */}
          <div className="space-y-2">
            {assessmentRisks.map((category) => (
              <div key={category.id} className="border border-[var(--border)] rounded-lg overflow-hidden">
                {/* Category Header */}
                <div
                  className="flex items-center gap-2 px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown size={16} className="text-[var(--foreground-muted)]" />
                  ) : (
                    <ChevronRight size={16} className="text-[var(--foreground-muted)]" />
                  )}
                  <span className="text-sm font-medium text-[var(--foreground)]">{category.name}</span>
                  <span className="text-xs text-[var(--foreground-muted)] ml-2">{category.risks.length} Risks</span>
                </div>

                {/* Risks Table */}
                {expandedCategories.has(category.id) && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-t border-[var(--border)]">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--foreground)]"></th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--foreground)]"></th>
                          <th className="px-4 py-2 text-center text-xs font-semibold text-[var(--foreground)]">Inherent Rating</th>
                          <th className="px-4 py-2 text-center text-xs font-semibold text-[var(--foreground)]">Control Effectiveness</th>
                          <th className="px-4 py-2 text-center text-xs font-semibold text-[var(--foreground)]">Residual Rating</th>
                          <th className="px-4 py-2 text-center text-xs font-semibold text-[var(--foreground)]"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {category.risks.map((risk) => (
                          <tr key={risk.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 w-8">
                              <AlertCircle size={16} className="text-orange-500" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="text-sm font-medium text-[var(--primary)] hover:underline">
                                  {risk.title}
                                </button>
                                {risk.isAdhoc && (
                                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {getRatingBadge(risk.inherentRating)}
                                <span className={clsx('px-2 py-1 text-xs font-medium rounded', getRatingColor(risk.inherentRating))}>
                                  {risk.inherentRating}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {getStatusIcon(risk.controlEffectiveness)}
                                <span className={clsx('px-2 py-1 text-xs font-medium rounded', getStatusColor(risk.controlEffectiveness))}>
                                  {risk.controlEffectiveness}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {getRatingBadge(risk.residualRating)}
                                <span className={clsx('px-2 py-1 text-xs font-medium rounded', getRatingColor(risk.residualRating))}>
                                  {risk.residualRating}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM8 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM13 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Effectiveness Chart */}
      {activeTab === 'effectiveness' && (
        <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Control Effectiveness</h3>

          {/* Chart */}
          <div className="space-y-6">
            {controlEffectivenessData.map((data) => {
              const total = data.effective + data.partiallyEffective + data.ineffective;
              const effectivePercent = (data.effective / maxTotal) * 100;
              const partialPercent = (data.partiallyEffective / maxTotal) * 100;
              const ineffectivePercent = (data.ineffective / maxTotal) * 100;

              return (
                <div key={data.category}>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-32 text-sm font-medium text-[var(--foreground)]">{data.category}</div>
                    <div className="flex-1 flex h-12 rounded overflow-hidden border border-[var(--border)]">
                      {data.effective > 0 && (
                        <div
                          className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${effectivePercent}%` }}
                          title={`Effective: ${data.effective}`}
                        >
                          {data.effective > 0 && data.effective}
                        </div>
                      )}
                      {data.partiallyEffective > 0 && (
                        <div
                          className="bg-yellow-500 flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${partialPercent}%` }}
                          title={`Partially Effective: ${data.partiallyEffective}`}
                        >
                          {data.partiallyEffective > 0 && data.partiallyEffective}
                        </div>
                      )}
                      {data.ineffective > 0 && (
                        <div
                          className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${ineffectivePercent}%` }}
                          title={`Ineffective: ${data.ineffective}`}
                        >
                          {data.ineffective > 0 && data.ineffective}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-[var(--foreground-muted)]">{total} risks</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-[var(--foreground-muted)]">Effective</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-[var(--foreground-muted)]">Partially Effective</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-[var(--foreground-muted)]">Ineffective</span>
            </div>
          </div>
        </div>
      )}

      {/* All Tests View */}
      {activeTab === 'tests' && (
        <>
      {/* Summary Cards - Only in Tests View */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Tests</div>
          <div className="text-2xl font-bold text-gray-900">{totalTests}</div>
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
      <div className="bg-white border border-[var(--border)] rounded-lg px-6 py-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--foreground-muted)]" />
            <span className="text-sm font-semibold text-[var(--foreground)]">Filters:</span>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--foreground)]">Status:</span>
            <div className="flex gap-2">
              {(['all', 'Effective', 'Partially Effective', 'Ineffective', 'In Progress', 'Not Tested'] as const).map(status => (
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

          {/* Category Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--foreground)]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
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
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Test ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Control</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Test Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Tester</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Effectiveness</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Findings</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Risks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTests.map(test => (
              <tr
                key={test.id}
                onClick={() => router.push(`/erm/control-testing/${test.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-teal-600 text-sm">{test.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 text-sm">{test.controlTitle}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{test.controlId}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">
                    {test.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">{new Date(test.testDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">{test.tester}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    <span className="text-sm font-medium text-gray-700">{test.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {test.effectiveness > 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[80px] max-w-[120px]">
                        <div
                          className={clsx('h-2 rounded-full',
                            test.effectiveness >= 80 ? 'bg-green-500' :
                            test.effectiveness >= 60 ? 'bg-orange-500' : 'bg-red-500'
                          )}
                          style={{ width: `${test.effectiveness}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 min-w-[35px]">{test.effectiveness}%</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {test.findings > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-red-50 text-red-700">
                      {test.findings} Issue{test.findings > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-700">None</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <Shield size={16} className="text-teal-600" />
                    <span className="font-medium">{test.risksCovered}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
}

