'use client';

/**
 * Policy Approval Workflow Component
 * Implements BR-POL-03 - Multi-approver review with electronic sign-off
 */

import { useState } from 'react';
import { 
  CheckCircle, XCircle, Clock, Shield, Scale, Briefcase, 
  User, FileSignature, MessageSquare, AlertCircle 
} from 'lucide-react';
import type { PolicyApprovalWorkflow, PolicyApprover } from '@/lib/doa/types/policy-types';

interface PolicyApprovalWorkflowProps {
  workflow: PolicyApprovalWorkflow;
  onApprove?: (approverId: string, comments: string) => void;
  onReject?: (approverId: string, reason: string) => void;
  currentUserRole?: PolicyApprover['role'];
}

export default function PolicyApprovalWorkflowComponent({ 
  workflow, 
  onApprove, 
  onReject,
  currentUserRole 
}: PolicyApprovalWorkflowProps) {
  const [selectedApprover, setSelectedApprover] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [showSignDialog, setShowSignDialog] = useState(false);
  
  const getRoleIcon = (role: PolicyApprover['role']) => {
    switch (role) {
      case 'compliance': return Shield;
      case 'risk': return AlertCircle;
      case 'legal': return Scale;
      case 'function_head': return Briefcase;
      case 'ceo':
      case 'cfo': return User;
      default: return User;
    }
  };
  
  const getRoleLabel = (role: PolicyApprover['role']): string => {
    const labels: Record<PolicyApprover['role'], string> = {
      compliance: 'Chief Compliance Officer',
      risk: 'Chief Risk Officer',
      legal: 'General Counsel',
      function_head: 'Function Head',
      ceo: 'Chief Executive Officer',
      cfo: 'Chief Financial Officer',
    };
    return labels[role];
  };
  
  const getStatusColor = (status: PolicyApprover['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const handleApprove = (approver: PolicyApprover) => {
    if (!comments.trim()) {
      alert('Please provide comments for your approval');
      return;
    }
    onApprove?.(approver.role, comments);
    setShowSignDialog(false);
    setSelectedApprover(null);
    setComments('');
  };
  
  const handleReject = (approver: PolicyApprover) => {
    if (!comments.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    onReject?.(approver.role, comments);
    setShowSignDialog(false);
    setSelectedApprover(null);
    setComments('');
  };
  
  const canUserApprove = (approver: PolicyApprover): boolean => {
    return approver.status === 'pending' && 
           currentUserRole === approver.role;
  };
  
  const approvedCount = workflow.requiredApprovers.filter(a => a.status === 'approved').length;
  const totalRequired = workflow.requiredApprovers.filter(a => a.required).length;
  const isFullyApproved = workflow.status === 'approved';
  
  return (
    <div className="space-y-6">
      {/* Workflow Status */}
      <div className={`p-4 rounded-lg border-2 ${
        isFullyApproved ? 'bg-green-50 border-green-300' :
        workflow.status === 'rejected' ? 'bg-red-50 border-red-300' :
        'bg-blue-50 border-blue-300'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isFullyApproved ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : workflow.status === 'rejected' ? (
              <XCircle className="w-6 h-6 text-red-600" />
            ) : (
              <Clock className="w-6 h-6 text-blue-600" />
            )}
            <div>
              <div className="text-sm font-medium text-gray-700">Approval Status</div>
              <div className="text-lg font-bold text-gray-900">
                {approvedCount} of {totalRequired} Approvers Signed
              </div>
            </div>
          </div>
          
          {workflow.completedDate && (
            <div className="text-sm text-gray-600">
              Completed: {new Date(workflow.completedDate).toLocaleDateString()}
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 bg-white rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              isFullyApproved ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${(approvedCount / totalRequired) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Approvers List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Approvers</h3>
        
        <div className="space-y-3">
          {workflow.requiredApprovers.map((approver, index) => {
            const Icon = getRoleIcon(approver.role);
            const canApprove = canUserApprove(approver);
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  approver.status === 'approved' ? 'border-green-300 bg-green-50' :
                  approver.status === 'rejected' ? 'border-red-300 bg-red-50' :
                  canApprove ? 'border-amber-300 bg-amber-50' :
                  'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Role Icon */}
                    <div className={`p-2 rounded-lg ${
                      approver.status === 'approved' ? 'bg-green-100' :
                      approver.status === 'rejected' ? 'bg-red-100' :
                      'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        approver.status === 'approved' ? 'text-green-600' :
                        approver.status === 'rejected' ? 'text-red-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    
                    {/* Approver Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{approver.name}</span>
                        {approver.required && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            Required
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">{getRoleLabel(approver.role)}</div>
                      
                      {/* Status Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          getStatusColor(approver.status)
                        }`}>
                          {approver.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                          {approver.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {approver.status === 'pending' && <Clock className="w-3 h-3" />}
                          {approver.status.charAt(0).toUpperCase() + approver.status.slice(1)}
                        </span>
                        
                        {approver.signedDate && (
                          <span className="text-xs text-gray-500">
                            {new Date(approver.signedDate).toLocaleString()}
                          </span>
                        )}
                      </div>
                      
                      {/* Comments */}
                      {approver.comments && (
                        <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-700">{approver.comments}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Digital Signature */}
                      {approver.signature && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <FileSignature className="w-4 h-4" />
                          <span className="font-mono">{approver.signature.substring(0, 20)}...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  {canApprove && (
                    <button
                      onClick={() => {
                        setSelectedApprover(approver.role);
                        setShowSignDialog(true);
                      }}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm"
                    >
                      Review & Sign
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sign-Off Dialog */}
      {showSignDialog && selectedApprover && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSignDialog(false)}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Electronic Sign-Off</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Review and provide your approval or rejection
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* Approver Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Signing as:</div>
                  <div className="font-semibold text-gray-900">
                    {getRoleLabel(selectedApprover as PolicyApprover['role'])}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments / Reason <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                    placeholder="Provide your comments or approval rationale..."
                  />
                </div>

                {/* Legal Notice */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      By clicking "Approve" or "Reject", you are providing an electronic signature
                      that has the same legal effect as a handwritten signature.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowSignDialog(false);
                    setSelectedApprover(null);
                    setComments('');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    const approver = workflow.requiredApprovers.find(a => a.role === selectedApprover);
                    if (approver) handleReject(approver);
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Policy
                </button>

                <button
                  onClick={() => {
                    const approver = workflow.requiredApprovers.find(a => a.role === selectedApprover);
                    if (approver) handleApprove(approver);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                  <FileSignature className="w-4 h-4" />
                  Approve & Sign
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
