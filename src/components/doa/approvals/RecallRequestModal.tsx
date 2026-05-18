'use client';

/**
 * Recall Request Modal
 * Allow originators to recall and edit requests
 */

import { useState } from 'react';
import { AlertTriangle, RotateCcw, X, CheckCircle, Clock } from 'lucide-react';
import type { ApprovalRequest } from '@/lib/doa/types/doa-types';

interface RecallRequestModalProps {
  request: ApprovalRequest;
  isOpen: boolean;
  onClose: () => void;
  onRecall: (reason: string, willEdit: boolean) => void;
}

export default function RecallRequestModal({ 
  request, 
  isOpen, 
  onClose, 
  onRecall 
}: RecallRequestModalProps) {
  const [reason, setReason] = useState('');
  const [willEdit, setWillEdit] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen) return null;
  
  const hasApprovals = request.approvalHistory && request.approvalHistory.length > 0;
  const requiresConsent = hasApprovals;
  
  const handleRecall = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onRecall(reason, willEdit);
    setIsSubmitting(false);
    setReason('');
    setWillEdit(true);
  };
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <RotateCcw className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recall Request</h2>
                <p className="text-sm text-gray-600 mt-1">{request.requestNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Status Info */}
            {!hasApprovals ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-700">
                  <div className="font-semibold mb-1">Request can be recalled immediately</div>
                  <div>
                    No approvals have been received yet. You can recall and edit this request
                    without requiring approval.
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-700">
                  <div className="font-semibold mb-1">Approver consent required</div>
                  <div>
                    This request has received {request.approvalHistory.length} approval
                    {request.approvalHistory.length > 1 ? 's' : ''}.
                    Recalling will require consent from the approvers who have already reviewed it.
                  </div>
                </div>
              </div>
            )}
            
            {/* Request Details */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Description:</span>
                <span className="font-medium text-gray-900 text-right">{request.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-900">
                  ${(request.monetaryAmount || 0).toLocaleString()} {request.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Step:</span>
                <span className="font-medium text-gray-900">Step {request.currentStep}</span>
              </div>
              {hasApprovals && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Approvals:</span>
                  <span className="font-medium text-gray-900">
                    {request.approvalHistory.length} received
                  </span>
                </div>
              )}
            </div>
            
            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Recall <span className="text-red-600">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                placeholder="Explain why you're recalling this request..."
                required
              />
            </div>
            
            {/* Next Steps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What will you do after recall?
              </label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#F59E0B] transition-colors">
                  <input
                    type="radio"
                    checked={willEdit}
                    onChange={() => setWillEdit(true)}
                    className="mt-1 text-[#F59E0B] focus:ring-[#F59E0B]"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Edit and resubmit</div>
                    <div className="text-sm text-gray-600">
                      Make changes and submit again (keeps same request number)
                    </div>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#F59E0B] transition-colors">
                  <input
                    type="radio"
                    checked={!willEdit}
                    onChange={() => setWillEdit(false)}
                    className="mt-1 text-[#F59E0B] focus:ring-[#F59E0B]"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Cancel request</div>
                    <div className="text-sm text-gray-600">
                      Withdraw the request permanently
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Warning */}
            {requiresConsent && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">
                  <div className="font-semibold mb-1">Important</div>
                  <div>
                    Your recall request will be sent to the approvers. They will be notified and must
                    consent before the request is recalled. This process typically takes 1-2 business days.
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleRecall}
              disabled={!reason.trim() || isSubmitting}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {isSubmitting ? 'Processing...' : requiresConsent ? 'Request Recall' : 'Recall Now'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
