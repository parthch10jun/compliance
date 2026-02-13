'use client';

import { CheckCircle2, XCircle, Clock, Upload, FileCheck, PlayCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface WorkflowEvent {
  id: string;
  type: 'test_scheduled' | 'test_executed' | 'evidence_uploaded' | 'evidence_reviewed' | 'evidence_approved' | 'evidence_rejected';
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'pending' | 'info';
  metadata?: {
    testCode?: string;
    evidenceCode?: string;
    result?: string;
    decision?: string;
  };
}

interface ControlWorkflowTimelineProps {
  controlCode: string;
  controlName: string;
  events: WorkflowEvent[];
}

export function ControlWorkflowTimeline({ controlCode, controlName, events }: ControlWorkflowTimelineProps) {
  const getIcon = (type: string, status: string) => {
    switch (type) {
      case 'test_scheduled':
        return <Clock size={20} className="text-blue-600" />;
      case 'test_executed':
        return status === 'success' ? <CheckCircle2 size={20} className="text-emerald-600" /> : <XCircle size={20} className="text-red-600" />;
      case 'evidence_uploaded':
        return <Upload size={20} className="text-violet-600" />;
      case 'evidence_reviewed':
        return <FileCheck size={20} className="text-amber-600" />;
      case 'evidence_approved':
        return <CheckCircle2 size={20} className="text-emerald-600" />;
      case 'evidence_rejected':
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <AlertCircle size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-100 border-emerald-300 text-emerald-700';
      case 'warning':
        return 'bg-amber-100 border-amber-300 text-amber-700';
      case 'error':
        return 'bg-red-100 border-red-300 text-red-700';
      case 'pending':
        return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'info':
        return 'bg-violet-100 border-violet-300 text-violet-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getLineColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-300';
      case 'warning':
        return 'bg-amber-300';
      case 'error':
        return 'bg-red-300';
      case 'pending':
        return 'bg-blue-300';
      case 'info':
        return 'bg-violet-300';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="p-6 rounded-xl bg-white border border-[var(--border)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <PlayCircle size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-h3 font-bold text-[var(--foreground)]">Workflow Timeline</h3>
          <p className="text-p3 text-[var(--foreground-muted)]">{controlCode} - {controlName}</p>
        </div>
        <span className="ml-auto px-3 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-full text-p3 font-medium">
          {events.length} {events.length === 1 ? 'Event' : 'Events'}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-[var(--background-secondary)] rounded-lg">
          <Clock size={48} className="mx-auto text-[var(--foreground-muted)] mb-3" />
          <p className="text-p2 text-[var(--foreground-muted)] mb-2">No workflow events yet</p>
          <p className="text-p3 text-[var(--foreground-muted)]">Events will appear here as tests are executed and evidence is uploaded</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Events */}
          <div className="space-y-6">
            {events.map((event, index) => (
              <div key={event.id} className="relative pl-14">
                {/* Icon */}
                <div className={clsx(
                  'absolute left-0 w-10 h-10 rounded-full border-2 flex items-center justify-center',
                  getStatusColor(event.status)
                )}>
                  {getIcon(event.type, event.status)}
                </div>

                {/* Connecting line */}
                {index < events.length - 1 && (
                  <div className={clsx('absolute left-5 top-10 w-0.5 h-6', getLineColor(event.status))} />
                )}

                {/* Content */}
                <div className={clsx(
                  'p-4 rounded-lg border-2 transition-all hover:shadow-md',
                  getStatusColor(event.status)
                )}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                      <p className="text-xs opacity-90">{event.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{event.actor}</p>
                      <p className="text-xs opacity-75">{event.timestamp}</p>
                    </div>
                  </div>

                  {/* Metadata */}
                  {event.metadata && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-current opacity-50">
                      {event.metadata.testCode && (
                        <span className="px-2 py-1 bg-white/50 rounded text-xs font-mono">
                          {event.metadata.testCode}
                        </span>
                      )}
                      {event.metadata.evidenceCode && (
                        <span className="px-2 py-1 bg-white/50 rounded text-xs font-mono">
                          {event.metadata.evidenceCode}
                        </span>
                      )}
                      {event.metadata.result && (
                        <span className="px-2 py-1 bg-white/50 rounded text-xs font-semibold">
                          Result: {event.metadata.result}
                        </span>
                      )}
                      {event.metadata.decision && (
                        <span className="px-2 py-1 bg-white/50 rounded text-xs font-semibold">
                          Decision: {event.metadata.decision}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

