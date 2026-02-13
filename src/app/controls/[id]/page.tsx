'use client';

import { use, useState } from 'react';
import { PageHeader, EditControlModal } from '@/components';
import { controls } from '@/lib/data/controls';
import { risks, riskControlLinks } from '@/lib/data/risks';
import { requirements, obligations } from '@/lib/data/requirements-obligations';
import { evidence } from '@/lib/data/evidence';
import { controlTests } from '@/lib/data/control-tests';
import { Shield, Activity, Calendar, User, Building2, FileText, AlertTriangle, Target, TrendingDown, CheckCircle2, Upload, Download, Eye, Clock, CheckCircle, XCircle, PlayCircle, History, ExternalLink, Edit } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function ControlDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const control = controls.find(c => c.id === id);
  
  if (!control) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield size={48} className="mx-auto text-[var(--foreground-muted)] mb-4" />
          <h2 className="text-h2 font-semibold text-[var(--foreground)] mb-2">Control Not Found</h2>
          <p className="text-p2 text-[var(--foreground-muted)]">The control you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Get linked risks
  const linkedRisks = riskControlLinks
    .filter(link => link.controlId === control.id)
    .map(link => {
      const risk = risks.find(r => r.id === link.riskId);
      return risk ? { ...risk, link } : null;
    })
    .filter(Boolean);

  // Get linked requirements
  const linkedRequirements = requirements.filter(req => 
    control.linkedRequirementIds.includes(req.id)
  );

  // Get linked obligations
  const linkedObligations = obligations.filter(obl =>
    control.linkedObligationIds.includes(obl.id)
  );

  // Get linked evidence
  const linkedEvidence = evidence.filter(evd =>
    evd.linkedControlIds.includes(control.id)
  );

  // Get linked tests
  const linkedTests = controlTests.filter(test =>
    test.controlId === control.id
  );

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'Effective': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Partially Effective': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Ineffective': return 'bg-red-100 text-red-700 border-red-200';
      case 'Not Tested': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Preventive': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Detective': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Corrective': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEvidenceStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending Review': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Expired': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Draft': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getValidationStatusColor = (status: string) => {
    switch (status) {
      case 'Sufficient': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Insufficient': return 'bg-red-100 text-red-700 border-red-200';
      case 'Needs Update': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Not Reviewed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Not Started': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Partially Compliant': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Non-Compliant': return 'bg-red-100 text-red-700 border-red-200';
      case 'Not Assessed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const testPassRate = control.testCount > 0
    ? Math.round((control.testsPassed / control.testCount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={control.code}
        description={control.name}
        action={
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-dark)] transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md"
          >
            <Edit size={18} />
            Edit Control
          </button>
        }
      />

      {/* Compliance Status Banner */}
      <div className="animate-fade-in-up delay-1 grid grid-cols-3 gap-4">
        <div className="col-span-2 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield size={24} className="text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-2">Control Description</h3>
              <p className="text-p2 text-[var(--foreground)]">{control.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border-2 border-[var(--border)]">
          <div className="text-center">
            <p className="text-p3 text-[var(--foreground-muted)] font-medium mb-3">Compliance Status</p>
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 border-4 border-emerald-200 mb-2">
                <span className="text-h1 font-bold text-emerald-700">{control.complianceScore}</span>
              </div>
            </div>
            <span className={clsx('inline-flex px-4 py-2 rounded-xl text-p2 font-bold border-2', getComplianceStatusColor(control.complianceStatus))}>
              {control.complianceStatus}
            </span>
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-1">Tests</p>
                  <p className="text-p1 font-bold text-emerald-600">{control.testsPassed}/{control.testCount}</p>
                </div>
                <div>
                  <p className="text-p3 text-[var(--foreground-muted)] mb-1">Evidence</p>
                  <p className="text-p1 font-bold text-blue-600">{linkedEvidence.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-6 gap-4 animate-fade-in-up delay-2">
        <div className="p-5 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-[var(--foreground-muted)]" />
            <p className="text-p3 text-[var(--foreground-muted)] font-medium">Category</p>
          </div>
          <p className="text-p2 font-semibold text-[var(--foreground)]">{control.category}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-[var(--foreground-muted)]" />
            <p className="text-p3 text-[var(--foreground-muted)] font-medium">Owner</p>
          </div>
          <p className="text-p2 font-semibold text-[var(--foreground)]">{control.owner}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={16} className="text-[var(--foreground-muted)]" />
            <p className="text-p3 text-[var(--foreground-muted)] font-medium">Department</p>
          </div>
          <p className="text-p2 font-semibold text-[var(--foreground)]">{control.department}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-[var(--foreground-muted)]" />
            <p className="text-p3 text-[var(--foreground-muted)] font-medium">Frequency</p>
          </div>
          <p className="text-p2 font-semibold text-[var(--foreground)]">{control.frequency}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-[var(--foreground-muted)]" />
            <p className="text-p3 text-[var(--foreground-muted)] font-medium">Last Test</p>
          </div>
          <p className="text-p2 font-semibold text-[var(--foreground)]">{control.lastTestDate}</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-[var(--foreground-muted)]" />
            <p className="text-p3 text-[var(--foreground-muted)] font-medium">Next Test</p>
          </div>
          <p className="text-p2 font-semibold text-[var(--foreground)]">{control.nextTestDate}</p>
        </div>
      </div>

      {/* Control Attributes */}
      <div className="grid grid-cols-3 gap-6 animate-fade-in-up delay-3">
        {/* Type */}
        <div className="p-6 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-blue-500" />
            <h3 className="text-h3 font-semibold text-[var(--foreground)]">Control Type</h3>
          </div>
          <div className="flex items-center justify-center mb-4">
            <span className={clsx('inline-flex items-center gap-2 px-4 py-2 rounded-xl text-p1 font-bold border-2', getTypeColor(control.type))}>
              {control.type}
            </span>
          </div>
          <p className="text-p3 text-center text-[var(--foreground-muted)]">
            {control.type === 'Preventive' && 'Prevents incidents before they occur'}
            {control.type === 'Detective' && 'Detects incidents as they occur'}
            {control.type === 'Corrective' && 'Corrects incidents after they occur'}
          </p>
        </div>

        {/* Effectiveness */}
        <div className="p-6 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={20} className="text-emerald-500" />
            <h3 className="text-h3 font-semibold text-[var(--foreground)]">Effectiveness</h3>
          </div>
          <div className="flex items-center justify-center mb-4">
            <span className={clsx('inline-flex items-center gap-2 px-4 py-2 rounded-xl text-p1 font-bold border-2', getEffectivenessColor(control.effectiveness))}>
              {control.effectiveness}
            </span>
          </div>
          <div className="text-center">
            <p className="text-p3 text-[var(--foreground-muted)] mb-1">Test Pass Rate</p>
            <p className="text-h3 font-bold text-[var(--foreground)]">{testPassRate}%</p>
            <p className="text-p3 text-[var(--foreground-muted)]">({control.testsPassed}/{control.testCount} tests passed)</p>
          </div>
        </div>

        {/* Automation */}
        <div className="p-6 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={20} className="text-purple-500" />
            <h3 className="text-h3 font-semibold text-[var(--foreground)]">Automation Level</h3>
          </div>
          <div className="flex items-center justify-center mb-4">
            <span className={clsx('inline-flex items-center gap-2 px-4 py-2 rounded-xl text-p1 font-bold border-2',
              control.automationLevel === 'Fully Automated' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
              control.automationLevel === 'Semi-Automated' ? 'bg-amber-100 text-amber-700 border-amber-200' :
              'bg-gray-100 text-gray-700 border-gray-200'
            )}>
              {control.automationLevel}
            </span>
          </div>
          <p className="text-p3 text-center text-[var(--foreground-muted)]">
            {control.automationLevel === 'Fully Automated' && 'Fully automated execution'}
            {control.automationLevel === 'Semi-Automated' && 'Partially automated with manual steps'}
            {control.automationLevel === 'Manual' && 'Requires manual execution'}
          </p>
        </div>
      </div>

      {/* Evidence Section */}
      <div className="animate-fade-in-up delay-4 p-6 rounded-xl bg-white border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-4">
          <Upload size={20} className="text-blue-500" />
          <h3 className="text-h3 font-semibold text-[var(--foreground)]">Evidence</h3>
          <span className="ml-auto px-3 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-full text-p3 font-medium">
            {linkedEvidence.length} {linkedEvidence.length === 1 ? 'Document' : 'Documents'}
          </span>
          <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-all text-p3 font-medium">
            <Upload size={16} className="inline mr-2" />
            Upload Evidence
          </button>
        </div>

        {linkedEvidence.length === 0 ? (
          <div className="text-center py-12 bg-[var(--background-secondary)] rounded-lg">
            <Upload size={48} className="mx-auto text-[var(--foreground-muted)] mb-3" />
            <p className="text-p2 text-[var(--foreground-muted)] mb-2">No evidence uploaded yet</p>
            <p className="text-p3 text-[var(--foreground-muted)]">Upload documents to demonstrate control effectiveness</p>
          </div>
        ) : (
          <div className="space-y-3">
            {linkedEvidence.map((evd) => (
              <div
                key={evd.id}
                className="p-4 rounded-lg border border-[var(--border)] hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={18} className="text-blue-600" />
                      <span className="text-p2 font-semibold text-[var(--foreground)]">{evd.code}</span>
                      <span className={clsx('px-2 py-0.5 rounded-full text-p3 font-medium border', getEvidenceStatusColor(evd.status))}>
                        {evd.status}
                      </span>
                      <span className={clsx('px-2 py-0.5 rounded-full text-p3 font-medium border', getValidationStatusColor(evd.validationStatus))}>
                        {evd.validationStatus}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-p3 font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        v{evd.version}
                      </span>
                    </div>
                    <p className="text-p2 font-medium text-[var(--foreground)] mb-1">{evd.name}</p>
                    <p className="text-p3 text-[var(--foreground-muted)] mb-3">{evd.description}</p>

                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div className="p-3 bg-[var(--background-secondary)] rounded-lg">
                        <p className="text-p3 text-[var(--foreground-muted)] mb-1">File</p>
                        <p className="text-p3 font-semibold text-[var(--foreground)] truncate">{evd.fileName}</p>
                      </div>
                      <div className="p-3 bg-[var(--background-secondary)] rounded-lg">
                        <p className="text-p3 text-[var(--foreground-muted)] mb-1">Size</p>
                        <p className="text-p3 font-semibold text-[var(--foreground)]">{formatFileSize(evd.fileSize)}</p>
                      </div>
                      <div className="p-3 bg-[var(--background-secondary)] rounded-lg">
                        <p className="text-p3 text-[var(--foreground-muted)] mb-1">Uploaded</p>
                        <p className="text-p3 font-semibold text-[var(--foreground)]">{evd.uploadedAt}</p>
                      </div>
                      <div className="p-3 bg-[var(--background-secondary)] rounded-lg">
                        <p className="text-p3 text-[var(--foreground-muted)] mb-1">Expires</p>
                        <p className="text-p3 font-semibold text-[var(--foreground)]">{evd.expiresAt || 'Never'}</p>
                      </div>
                    </div>

                    {evd.versionHistory.length > 1 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <History size={16} className="text-blue-600" />
                          <p className="text-p3 font-semibold text-blue-900">Version History ({evd.versionHistory.length} versions)</p>
                        </div>
                        <div className="space-y-2">
                          {evd.versionHistory.slice(0, 3).map((version) => (
                            <div key={version.version} className="flex items-center justify-between text-p3 text-blue-800">
                              <span>v{version.version} - {version.fileName}</span>
                              <span className="text-blue-600">{version.uploadedAt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all text-p3 font-medium">
                      <Eye size={16} className="inline mr-1" />
                      View
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-p3 font-medium">
                      <Download size={16} className="inline mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Control Testing Section */}
      <div className="animate-fade-in-up delay-5 p-6 rounded-xl bg-white border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-4">
          <PlayCircle size={20} className="text-purple-500" />
          <h3 className="text-h3 font-semibold text-[var(--foreground)]">Control Testing</h3>
          <span className="ml-auto px-3 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-full text-p3 font-medium">
            {linkedTests.length} {linkedTests.length === 1 ? 'Test' : 'Tests'}
          </span>
          <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-all text-p3 font-medium">
            <PlayCircle size={16} className="inline mr-2" />
            New Test
          </button>
        </div>

        {linkedTests.length === 0 ? (
          <div className="text-center py-12 bg-[var(--background-secondary)] rounded-lg">
            <PlayCircle size={48} className="mx-auto text-[var(--foreground-muted)] mb-3" />
            <p className="text-p2 text-[var(--foreground-muted)] mb-2">No tests configured yet</p>
            <p className="text-p3 text-[var(--foreground-muted)]">Create tests to verify control effectiveness</p>
          </div>
        ) : (
          <div className="space-y-3">
            {linkedTests.map((test) => (
              <div
                key={test.id}
                className="p-4 rounded-lg border border-[var(--border)] hover:border-purple-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-p2 font-semibold text-purple-600">{test.code}</span>
                      <span className={clsx('px-2 py-0.5 rounded-full text-p3 font-medium border', getTestStatusColor(test.status))}>
                        {test.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-p3 font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        {test.type}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-p3 font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {test.frequency}
                      </span>
                    </div>
                    <p className="text-p2 font-medium text-[var(--foreground)] mb-1">{test.name}</p>
                    <p className="text-p3 text-[var(--foreground-muted)] mb-3">{test.description}</p>

                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div className="p-3 bg-[var(--background-secondary)] rounded-lg">
                        <p className="text-p3 text-[var(--foreground-muted)] mb-1">Tester</p>
                        <p className="text-p3 font-semibold text-[var(--foreground)]">{test.tester}</p>
                      </div>
                      <div className="p-3 bg-[var(--background-secondary)] rounded-lg">
                        <p className="text-p3 text-[var(--foreground-muted)] mb-1">Scheduled</p>
                        <p className="text-p3 font-semibold text-[var(--foreground)]">{test.scheduledDate}</p>
                      </div>
                      <div className="p-3 bg-[var(--background-secondary)] rounded-lg">
                        <p className="text-p3 text-[var(--foreground-muted)] mb-1">Executed</p>
                        <p className="text-p3 font-semibold text-[var(--foreground)]">{test.executedDate || 'Not yet'}</p>
                      </div>
                      <div className="p-3 bg-[var(--background-secondary)] rounded-lg">
                        <p className="text-p3 text-[var(--foreground-muted)] mb-1">Due Date</p>
                        <p className="text-p3 font-semibold text-[var(--foreground)]">{test.dueDate}</p>
                      </div>
                    </div>

                    {test.result && (
                      <div className={clsx('p-3 rounded-lg border mb-3',
                        test.result === 'Pass' ? 'bg-emerald-50 border-emerald-200' :
                        test.result === 'Fail' ? 'bg-red-50 border-red-200' :
                        'bg-amber-50 border-amber-200'
                      )}>
                        <p className="text-p3 font-semibold mb-1" style={{ color: test.result === 'Pass' ? '#047857' : test.result === 'Fail' ? '#b91c1c' : '#b45309' }}>
                          Test Result: {test.result}
                        </p>
                        <p className="text-p3" style={{ color: test.result === 'Pass' ? '#065f46' : test.result === 'Fail' ? '#991b1b' : '#92400e' }}>
                          {test.actualResult}
                        </p>
                        {test.findings && (
                          <p className="text-p3 mt-2 italic" style={{ color: test.result === 'Pass' ? '#065f46' : test.result === 'Fail' ? '#991b1b' : '#92400e' }}>
                            Findings: {test.findings}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all text-p3 font-medium whitespace-nowrap">
                      <Eye size={16} className="inline mr-1" />
                      View Details
                    </button>
                    {test.status === 'Not Started' && (
                      <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all text-p3 font-medium whitespace-nowrap">
                        <PlayCircle size={16} className="inline mr-1" />
                        Execute Test
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mitigated Risks */}
      {linkedRisks.length > 0 && (
        <div className="animate-fade-in-up delay-4 p-6 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-red-500" />
            <h3 className="text-h3 font-semibold text-[var(--foreground)]">Mitigated Risks</h3>
            <span className="ml-auto px-3 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-full text-p3 font-medium">
              {linkedRisks.length} {linkedRisks.length === 1 ? 'Risk' : 'Risks'}
            </span>
          </div>

          <div className="space-y-3">
            {linkedRisks.map((item: any) => {
              const risk = item;
              const link = item.link;

              return (
                <Link
                  key={risk.id}
                  href={`/risks/${risk.id}`}
                  className="block p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-p2 font-semibold text-[var(--primary)]">{risk.code}</span>
                        <span className={clsx('px-2 py-0.5 rounded-full text-p3 font-medium border', getRatingColor(risk.residualRating))}>
                          {risk.residualRating}
                        </span>
                        {link.isKeyControl && (
                          <span className="px-2 py-0.5 rounded-full text-p3 font-medium bg-purple-100 text-purple-700 border border-purple-200">
                            Key Control
                          </span>
                        )}
                      </div>
                      <p className="text-p2 font-medium text-[var(--foreground)] mb-1">{risk.title}</p>
                      <p className="text-p3 text-[var(--foreground-muted)] mb-3">{risk.riskStatement}</p>

                      {link.notes && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                          <p className="text-p3 text-blue-900">
                            <span className="font-semibold">How this control helps: </span>
                            {link.notes}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-[var(--background-secondary)] rounded-lg">
                          <p className="text-p3 text-[var(--foreground-muted)] mb-1">Control Effectiveness</p>
                          <p className="text-p2 font-semibold text-[var(--foreground)]">{link.controlEffectiveness}</p>
                        </div>
                        {link.likelihoodReduction !== undefined && (
                          <div className="p-3 bg-[var(--background-secondary)] rounded-lg">
                            <p className="text-p3 text-[var(--foreground-muted)] mb-1">Likelihood Reduction</p>
                            <p className="text-p2 font-semibold text-emerald-600">-{link.likelihoodReduction} points</p>
                          </div>
                        )}
                        {link.impactReduction !== undefined && (
                          <div className="p-3 bg-[var(--background-secondary)] rounded-lg">
                            <p className="text-p3 text-[var(--foreground-muted)] mb-1">Impact Reduction</p>
                            <p className="text-p2 font-semibold text-emerald-600">-{link.impactReduction} points</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-p3 text-[var(--foreground-muted)]">Risk Reduction</p>
                        <p className="text-h3 font-bold text-emerald-600">{risk.riskReduction}%</p>
                      </div>
                      <div className="flex items-center gap-2 text-p3 text-[var(--foreground-muted)]">
                        <TrendingDown size={16} className="text-emerald-500" />
                        <span>{risk.inherentScore} → {risk.residualScore}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Linked Requirements */}
      {linkedRequirements.length > 0 && (
        <div className="animate-fade-in-up delay-5 p-6 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-blue-500" />
            <h3 className="text-h3 font-semibold text-[var(--foreground)]">Linked Requirements</h3>
            <span className="ml-auto px-3 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-full text-p3 font-medium">
              {linkedRequirements.length} {linkedRequirements.length === 1 ? 'Requirement' : 'Requirements'}
            </span>
          </div>

          <div className="space-y-3">
            {linkedRequirements.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-lg border border-[var(--border)] hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-p2 font-semibold text-blue-600">{req.code}</span>
                      <span className={clsx('px-2 py-0.5 rounded-full text-p3 font-medium border',
                        req.status === 'Compliant' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        req.status === 'Partially Compliant' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      )}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-p2 font-medium text-[var(--foreground)] mb-1">{req.title}</p>
                    <p className="text-p3 text-[var(--foreground-muted)] mb-2">{req.description}</p>
                    <div className="flex items-center gap-4 text-p3 text-[var(--foreground-muted)]">
                      <span>{req.programName}</span>
                      <span>•</span>
                      <span>{req.section}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-p3 text-[var(--foreground-muted)]">Compliance</p>
                    <p className="text-h3 font-bold text-emerald-600">{req.complianceScore}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linked Obligations */}
      {linkedObligations.length > 0 && (
        <div className="animate-fade-in-up delay-6 p-6 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-orange-500" />
            <h3 className="text-h3 font-semibold text-[var(--foreground)]">Linked Obligations</h3>
            <span className="ml-auto px-3 py-1 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-full text-p3 font-medium">
              {linkedObligations.length} {linkedObligations.length === 1 ? 'Obligation' : 'Obligations'}
            </span>
          </div>

          <div className="space-y-3">
            {linkedObligations.map((obl) => (
              <div
                key={obl.id}
                className="p-4 rounded-lg border border-[var(--border)] hover:border-orange-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-p2 font-semibold text-orange-600">{obl.code}</span>
                      <span className={clsx('px-2 py-0.5 rounded-full text-p3 font-medium border',
                        obl.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        obl.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        obl.status === 'Upcoming' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      )}>
                        {obl.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-p3 font-medium bg-purple-100 text-purple-700 border border-purple-200">
                        {obl.obligationType}
                      </span>
                    </div>
                    <p className="text-p2 font-medium text-[var(--foreground)] mb-1">{obl.title}</p>
                    <p className="text-p3 text-[var(--foreground-muted)] mb-2">{obl.description}</p>
                    <div className="flex items-center gap-4 text-p3 text-[var(--foreground-muted)]">
                      <span>{obl.programName}</span>
                      <span>•</span>
                      <span>{obl.section}</span>
                      <span>•</span>
                      <span>Due: {obl.nextDueDate || obl.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Control Modal */}
      <EditControlModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        control={control}
        onSave={(updatedControl) => {
          console.log('Updated control:', updatedControl);
          setShowEditModal(false);
        }}
      />
    </div>
  );
}

