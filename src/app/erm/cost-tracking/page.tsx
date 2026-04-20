'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, TrendingUp, TrendingDown, AlertCircle, Download, 
  Filter, Plus, PieChart, BarChart3
} from 'lucide-react';
import clsx from 'clsx';

type CostType = 'Direct' | 'Indirect' | 'Opportunity' | 'Preventive' | 'Mitigating' | 'Recovery';
type CostStatus = 'Estimated' | 'Approved' | 'Allocated' | 'Spent' | 'Overrun';

interface CostItem {
  id: string;
  riskId: string;
  riskTitle: string;
  treatmentId?: string;
  treatmentTitle?: string;
  costType: CostType;
  category: string;
  estimatedCost: number;
  actualCost?: number;
  currency: string;
  status: CostStatus;
  fiscalYear: string;
  department: string;
  owner: string;
  dateEstimated: string;
  dateSpent?: string;
  notes: string;
}

const mockCostData: CostItem[] = [
  {
    id: 'COST-001',
    riskId: 'RSK-001',
    riskTitle: 'Third-party vendor data breach',
    treatmentId: 'TRT-001',
    treatmentTitle: 'Enhanced vendor security assessment program',
    costType: 'Preventive',
    category: 'Cybersecurity',
    estimatedCost: 150000,
    actualCost: 145000,
    currency: 'USD',
    status: 'Spent',
    fiscalYear: '2024',
    department: 'IT Security',
    owner: 'Sarah Chen',
    dateEstimated: '2024-01-15',
    dateSpent: '2024-03-20',
    notes: 'Includes vendor assessment tools, training, and consulting fees'
  },
  {
    id: 'COST-002',
    riskId: 'RSK-002',
    riskTitle: 'Cybersecurity threats',
    treatmentId: 'TRT-002',
    treatmentTitle: 'MFA implementation across all systems',
    costType: 'Preventive',
    category: 'Cybersecurity',
    estimatedCost: 85000,
    actualCost: 92000,
    currency: 'USD',
    status: 'Overrun',
    fiscalYear: '2024',
    department: 'IT Infrastructure',
    owner: 'Michael Rodriguez',
    dateEstimated: '2024-02-01',
    dateSpent: '2024-04-15',
    notes: 'Higher than expected due to integration complexity'
  },
  {
    id: 'COST-003',
    riskId: 'RSK-003',
    riskTitle: 'Regulatory compliance failure',
    treatmentId: 'TRT-003',
    treatmentTitle: 'Compliance management system upgrade',
    costType: 'Preventive',
    category: 'Compliance',
    estimatedCost: 200000,
    currency: 'USD',
    status: 'Approved',
    fiscalYear: '2024',
    department: 'Compliance',
    owner: 'Jennifer Walsh',
    dateEstimated: '2024-03-10',
    notes: 'Software licenses, implementation, and training costs'
  },
  {
    id: 'COST-004',
    riskId: 'RSK-004',
    riskTitle: 'Business continuity disruption',
    treatmentId: 'TRT-004',
    treatmentTitle: 'Disaster recovery infrastructure',
    costType: 'Mitigating',
    category: 'Operational',
    estimatedCost: 500000,
    actualCost: 475000,
    currency: 'USD',
    status: 'Spent',
    fiscalYear: '2024',
    department: 'Operations',
    owner: 'David Kim',
    dateEstimated: '2024-01-05',
    dateSpent: '2024-03-30',
    notes: 'Cloud infrastructure, backup systems, and DR testing'
  },
  {
    id: 'COST-005',
    riskId: 'RSK-005',
    riskTitle: 'Market volatility',
    costType: 'Opportunity',
    category: 'Strategic',
    estimatedCost: 300000,
    currency: 'USD',
    status: 'Estimated',
    fiscalYear: '2024',
    department: 'Finance',
    owner: 'Emily Watson',
    dateEstimated: '2024-04-01',
    notes: 'Potential revenue loss due to market conditions'
  },
  {
    id: 'COST-006',
    riskId: 'RSK-001',
    riskTitle: 'Third-party vendor data breach',
    costType: 'Recovery',
    category: 'Cybersecurity',
    estimatedCost: 2000000,
    currency: 'USD',
    status: 'Estimated',
    fiscalYear: '2024',
    department: 'Legal',
    owner: 'Legal Team',
    dateEstimated: '2024-01-20',
    notes: 'Estimated costs for potential breach response, legal fees, and fines'
  }
];

export default function CostTrackingPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | CostStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | CostType>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...new Set(mockCostData.map(c => c.category))];

  const filteredCosts = mockCostData.filter(cost => {
    if (statusFilter !== 'all' && cost.status !== statusFilter) return false;
    if (typeFilter !== 'all' && cost.costType !== typeFilter) return false;
    if (categoryFilter !== 'all' && cost.category !== categoryFilter) return false;
    return true;
  });

  const totalEstimated = mockCostData.reduce((sum, c) => sum + c.estimatedCost, 0);
  const totalSpent = mockCostData.reduce((sum, c) => sum + (c.actualCost || 0), 0);
  const variance = totalSpent - mockCostData.filter(c => c.actualCost).reduce((sum, c) => sum + c.estimatedCost, 0);
  const preventiveCosts = mockCostData.filter(c => c.costType === 'Preventive').reduce((sum, c) => sum + c.estimatedCost, 0);
  const mitigatingCosts = mockCostData.filter(c => c.costType === 'Mitigating').reduce((sum, c) => sum + c.estimatedCost, 0);

  const getStatusColor = (status: CostStatus) => {
    switch (status) {
      case 'Estimated': return 'bg-gray-100 text-gray-700';
      case 'Approved': return 'bg-blue-100 text-blue-700';
      case 'Allocated': return 'bg-purple-100 text-purple-700';
      case 'Spent': return 'bg-green-100 text-green-700';
      case 'Overrun': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <DollarSign size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Cost Tracking</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => alert('Export cost report')}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
            >
              <Download size={18} />
              Export
            </button>
            <button 
              onClick={() => router.push('/erm/cost-tracking/new')}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
            >
              <Plus size={18} />
              Add Cost
            </button>
          </div>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Track and analyze treatment costs across risk management activities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Estimated</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalEstimated)}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1">Total Spent</div>
          <div className="text-2xl font-bold text-green-700">{formatCurrency(totalSpent)}</div>
        </div>
        <div className={clsx(
          'border rounded-lg p-4',
          variance > 0 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
        )}>
          <div className={clsx('text-sm mb-1', variance > 0 ? 'text-red-700' : 'text-blue-700')}>
            Variance
          </div>
          <div className={clsx(
            'text-2xl font-bold flex items-center gap-2',
            variance > 0 ? 'text-red-700' : 'text-blue-700'
          )}>
            {variance > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            {formatCurrency(Math.abs(variance))}
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-700 mb-1">Preventive</div>
          <div className="text-2xl font-bold text-purple-700">{formatCurrency(preventiveCosts)}</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="text-sm text-indigo-700 mb-1">Mitigating</div>
          <div className="text-2xl font-bold text-indigo-700">{formatCurrency(mitigatingCosts)}</div>
        </div>
      </div>

      {/* Cost Distribution Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Cost by Type</h3>
            <PieChart size={20} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {(['Preventive', 'Mitigating', 'Recovery', 'Opportunity', 'Direct', 'Indirect'] as CostType[]).map(type => {
              const typeCosts = mockCostData.filter(c => c.costType === type);
              const total = typeCosts.reduce((sum, c) => sum + c.estimatedCost, 0);
              const percentage = (total / totalEstimated) * 100;

              return total > 0 ? (
                <div key={type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{type}</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(total)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Cost by Category</h3>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {categories.filter(c => c !== 'all').map(category => {
              const catCosts = mockCostData.filter(c => c.category === category);
              const total = catCosts.reduce((sum, c) => sum + c.estimatedCost, 0);
              const percentage = (total / totalEstimated) * 100;

              return (
                <div key={category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{category}</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(total)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--border)] rounded-lg px-6 py-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--foreground-muted)]" />
            <span className="text-sm font-semibold text-[var(--foreground)]">Filters:</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--foreground)]">Status:</span>
            <div className="flex gap-2">
              {(['all', 'Estimated', 'Approved', 'Allocated', 'Spent', 'Overrun'] as const).map(status => (
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

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--foreground)]">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-4 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
            >
              <option value="all">All Types</option>
              <option value="Preventive">Preventive</option>
              <option value="Mitigating">Mitigating</option>
              <option value="Recovery">Recovery</option>
              <option value="Opportunity">Opportunity</option>
              <option value="Direct">Direct</option>
              <option value="Indirect">Indirect</option>
            </select>
          </div>

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

      {/* Cost Table */}
      <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Risk / Treatment</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Estimated</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Actual</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Variance</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCosts.map(cost => {
              const variance = cost.actualCost ? cost.actualCost - cost.estimatedCost : 0;

              return (
                <tr
                  key={cost.id}
                  onClick={() => router.push(`/erm/cost-tracking/${cost.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-teal-600 text-sm">{cost.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 text-sm">{cost.riskTitle}</div>
                    {cost.treatmentTitle && (
                      <div className="text-xs text-gray-500 mt-0.5">{cost.treatmentTitle}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{cost.costType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{cost.category}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(cost.estimatedCost)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {cost.actualCost ? (
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(cost.actualCost)}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {cost.actualCost ? (
                      <span className={clsx(
                        'text-sm font-semibold flex items-center justify-end gap-1',
                        variance > 0 ? 'text-red-600' : variance < 0 ? 'text-green-600' : 'text-gray-600'
                      )}>
                        {variance > 0 && <TrendingUp size={14} />}
                        {variance < 0 && <TrendingDown size={14} />}
                        {formatCurrency(Math.abs(variance))}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx('px-2 py-1 text-xs font-medium rounded', getStatusColor(cost.status))}>
                      {cost.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{cost.owner}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

