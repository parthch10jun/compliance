'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockRisks, type Risk } from '@/lib/data/erm-risks';
import RiskHeatMap from '@/components/erm/RiskHeatMap';
import ToleranceTracking from '@/components/erm/ToleranceTracking';
import TrendAnalysis from '@/components/erm/TrendAnalysis';
import RiskDetailModal from '@/components/erm/RiskDetailModal';
import ExportMenu from '@/components/erm/ExportMenu';
import {
  AlertTriangle, Shield, TrendingUp, Activity,
  CheckCircle2, Clock, Target, BarChart3,
  AlertCircle, FileText, Users, Settings, ArrowRight, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

export default function ERMDashboard() {
  const router = useRouter();
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  // Calculate real stats from mock data
  const totalRisks = mockRisks.length;
  const criticalRisks = mockRisks.filter(r => r.inherentRating === 'Critical').length;
  const treatedRisks = mockRisks.filter(r => r.status === 'Treated').length;
  const treatmentRate = Math.round((treatedRisks / totalRisks) * 100);

  // Category breakdown
  const categoryStats = mockRisks.reduce((acc, risk) => {
    acc[risk.category] = (acc[risk.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  const handleScoreCardClick = (filter: string) => {
    router.push(`/erm/risk-register?filter=${filter}`);
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/erm/risk-register?category=${category}`);
  };

  const handleToleranceViewAll = () => {
    router.push(`/erm/risk-register?filter=over-tolerance`);
  };

  return (
    <>
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-[var(--foreground)] mb-2">Enterprise Risk Management</h1>
          <p className="text-p2 text-[var(--foreground-muted)]">Monitor, assess, and mitigate enterprise-wide risks</p>
        </div>
        <ExportMenu screenName="ERM_Dashboard" />
      </div>

      {/* Key Metrics - Clickable Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Risks - Click to see all */}
        <button
          onClick={() => handleScoreCardClick('all')}
          className="card-hover bg-white rounded-lg border border-[var(--border)] p-4 h-full text-left transition-all hover:shadow-lg hover:border-indigo-300 group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
              <AlertTriangle size={18} />
            </div>
            <ChevronRight size={16} className="text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">{totalRisks}</p>
          <p className="text-sm text-[var(--foreground-muted)]">Total Risks</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="text-xs text-[var(--foreground-muted)]">Click to view all</span>
          </div>
        </button>

        {/* Critical Risks - Click to filter */}
        <button
          onClick={() => handleScoreCardClick('critical')}
          className="card-hover bg-white rounded-lg border border-[var(--border)] p-4 h-full text-left transition-all hover:shadow-lg hover:border-red-300 group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors">
              <AlertCircle size={18} />
            </div>
            <ChevronRight size={16} className="text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">{criticalRisks}</p>
          <p className="text-sm text-[var(--foreground-muted)]">Critical</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            <span className="text-xs text-[var(--foreground-muted)]">Requires immediate action</span>
          </div>
        </button>

        {/* Treated Risks - Click to filter */}
        <button
          onClick={() => handleScoreCardClick('treated')}
          className="card-hover bg-white rounded-lg border border-[var(--border)] p-4 h-full text-left transition-all hover:shadow-lg hover:border-green-300 group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
              <Shield size={18} />
            </div>
            <ChevronRight size={16} className="text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">{treatedRisks}</p>
          <p className="text-sm text-[var(--foreground-muted)]">Treated Risks</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="text-xs text-[var(--foreground-muted)]">View treatment details</span>
          </div>
        </button>

        {/* Treatment Rate - Click to dashboard */}
        <button
          onClick={() => handleScoreCardClick('treated')}
          className="card-hover bg-white rounded-lg border border-[var(--border)] p-4 h-full text-left transition-all hover:shadow-lg hover:border-indigo-300 group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
              <TrendingUp size={18} />
            </div>
            <ChevronRight size={16} className="text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">{treatmentRate}%</p>
          <p className="text-sm text-[var(--foreground-muted)]">Treatment Rate</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            <span className="text-xs text-[var(--foreground-muted)]">View effectiveness</span>
          </div>
        </button>
      </div>

      {/* HERO: Trend Analysis - FIRST and IMPRESSIVE */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Risk Trend Analysis</h2>
          <p className="text-p2 text-[var(--foreground-muted)]">Historical risk profile and trajectory over time</p>
        </div>
        <TrendAnalysis currentRisks={mockRisks} />
      </div>

      {/* Quadrant Grid: Heat Map + Tolerance Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quadrant 1: Interactive Heat Map */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[var(--foreground)]">Risk Heat Map</h2>
            <p className="text-p3 text-[var(--foreground-muted)]">Interactive 5x5 matrix with drill-down</p>
          </div>
          <RiskHeatMap risks={mockRisks} onRiskClick={setSelectedRisk} />
        </div>

        {/* Quadrant 3: Tolerance Tracking */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[var(--foreground)]">Risk Tolerance Tracking</h2>
            <p className="text-p3 text-[var(--foreground-muted)]">Monitor risks exceeding threshold</p>
          </div>
          <ToleranceTracking
            risks={mockRisks}
            toleranceThreshold="Medium"
            onRiskClick={setSelectedRisk}
            onViewAll={handleToleranceViewAll}
          />
        </div>
      </div>

      {/* Quadrant 2: Risks by Category - Clickable Drill-Down */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">Risks by Category</h2>
            <p className="text-p3 text-[var(--foreground-muted)]">Click any category to drill down</p>
          </div>
          <Link
            href="/erm/risk-register"
            className="text-p3 text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            View All
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {categories.map((cat) => {
            const percentage = Math.round((cat.count / totalRisks) * 100);
            const colorMap: Record<string, { bg: string; bar: string; hover: string; border: string }> = {
              'Cybersecurity': { bg: 'bg-indigo-50', bar: 'bg-indigo-500', hover: 'hover:bg-indigo-100', border: 'border-indigo-200' },
              'Operational': { bg: 'bg-blue-50', bar: 'bg-blue-500', hover: 'hover:bg-blue-100', border: 'border-blue-200' },
              'Financial': { bg: 'bg-green-50', bar: 'bg-green-500', hover: 'hover:bg-green-100', border: 'border-green-200' },
              'Compliance': { bg: 'bg-purple-50', bar: 'bg-purple-500', hover: 'hover:bg-purple-100', border: 'border-purple-200' },
              'Strategic': { bg: 'bg-amber-50', bar: 'bg-amber-500', hover: 'hover:bg-amber-100', border: 'border-amber-200' },
            };
            const colors = colorMap[cat.name] || { bg: 'bg-gray-50', bar: 'bg-gray-500', hover: 'hover:bg-gray-100', border: 'border-gray-200' };

            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={clsx(
                  'w-full text-left transition-all group border rounded-lg p-4',
                  colors.bg,
                  colors.hover,
                  colors.border
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-p2 font-semibold text-[var(--foreground)]">{cat.name}</span>
                    <ChevronRight size={16} className="text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-p3 text-[var(--foreground-muted)]">{cat.count} risks ({percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                  <div
                    className={clsx(colors.bar, 'h-full transition-all duration-500')}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* OLD Risk Distribution - REMOVED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8" style={{ display: 'none' }}>
        {/* Risk by Severity */}
        <div className="lg:col-span-2 bg-white border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-6">Risk Distribution by Severity</h2>
          <div className="space-y-4">
            {[
              { label: 'Critical', count: 8, percentage: 6, color: 'bg-red-500' },
              { label: 'High', count: 23, percentage: 18, color: 'bg-orange-500' },
              { label: 'Medium', count: 51, percentage: 40, color: 'bg-yellow-500' },
              { label: 'Low', count: 45, percentage: 36, color: 'bg-green-500' },
            ].map((risk) => (
              <div key={risk.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-p2 font-medium text-[var(--foreground)]">{risk.label}</span>
                  <span className="text-p3 text-[var(--foreground-muted)]">{risk.count} risks ({risk.percentage}%)</span>
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
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-6">Top Risk Categories</h2>
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
                    <span className={`text-p3 font-bold ${cat.color}`}>{cat.count}</span>
                  </div>
                  <span className="text-p2 font-medium text-[var(--foreground)]">{cat.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Risk Activities */}
      <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Recent Risk Activities</h2>
          <p className="text-p3 text-[var(--foreground-muted)]">Latest updates and actions</p>
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
                    <span className="text-p3 font-semibold text-indigo-600 uppercase tracking-wide">{activity.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-p3 font-semibold uppercase border ${activity.severityColor}`}>
                      {activity.severity}
                    </span>
                  </div>
                  <h3 className="text-p2 font-semibold text-[var(--foreground)] mb-2">{activity.title}</h3>
                  <div className="flex items-center gap-4 text-p3 text-[var(--foreground-muted)]">
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

    {/* Risk Detail Modal */}
    <RiskDetailModal
      risk={selectedRisk}
      isOpen={selectedRisk !== null}
      onClose={() => setSelectedRisk(null)}
    />
    </>
  );
}
