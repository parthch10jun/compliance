'use client';

import { useState } from 'react';
import { Search, AlertTriangle, Plus, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import clsx from 'clsx';

interface Risk {
  id: string;
  title: string;
  category: string;
  inherentRisk: 'Critical' | 'High' | 'Medium' | 'Low';
  residualRisk: 'Critical' | 'High' | 'Medium' | 'Low';
  owner: string;
  status: 'Open' | 'Mitigating' | 'Closed';
  trend: 'up' | 'down' | 'stable';
}

const risks: Risk[] = [
  { id: '1', title: 'Data breach through third-party vendors', category: 'Cybersecurity', inherentRisk: 'Critical', residualRisk: 'High', owner: 'John D.', status: 'Mitigating', trend: 'down' },
  { id: '2', title: 'Non-compliance with AML regulations', category: 'Regulatory', inherentRisk: 'High', residualRisk: 'Medium', owner: 'Sarah M.', status: 'Open', trend: 'stable' },
  { id: '3', title: 'Insider trading detection gaps', category: 'Operational', inherentRisk: 'High', residualRisk: 'Medium', owner: 'Ahmed K.', status: 'Mitigating', trend: 'down' },
  { id: '4', title: 'Customer data protection inadequacies', category: 'Privacy', inherentRisk: 'Medium', residualRisk: 'Low', owner: 'Lisa P.', status: 'Closed', trend: 'down' },
  { id: '5', title: 'Regulatory reporting delays', category: 'Regulatory', inherentRisk: 'Medium', residualRisk: 'Medium', owner: 'Mike R.', status: 'Open', trend: 'up' },
];

const riskColors = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
};

const statusColors = {
  Open: 'bg-blue-100 text-blue-700',
  Mitigating: 'bg-purple-100 text-purple-700',
  Closed: 'bg-gray-100 text-gray-600',
};

export default function RisksLibrary() {
  const [search, setSearch] = useState('');

  const filteredRisks = risks.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Risk Register</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            {risks.filter(r => r.status === 'Open').length} open risks requiring attention
          </p>
        </div>
        <button className="px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] flex items-center gap-2">
          <Plus size={16} />
          Add Risk
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {(['Critical', 'High', 'Medium', 'Low'] as const).map((level) => (
          <div key={level} className={clsx("p-4 rounded-xl border", riskColors[level])}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} />
              <span className="font-medium">{level}</span>
            </div>
            <p className="text-2xl font-bold">{risks.filter(r => r.inherentRisk === level).length}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
        <input
          type="text"
          placeholder="Search risks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {/* Risks Table */}
      <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-[var(--background-secondary)] border-b border-[var(--border)] text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
          <div className="col-span-4">Risk</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1">Inherent</div>
          <div className="col-span-1">Residual</div>
          <div className="col-span-1">Trend</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Owner</div>
        </div>

        {filteredRisks.map((risk) => (
          <div key={risk.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)] transition-colors">
            <div className="col-span-4 text-sm font-medium text-[var(--foreground)]">{risk.title}</div>
            <div className="col-span-2 text-sm text-[var(--foreground-muted)]">{risk.category}</div>
            <div className="col-span-1">
              <span className={clsx("text-xs px-2 py-1 rounded-full", riskColors[risk.inherentRisk])}>{risk.inherentRisk}</span>
            </div>
            <div className="col-span-1">
              <span className={clsx("text-xs px-2 py-1 rounded-full", riskColors[risk.residualRisk])}>{risk.residualRisk}</span>
            </div>
            <div className="col-span-1">
              {risk.trend === 'up' && <ArrowUpRight size={18} className="text-red-500" />}
              {risk.trend === 'down' && <ArrowDownRight size={18} className="text-green-500" />}
              {risk.trend === 'stable' && <Minus size={18} className="text-gray-400" />}
            </div>
            <div className="col-span-1">
              <span className={clsx("text-xs px-2 py-1 rounded-full", statusColors[risk.status])}>{risk.status}</span>
            </div>
            <div className="col-span-2 text-sm text-[var(--foreground-muted)]">{risk.owner}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

