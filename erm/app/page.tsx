'use client';

import { useState } from 'react';
import { 
  AlertTriangle, Shield, TrendingUp, Activity, 
  CheckCircle2, Clock, Target, BarChart3,
  AlertCircle, FileText, Users, Settings
} from 'lucide-react';

export default function ERMDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'month' | 'quarter' | 'year'>('month');

  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-lg flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">Enterprise Risk Management</h1>
            <p className="text-[var(--foreground-muted)]">Monitor, assess, and mitigate enterprise-wide risks</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Risks */}
        <div className="bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={24} className="text-indigo-600" />
            </div>
            <span className="text-xs text-[var(--foreground-muted)] font-semibold uppercase tracking-wide">Total Risks</span>
          </div>
          <div className="text-3xl font-bold text-[var(--foreground)] mb-1">127</div>
          <p className="text-sm text-green-600 font-medium">↓ 8% from last month</p>
        </div>

        {/* Critical Risks */}
        <div className="bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <span className="text-xs text-[var(--foreground-muted)] font-semibold uppercase tracking-wide">Critical</span>
          </div>
          <div className="text-3xl font-bold text-[var(--foreground)] mb-1">8</div>
          <p className="text-sm text-red-600 font-medium">Require immediate action</p>
        </div>

        {/* Mitigations Active */}
        <div className="bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-green-600" />
            </div>
            <span className="text-xs text-[var(--foreground-muted)] font-semibold uppercase tracking-wide">Mitigations</span>
          </div>
          <div className="text-3xl font-bold text-[var(--foreground)] mb-1">94</div>
          <p className="text-sm text-green-600 font-medium">↑ 12% this quarter</p>
        </div>

        {/* Risk Score */}
        <div className="bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-amber-600" />
            </div>
            <span className="text-xs text-[var(--foreground-muted)] font-semibold uppercase tracking-wide">Risk Score</span>
          </div>
          <div className="text-3xl font-bold text-[var(--foreground)] mb-1">6.2</div>
          <p className="text-sm text-amber-600 font-medium">Medium risk level</p>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Risk by Severity */}
        <div className="lg:col-span-2 bg-white border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">Risk Distribution by Severity</h2>
          <div className="space-y-4">
            {[
              { label: 'Critical', count: 8, percentage: 6, color: 'bg-red-500' },
              { label: 'High', count: 23, percentage: 18, color: 'bg-orange-500' },
              { label: 'Medium', count: 51, percentage: 40, color: 'bg-yellow-500' },
              { label: 'Low', count: 45, percentage: 36, color: 'bg-green-500' },
            ].map((risk) => (
              <div key={risk.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">{risk.label}</span>
                  <span className="text-sm text-[var(--foreground-muted)]">{risk.count} risks ({risk.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${risk.color} transition-all duration-500`}
                    style={{ width: `${risk.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Risk Categories */}
        <div className="bg-white border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">Top Risk Categories</h2>
          <div className="space-y-3">
            {[
              { category: 'Cybersecurity', count: 34, color: 'text-indigo-600', bg: 'bg-indigo-100' },
              { category: 'Operational', count: 28, color: 'text-blue-600', bg: 'bg-blue-100' },
              { category: 'Financial', count: 22, color: 'text-green-600', bg: 'bg-green-100' },
              { category: 'Compliance', count: 19, color: 'text-purple-600', bg: 'bg-purple-100' },
              { category: 'Strategic', count: 15, color: 'text-amber-600', bg: 'bg-amber-100' },
            ].map((cat) => (
              <div key={cat.category} className="flex items-center justify-between p-3 bg-[var(--background-secondary)] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${cat.bg} rounded-lg flex items-center justify-center`}>
                    <span className={`text-xs font-bold ${cat.color}`}>{cat.count}</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)]">{cat.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Risk Activities */}
      <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background-secondary)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Risk Activities</h2>
          <p className="text-sm text-[var(--foreground-muted)]">Latest updates and actions</p>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {[
            { 
              type: 'New Risk', 
              title: 'Third-party vendor data breach exposure', 
              severity: 'Critical',
              severityColor: 'bg-red-100 text-red-700 border-red-200',
              time: '2 hours ago',
              owner: 'Security Team'
            },
            { 
              type: 'Mitigation', 
              title: 'Implemented multi-factor authentication across all systems', 
              severity: 'Completed',
              severityColor: 'bg-green-100 text-green-700 border-green-200',
              time: '5 hours ago',
              owner: 'IT Security'
            },
            { 
              type: 'Assessment', 
              title: 'Quarterly operational risk assessment initiated', 
              severity: 'In Progress',
              severityColor: 'bg-blue-100 text-blue-700 border-blue-200',
              time: '1 day ago',
              owner: 'Risk Team'
            },
          ].map((activity, idx) => (
            <div key={idx} className="p-6 hover:bg-[var(--background-secondary)] transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{activity.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase border ${activity.severityColor}`}>
                      {activity.severity}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">{activity.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{activity.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{activity.owner}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
