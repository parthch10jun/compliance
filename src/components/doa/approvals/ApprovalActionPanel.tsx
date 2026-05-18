'use client';

/**
 * Approval Action Panel
 * Complete approval interface with all four actions
 */

import { useState } from 'react';
import { 
  CheckCircle, XCircle, MessageSquare, UserPlus, 
  Lock, Smartphone, AlertCircle, Upload, Paperclip, X 
} from 'lucide-react';
import type { ApprovalRequest } from '@/lib/doa/types/doa-types';

interface ApprovalActionPanelProps {
  request: ApprovalRequest;
  onAction?: (action: string, data: any) => void;
}

export default function ApprovalActionPanel({ request, onAction }: ApprovalActionPanelProps) {
  const [activeAction, setActiveAction] = useState<'approve' | 'reject' | 'request_info' | 'delegate' | null>(null);
  const [comments, setComments] = useState('');
  const [infoQuestions, setInfoQuestions] = useState('');
  const [delegateTo, setDelegateTo] = useState('');
  const [delegateReason, setDelegateReason] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [mfaCompleted, setMfaCompleted] = useState(false);
  
  // High-value approval requires step-up authentication
  const isHighValue = (request.monetaryAmount || 0) >= 1000000;
  
  const handleAction = (action: 'approve' | 'reject' | 'request_info' | 'delegate') => {
    if (isHighValue && !mfaCompleted && (action === 'approve' || action === 'reject')) {
      setRequiresMFA(true);
      setActiveAction(action);
      return;
    }
    
    setActiveAction(action);
  };
  
  const confirmAction = () => {
    const data: any = {
      action: activeAction,
      comments,
      timestamp: new Date().toISOString(),
      attachments: attachments.map(f => f.name),
    };
    
    if (activeAction === 'request_info') {
      data.questions = infoQuestions;
    }
    
    if (activeAction === 'delegate') {
      data.delegateTo = delegateTo;
      data.reason = delegateReason;
    }
    
    onAction?.(activeAction!, data);
    
    // Reset
    setActiveAction(null);
    setComments('');
    setInfoQuestions('');
    setDelegateTo('');
    setDelegateReason('');
    setAttachments([]);
    setMfaCompleted(false);
  };
  
  const handleMFA = () => {
    // Simulate MFA verification
    setTimeout(() => {
      setMfaCompleted(true);
      setRequiresMFA(false);
    }, 1500);
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Take Action</h3>
      
      {/* MFA Challenge */}
      {requiresMFA && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-blue-900 mb-2">Step-Up Authentication Required</div>
              <p className="text-sm text-blue-700 mb-3">
                This approval involves ${(request.monetaryAmount || 0).toLocaleString()} and requires 
                additional verification.
              </p>
              <button
                onClick={handleMFA}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                Verify with Mobile App
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      {!activeAction && !requiresMFA && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAction('approve')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <CheckCircle className="w-5 h-5" />
            Approve
          </button>
          
          <button
            onClick={() => handleAction('reject')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <XCircle className="w-5 h-5" />
            Reject
          </button>
          
          <button
            onClick={() => handleAction('request_info')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            <MessageSquare className="w-5 h-5" />
            Request Information
          </button>
          
          <button
            onClick={() => handleAction('delegate')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <UserPlus className="w-5 h-5" />
            Delegate This Step
          </button>
        </div>
      )}
      
      {/* Action Forms */}
      {activeAction && !requiresMFA && (
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700">
              {activeAction === 'approve' && '✅ Approving Request'}
              {activeAction === 'reject' && '❌ Rejecting Request'}
              {activeAction === 'request_info' && '❓ Requesting More Information'}
              {activeAction === 'delegate' && '👤 Delegating This Step'}
            </div>
          </div>
          
          {/* Request Info Form */}
          {activeAction === 'request_info' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Questions for Requester
              </label>
              <textarea
                value={infoQuestions}
                onChange={(e) => setInfoQuestions(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                placeholder="What additional information do you need?"
                required
              />
            </div>
          )}
          
          {/* Delegate Form */}
          {activeAction === 'delegate' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delegate To
                </label>
                <select
                  value={delegateTo}
                  onChange={(e) => setDelegateTo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  required
                >
                  <option value="">Select person...</option>
                  <option value="user-002">Michael Rodriguez - VP Finance</option>
                  <option value="user-003">Emily Watson - Finance Director</option>
                  <option value="user-004">David Kim - Senior Manager</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Delegation
                </label>
                <input
                  type="text"
                  value={delegateReason}
                  onChange={(e) => setDelegateReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  placeholder="e.g., Out of office, conflict of interest, etc."
                  required
                />
              </div>
            </>
          )}

          {/* Common: Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments {activeAction !== 'request_info' && '(Optional)'}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              placeholder="Add your comments..."
            />
          </div>

          {/* Common: Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setAttachments(Array.from(e.target.files));
                  }
                }}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">Click to upload files</span>
              </label>

              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info Messages */}
          {activeAction === 'request_info' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                This request will be paused and returned to the requester for additional information.
                The workflow will resume once they respond.
              </div>
            </div>
          )}

          {activeAction === 'delegate' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                This will delegate only this approval step. The person you select will receive the request
                and can approve or reject on your behalf.
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setActiveAction(null);
                setComments('');
                setInfoQuestions('');
                setDelegateTo('');
                setDelegateReason('');
                setAttachments([]);
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={confirmAction}
              className={`flex-1 px-6 py-2 rounded-lg font-semibold transition-colors ${
                activeAction === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white' :
                activeAction === 'reject' ? 'bg-red-600 hover:bg-red-700 text-white' :
                activeAction === 'request_info' ? 'bg-amber-600 hover:bg-amber-700 text-white' :
                'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {activeAction === 'approve' && 'Confirm Approval'}
              {activeAction === 'reject' && 'Confirm Rejection'}
              {activeAction === 'request_info' && 'Send Information Request'}
              {activeAction === 'delegate' && 'Confirm Delegation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
