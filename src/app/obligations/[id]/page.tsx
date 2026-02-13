'use client';

import { useParams, useRouter } from 'next/navigation';
import { obligations } from '@/lib/data/requirements-obligations';
import { PageHeader } from '@/components';
import { Calendar, Clock, AlertTriangle, CheckCircle2, FileText, Building2, User, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { formatDateShort, getDaysBetween, isOverdue } from '@/lib/utils';

export default function ObligationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const obligationId = params.id as string;

  const obligation = obligations.find(o => o.id === obligationId);

  if (!obligation) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Obligation Not Found"
          description="The requested obligation could not be found."
        />
        <div className="bg-white rounded-xl border border-[var(--border)] p-8 text-center">
          <p className="text-[var(--foreground-muted)] mb-4">Obligation ID: {obligationId}</p>
          <button
            onClick={() => router.push('/obligations')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
          >
            Back to Obligations
          </button>
        </div>
      </div>
    );
  }

  const daysUntilDue = getDaysBetween(obligation.nextDueDate);
  const isDueOverdue = isOverdue(obligation.nextDueDate);
  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 7;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="text-p2">Back</span>
      </button>

      {/* Page Header */}
      <PageHeader
        title={obligation.title}
        description={obligation.description}
      />

      {/* Status Banner */}
      <div className={clsx('p-4 rounded-xl border-l-4 flex items-center justify-between',
        obligation.status === 'Completed' && 'bg-emerald-50 border-emerald-500',
        obligation.status === 'Submitted' && 'bg-blue-50 border-blue-500',
        obligation.status === 'In Progress' && 'bg-amber-50 border-amber-500',
        obligation.status === 'Upcoming' && 'bg-gray-50 border-gray-500',
        obligation.status === 'Overdue' && 'bg-red-50 border-red-500'
      )}>
        <div className="flex items-center gap-3">
          {obligation.status === 'Completed' && <CheckCircle2 className="text-emerald-600" size={24} />}
          {obligation.status === 'Overdue' && <AlertTriangle className="text-red-600" size={24} />}
          {obligation.status === 'In Progress' && <Clock className="text-amber-600" size={24} />}
          <div>
            <p className="text-p2 font-semibold text-[var(--foreground)]">Status: {obligation.status}</p>
            <p className="text-p3 text-[var(--foreground-muted)]">
              {isDueOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days until due`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-p3 text-[var(--foreground-muted)]">Due Date</p>
          <p className={clsx('text-p1 font-bold',
            isDueOverdue && 'text-red-600',
            isDueSoon && !isDueOverdue && 'text-amber-600',
            !isDueSoon && !isDueOverdue && 'text-[var(--foreground)]'
          )}>
            {formatDateShort(obligation.nextDueDate)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Details Card */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h2 className="text-h3 font-bold text-[var(--foreground)] mb-4">Obligation Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Code</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">{obligation.code}</p>
              </div>
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Section</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">{obligation.section}</p>
              </div>
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Type</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">{obligation.obligationType}</p>
              </div>
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Frequency</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">{obligation.frequency}</p>
              </div>
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Risk Rating</p>
                <span className={clsx('inline-flex px-2 py-1 rounded-full text-p3 font-medium',
                  obligation.riskRating === 'Critical' && 'bg-red-100 text-red-700',
                  obligation.riskRating === 'High' && 'bg-orange-100 text-orange-700',
                  obligation.riskRating === 'Medium' && 'bg-amber-100 text-amber-700',
                  obligation.riskRating === 'Low' && 'bg-emerald-100 text-emerald-700'
                )}>
                  {obligation.riskRating}
                </span>
              </div>
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Lead Time</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">{obligation.leadTime} days</p>
              </div>
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h2 className="text-h3 font-bold text-[var(--foreground)] mb-4">Submission Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Submission Method</p>
                <p className="text-p2 font-medium text-[var(--foreground)]">{obligation.submissionMethod}</p>
              </div>
              {obligation.recipientContact && (
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-1">Recipient Contact</p>
                  <p className="text-p2 font-medium text-[var(--foreground)]">{obligation.recipientContact}</p>
                </div>
              )}
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-1">Confirmation Required</p>
                  <p className="text-p2 font-medium text-[var(--foreground)]">{obligation.confirmationRequired ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-1">Approval Required</p>
                  <p className="text-p2 font-medium text-[var(--foreground)]">{obligation.approvalRequired ? 'Yes' : 'No'}</p>
                </div>
              </div>
              {obligation.lastSubmissionDate && (
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-1">Last Submission</p>
                  <p className="text-p2 font-medium text-[var(--foreground)]">{formatDateShort(obligation.lastSubmissionDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Evidence Required */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h2 className="text-h3 font-bold text-[var(--foreground)] mb-4">Evidence Required</h2>
            <ul className="space-y-2">
              {obligation.evidenceRequired.map((evidence, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FileText size={16} className="text-[var(--primary)] mt-1 flex-shrink-0" />
                  <span className="text-p2 text-[var(--foreground)]">{evidence}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Program Info */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-h4 font-bold text-[var(--foreground)] mb-4">Program</h3>
            <Link
              href={`/programs/${obligation.programId}`}
              className="flex items-center gap-2 text-[var(--primary)] hover:underline mb-2"
            >
              <Building2 size={16} />
              <span className="text-p2 font-medium">{obligation.programName}</span>
              <ExternalLink size={14} />
            </Link>
            <div className="flex flex-wrap gap-2 mt-3">
              {obligation.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded text-p3">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-h4 font-bold text-[var(--foreground)] mb-4">Ownership</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-[var(--foreground-muted)]" />
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)]">Owner</p>
                  <p className="text-p2 font-medium text-[var(--foreground)]">{obligation.owner}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-[var(--foreground-muted)]" />
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)]">Department</p>
                  <p className="text-p2 font-medium text-[var(--foreground)]">{obligation.department}</p>
                </div>
              </div>
              {obligation.approver && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[var(--foreground-muted)]" />
                  <div>
                    <p className="text-p3 text-[var(--foreground-muted)]">Approver</p>
                    <p className="text-p2 font-medium text-[var(--foreground)]">{obligation.approver}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h3 className="text-h4 font-bold text-[var(--foreground)] mb-4">Timeline</h3>
            <div className="space-y-3">
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Created</p>
                <p className="text-p2 text-[var(--foreground)]">{formatDateShort(obligation.createdAt)}</p>
              </div>
              <div>
                <p className="text-p3 text-[var(--foreground-muted)] mb-1">Last Updated</p>
                <p className="text-p2 text-[var(--foreground)]">{formatDateShort(obligation.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


