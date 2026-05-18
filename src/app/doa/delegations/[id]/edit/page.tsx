'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditDelegation() {
  const params = useParams();
  const delegationId = params.id as string;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Delegation updated! (Demo mode)');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/doa/delegations/${delegationId}`} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">Edit Delegation</h1>
          <p className="text-p2 text-gray-600 mt-1">Delegation ID: {delegationId}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Delegation Type *</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]" required>
              <option>OOO</option>
              <option>Permanent</option>
              <option>Acting</option>
              <option>Interim</option>
              <option>Project-Based</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Authority Type *</label>
            <input
              type="text"
              defaultValue="Purchase Order Approval"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Scope *</label>
            <textarea
              defaultValue="All procurement transactions up to $50,000"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Start Date *</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">End Date</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Reason</label>
            <textarea
              placeholder="Reason for delegation..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Limitations</label>
            <textarea
              placeholder="Any limitations or restrictions..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/doa/delegations/${delegationId}`}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
