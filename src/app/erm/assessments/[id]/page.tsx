'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ClipboardCheck, Plus, Calendar, User, Building2, Edit, Trash2, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import clsx from 'clsx';
import { mockCampaigns, mockAssessments, getCampaignAssessments, type Campaign, type Assessment } from '@/lib/data/assessments';

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  
  const campaign = mockCampaigns.find(c => c.id === campaignId);
  const assessments = getCampaignAssessments(campaignId);
  
  if (!campaign) {
    return (
      <div>
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold mb-2">Campaign Not Found</h2>
          <p className="text-[var(--foreground-muted)] mb-4">The assessment campaign you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/erm/assessments')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'Planning': return 'bg-gray-100 text-gray-700';
      case 'Active': return 'bg-blue-100 text-blue-700';
      case 'In Review': return 'bg-orange-100 text-orange-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
    }
  };

  const getAssessmentStatusColor = (status: Assessment['status']) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'In Review': return 'bg-orange-100 text-orange-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/assessments')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Campaigns
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <ClipboardCheck size={24} className="text-[var(--primary)]" />
              <h1 className="text-h2 font-bold text-[var(--foreground)]">{campaign.id}</h1>
              <span className={clsx('px-3 py-1 text-sm font-medium rounded-full', getStatusColor(campaign.status))}>
                {campaign.status}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">{campaign.name}</h2>
            <p className="text-p1 text-[var(--foreground-muted)] mb-4">{campaign.description}</p>
            <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
              <span className="flex items-center gap-1">
                <User size={14} />
                {campaign.owner}
              </span>
              <span className="flex items-center gap-1">
                <Building2 size={14} />
                {campaign.scope}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium">
              <Plus size={18} />
              Add Assessment
            </button>
            <button className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium">
              <Edit size={18} />
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Assessments</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{campaign.assessmentCount}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1 flex items-center gap-1">
            <CheckCircle2 size={14} />
            Completed
          </div>
          <div className="text-2xl font-bold text-green-700">{campaign.completedCount}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 mb-1">Progress</div>
          <div className="text-2xl font-bold text-blue-700">{campaign.progress}%</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-700 mb-1">Method</div>
          <div className="text-lg font-bold text-purple-700">{campaign.method}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Campaign Progress</h2>
        <div className="mb-2">
          <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)] mb-1">
            <span>Assessments Completed: {campaign.completedCount}/{campaign.assessmentCount}</span>
            <span className="font-medium">{campaign.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={clsx(
                'h-3 rounded-full transition-all',
                campaign.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
              )}
              style={{ width: `${campaign.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Assessments Table */}
      <div className="bg-white border border-[var(--border)] rounded-lg">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Risk Assessments ({assessments.length})</h2>
        </div>

        {assessments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Likelihood</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Consequence</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Risk Score</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Assessor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {assessments.map(assessment => (
                  <tr
                    key={assessment.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/erm/risk-register/${assessment.riskId}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[var(--primary)]">{assessment.riskId}</div>
                      <div className="text-xs text-[var(--foreground-muted)] mt-1">{assessment.riskTitle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        'px-2 py-1 text-xs font-medium rounded',
                        assessment.type === 'Inherent' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      )}>
                        {assessment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-700">
                          {assessment.likelihood}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-700">
                          {assessment.consequence}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">{assessment.riskScore}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx('px-2 py-1 text-xs font-medium rounded', getRatingColor(assessment.riskRating))}>
                        {assessment.riskRating}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx('px-2 py-1 text-xs font-medium rounded', getAssessmentStatusColor(assessment.status))}>
                        {assessment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--foreground-muted)]">{assessment.assessor}</td>
                    <td className="px-6 py-4 text-sm text-[var(--foreground-muted)]">
                      {new Date(assessment.assessmentDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <ClipboardCheck size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-[var(--foreground-muted)]">No assessments in this campaign yet</p>
            <button className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]">
              Add First Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
