'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardCheck, Plus, Calendar, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { mockCampaigns, type Campaign } from '@/lib/data/assessments';

export default function AssessmentsPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<'all' | Campaign['status']>('all');

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    if (selectedStatus !== 'all' && campaign.status !== selectedStatus) return false;
    return true;
  });

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'Planning': return 'bg-gray-100 text-gray-700';
      case 'Active': return 'bg-blue-100 text-blue-700';
      case 'In Review': return 'bg-orange-100 text-orange-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
    }
  };

  const stats = {
    total: mockCampaigns.length,
    active: mockCampaigns.filter(c => c.status === 'Active').length,
    completed: mockCampaigns.filter(c => c.status === 'Completed').length,
    inReview: mockCampaigns.filter(c => c.status === 'In Review').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <ClipboardCheck size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Risk Assessment Campaigns</h1>
          </div>
          <button
            onClick={() => router.push('/erm/assessments/new')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={18} />
            New Campaign
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Manage risk assessment campaigns throughout their full lifecycle
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Campaigns</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 mb-1 flex items-center gap-1">
            <TrendingUp size={14} />
            Active
          </div>
          <div className="text-2xl font-bold text-blue-700">{stats.active}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm text-orange-700 mb-1 flex items-center gap-1">
            <Clock size={14} />
            In Review
          </div>
          <div className="text-2xl font-bold text-orange-700">{stats.inReview}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1 flex items-center gap-1">
            <CheckCircle2 size={14} />
            Completed
          </div>
          <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--foreground-muted)]">Filter by status:</span>
          {['all', 'Planning', 'Active', 'In Review', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status as any)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                selectedStatus === status
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
              )}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map(campaign => (
          <div
            key={campaign.id}
            onClick={() => router.push(`/erm/assessments/${campaign.id}`)}
            className="bg-white border border-[var(--border)] rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-[var(--primary)]">{campaign.id}</span>
                  <span className={clsx('px-2 py-0.5 text-xs font-medium rounded', getStatusColor(campaign.status))}>
                    {campaign.status}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">
                    {campaign.method}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{campaign.name}</h3>
                <p className="text-sm text-[var(--foreground-muted)] mb-3">{campaign.description}</p>
                <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </span>
                  <span>Owner: {campaign.owner}</span>
                  <span>Scope: {campaign.scope}</span>
                  <span className="font-medium text-[var(--foreground)]">
                    {campaign.completedCount}/{campaign.assessmentCount} assessments
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)] mb-1">
                <span>Campaign Progress</span>
                <span className="font-medium">{campaign.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={clsx(
                    'h-2 rounded-full transition-all',
                    campaign.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                  )}
                  style={{ width: `${campaign.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ClipboardCheck size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-[var(--foreground-muted)]">No campaigns match your filters</p>
        </div>
      )}
    </div>
  );
}
