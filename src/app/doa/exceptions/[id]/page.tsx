'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, AlertOctagon, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ExceptionDetail() {
  const params = useParams();
  const exceptionId = params.id as string;
  
  // Mock exception data
  const exception = {
    id: exceptionId,
    requestNumber: exceptionId,
    type: 'Authority Override',
    description: 'Request to approve purchase order exceeding authority limit',
    requestedBy: 'David Chen',
    requestedDate: '2026-05-10T10:30:00Z',
    amount: 150000,
    reason: 'Urgent vendor payment required to prevent service disruption',
    status: 'Pending',
    approver: 'CFO',
    severity: 'High',
    duration: 'One-time',
    compensatingControls: ['Dual verification required', 'Enhanced monitoring for 30 days', 'Post-approval audit'],
  };
  
  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-amber-100 text-amber-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/doa/exceptions" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-h1 font-semibold text-gray-900">{exception.requestNumber}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(exception.status)}`}>
              {exception.status}
            </span>
          </div>
          <p className="text-p2 text-gray-600 mt-1">{exception.type}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-h3 font-semibold text-gray-900 mb-4">Exception Details</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Description</div>
                <p className="text-gray-900">{exception.description}</p>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Business Justification</div>
                <p className="text-gray-900">{exception.reason}</p>
              </div>
              {exception.amount && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Amount</div>
                  <p className="text-h3 font-semibold text-gray-900">${exception.amount.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-h3 font-semibold text-gray-900 mb-4">Compensating Controls</h2>
            <div className="space-y-2">
              {exception.compensatingControls.map((control, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span className="text-gray-700">{control}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-h4 font-semibold text-gray-900 mb-3">Request Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-600">Requested By</div>
                <div className="font-medium">{exception.requestedBy}</div>
              </div>
              <div>
                <div className="text-gray-600">Request Date</div>
                <div className="font-medium">{new Date(exception.requestedDate).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-600">Approver</div>
                <div className="font-medium">{exception.approver}</div>
              </div>
              <div>
                <div className="text-gray-600">Duration</div>
                <div className="font-medium">{exception.duration}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
