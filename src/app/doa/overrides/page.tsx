'use client';

import React from 'react';
import { AlertOctagon, Shield } from 'lucide-react';

export default function Overrides() {
  const overrides = [
    {
      id: 'OVR-001',
      type: 'Authority Limit Override',
      description: 'CEO override for M&A transaction',
      amount: 5000000,
      overriddenBy: 'CEO',
      date: '2026-05-12',
      justification: 'Strategic acquisition - Board approved',
    },
    {
      id: 'OVR-002',
      type: 'SoD Override',
      description: 'Temporary role conflict for system migration',
      overriddenBy: 'CIO + Compliance Officer',
      date: '2026-05-11',
      justification: 'Critical system migration - compensating controls in place',
    },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-semibold text-gray-900">Authority Overrides</h1>
        <p className="text-p2 text-gray-600 mt-1">
          Approved overrides to DoA policies and rules
        </p>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900">Override Authority</h3>
            <p className="text-sm text-amber-700 mt-1">
              Only executives with override authority can approve exceptions to DoA policies. All overrides are logged and audited.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Total Overrides (30d)</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">{overrides.length}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">Authority Overrides</div>
          <div className="text-h2 font-bold text-orange-600 mt-1">
            {overrides.filter(o => o.type.includes('Authority')).length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-p3 text-gray-600">SoD Overrides</div>
          <div className="text-h2 font-bold text-red-600 mt-1">
            {overrides.filter(o => o.type.includes('SoD')).length}
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {overrides.map((override) => (
          <div key={override.id} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm text-gray-500">{override.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {override.type}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{override.description}</h3>
                <p className="text-sm text-gray-700 mb-3 italic">"{override.justification}"</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Overridden by: <span className="font-medium">{override.overriddenBy}</span></span>
                  <span>•</span>
                  <span>{new Date(override.date).toLocaleDateString()}</span>
                  {override.amount && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-gray-900">${override.amount.toLocaleString()}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
