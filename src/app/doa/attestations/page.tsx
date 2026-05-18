'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AttestationsPage() {
  const attestations = [
    { id: 1, name: 'Q1 2026 DoA Policy Attestation', dueDate: '2026-03-31', status: 'Completed', completedBy: 'John Smith' },
    { id: 2, name: 'Q2 2026 DoA Policy Attestation', dueDate: '2026-06-30', status: 'Pending', completedBy: null },
    { id: 3, name: 'Annual Authority Review', dueDate: '2026-12-31', status: 'Pending', completedBy: null },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-semibold text-gray-900">Policy Attestations</h1>
        <p className="text-p2 text-gray-600 mt-1">Review and attest to delegation of authority policies</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Total Attestations</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{attestations.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {attestations.filter(a => a.status === 'Completed').length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {attestations.filter(a => a.status === 'Pending').length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Attestation Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Completed By</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attestations.map((attestation) => (
              <tr key={attestation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{attestation.name}</td>
                <td className="px-6 py-4 text-gray-600">{attestation.dueDate}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${
                    attestation.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {attestation.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {attestation.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{attestation.completedBy || '—'}</td>
                <td className="px-6 py-4 text-right">
                  {attestation.status === 'Pending' && (
                    <button className="text-[#F59E0B] hover:text-[#D97706] font-medium">
                      Attest Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
