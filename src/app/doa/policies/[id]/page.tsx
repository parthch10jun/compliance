'use client';

/**
 * Policy Detail Page
 * Comprehensive policy management view with all BR-POL features
 */

import { useState, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Download, FileText, Clock, Users, GitCompare,
  CheckCircle, AlertTriangle, Calendar, Shield
} from 'lucide-react';
import { mockDoAPolicies } from '@/lib/doa/data/mockPolicies';
import PolicyStateMachine from '@/components/doa/policy/PolicyStateMachine';
import PolicyApprovalWorkflow from '@/components/doa/policy/PolicyApprovalWorkflow';
import PolicyDiffViewer from '@/components/doa/policy/PolicyDiffViewer';

export default function PolicyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'diff' | 'audit'>('overview');
  
  const policy = mockDoAPolicies.find(p => p.metadata.policyId === id);
  
  if (!policy) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Policy Not Found</h2>
          <p className="text-gray-600 mb-4">The requested policy could not be found.</p>
          <Link href="/doa/policies" className="text-[#F59E0B] hover:text-amber-700">
            ← Back to Policies
          </Link>
        </div>
      </div>
    );
  }
  
  const latestVersion = policy.metadata.versionHistory[policy.metadata.versionHistory.length - 1];
  const previousVersion = policy.metadata.versionHistory.length > 1 
    ? policy.metadata.versionHistory[policy.metadata.versionHistory.length - 2]
    : null;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/doa/policies" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-gray-900">{policy.metadata.title}</h1>
            {policy.metadata.isHotfix && (
              <span className="px-3 py-1 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm font-semibold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                HOTFIX
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="font-mono">{policy.metadata.policyNumber}</span>
            <span>•</span>
            <span>Version {policy.metadata.version}</span>
            <span>•</span>
            <span>{policy.metadata.department}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {policy.pdfArtifacts.length > 0 && (
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          )}
        </div>
      </div>
      
      {/* Policy Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Effective Date</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {new Date(policy.metadata.effectiveDate).toLocaleDateString()}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Policy Owner</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">{policy.metadata.owner}</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Version History</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {policy.metadata.versionHistory.length} version{policy.metadata.versionHistory.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Approvals</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {policy.approvalWorkflow 
              ? `${policy.approvalWorkflow.requiredApprovers.filter(a => a.status === 'approved').length}/${policy.approvalWorkflow.requiredApprovers.length}`
              : 'N/A'}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {[
            { id: 'overview', label: 'Overview & State', icon: FileText },
            { id: 'workflow', label: 'Approval Workflow', icon: Users },
            { id: 'diff', label: 'Version Comparison', icon: GitCompare },
            { id: 'audit', label: 'Audit Trail', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#F59E0B] text-[#F59E0B]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Policy Metadata */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Description</div>
                  <div className="text-sm text-gray-900">{policy.metadata.description}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Author</div>
                  <div className="text-sm text-gray-900">
                    {policy.metadata.author} ({policy.metadata.authorEmail})
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Change Rationale</div>
                  <div className="text-sm text-gray-900">{policy.metadata.changeRationale}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Business Justification</div>
                  <div className="text-sm text-gray-900">{policy.metadata.businessJustification}</div>
                </div>

                {policy.metadata.endDate && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">End Date</div>
                    <div className="text-sm text-gray-900">
                      {new Date(policy.metadata.endDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Hotfix Warning */}
              {policy.hotfix && (
                <div className="mt-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-red-900 mb-2">Emergency Hotfix Policy</div>
                      <div className="space-y-2 text-sm text-red-800">
                        <div><strong>Reason:</strong> {policy.hotfix.hotfixReason}</div>
                        <div><strong>Requested By:</strong> {policy.hotfix.hotfixRequestedBy}</div>
                        <div><strong>Approved By:</strong> {policy.hotfix.hotfixApprovedBy}</div>
                        <div><strong>Expires:</strong> {new Date(policy.hotfix.hotfixExpiryDate).toLocaleDateString()}</div>
                        {policy.hotfix.permanentReplacementDue && (
                          <div className="mt-3 p-3 bg-white border border-red-200 rounded">
                            <strong>⚠️ Action Required:</strong> Permanent replacement policy due by{' '}
                            {new Date(policy.hotfix.permanentReplacementDue).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* State Machine */}
            <PolicyStateMachine policy={policy} />

            {/* PDF Artifacts */}
            {policy.pdfArtifacts.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Signed PDF Artifacts</h3>

                <div className="space-y-3">
                  {policy.pdfArtifacts.map((pdf, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <FileText className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900 mb-1">
                              {pdf.metadata.title}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span>Version {pdf.version}</span>
                              <span>•</span>
                              <span>{(pdf.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                              <span>•</span>
                              <span>{new Date(pdf.generatedDate).toLocaleDateString()}</span>
                            </div>

                            {/* Digital Signatures */}
                            <div className="flex items-center gap-2 flex-wrap mt-2">
                              {pdf.digitalSignatures.map((sig, sigIndex) => (
                                <div
                                  key={sigIndex}
                                  className="flex items-center gap-1 px-2 py-1 bg-green-100 border border-green-300 rounded text-xs text-green-700"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  <span>{sig.signer}</span>
                                </div>
                              ))}
                            </div>

                            {/* Watermark */}
                            {pdf.watermark && (
                              <div className="mt-2 text-xs text-gray-500 font-mono">
                                Watermark: {pdf.watermark}
                              </div>
                            )}
                          </div>
                        </div>

                        <button className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'workflow' && policy.approvalWorkflow && (
          <PolicyApprovalWorkflow
            workflow={policy.approvalWorkflow}
            currentUserRole="compliance"
          />
        )}

        {activeTab === 'diff' && previousVersion && (
          <div>
            <PolicyDiffViewer
              versionA={previousVersion}
              versionB={latestVersion}
            />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>

            <div className="space-y-3">
              {policy.auditTrail.map((entry, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-900">{entry.action}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.performedDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      Performed by: {entry.performedBy}
                    </div>
                    <div className="text-sm text-gray-600">{entry.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
