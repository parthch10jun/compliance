'use client';

/**
 * Active Delegations Summary Report
 * Overview of current active delegations and coverage
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Users, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { mockDelegations } from '@/lib/doa/data';

export default function ActiveDelegationsSummaryReport() {
  const activeDelegations = mockDelegations.filter(d => d.status === 'Active');
  const oooCount = activeDelegations.filter(d => d.type === 'Out of Office').length;
  const permanentCount = activeDelegations.filter(d => d.type === 'Permanent').length;
  const actingCount = activeDelegations.filter(d => d.type === 'Acting').length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/reports" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Active Delegations Summary</h1>
            <p className="text-p2 text-gray-600 mt-1">
              Current active delegations and authority coverage status
            </p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-p3">Active Delegations</span>
          </div>
          <div className="text-h2 font-bold text-gray-900">{activeDelegations.length}</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>+8% from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-blue-200 bg-blue-50">
          <div className="text-p3 text-blue-600 mb-2">Out of Office</div>
          <div className="text-h2 font-bold text-blue-600">{oooCount}</div>
          <p className="text-sm text-blue-600 mt-2">Temporary coverage</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-purple-200 bg-purple-50">
          <div className="text-p3 text-purple-600 mb-2">Permanent</div>
          <div className="text-h2 font-bold text-purple-600">{permanentCount}</div>
          <p className="text-sm text-purple-600 mt-2">Long-term transfers</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-amber-200 bg-amber-50">
          <div className="text-p3 text-amber-600 mb-2">Acting Capacity</div>
          <div className="text-h2 font-bold text-amber-600">{actingCount}</div>
          <p className="text-sm text-amber-600 mt-2">Temporary promotions</p>
        </div>
      </div>
      
      {/* Delegation Type Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Delegations by Type</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Out of Office</span>
              <span className="text-sm font-bold text-blue-600">{oooCount} delegations ({Math.round((oooCount / activeDelegations.length) * 100)}%)</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: `${(oooCount / activeDelegations.length) * 100}%` }} />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Permanent</span>
              <span className="text-sm font-bold text-purple-600">{permanentCount} delegations ({Math.round((permanentCount / activeDelegations.length) * 100)}%)</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600" style={{ width: `${(permanentCount / activeDelegations.length) * 100}%` }} />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Acting Capacity</span>
              <span className="text-sm font-bold text-amber-600">{actingCount} delegations ({Math.round((actingCount / activeDelegations.length) * 100)}%)</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-600" style={{ width: `${(actingCount / activeDelegations.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Delegations List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-6">Current Active Delegations</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Delegator</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Delegate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Scope</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeDelegations.slice(0, 10).map((delegation) => (
                <tr key={delegation.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{delegation.fromUser}</td>
                  <td className="py-4 px-4 text-gray-700">{delegation.toUser}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      delegation.type === 'Out of Office' ? 'bg-blue-100 text-blue-800' :
                      delegation.type === 'Permanent' ? 'bg-purple-100 text-purple-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {delegation.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{delegation.scope}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {new Date(delegation.startDate).toLocaleDateString()} - {' '}
                    {delegation.endDate ? new Date(delegation.endDate).toLocaleDateString() : 'Ongoing'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Coverage Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Coverage Analysis</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Critical Roles Covered</span>
            </div>
            <div className="text-h2 font-bold text-green-600">100%</div>
            <p className="text-sm text-green-700 mt-1">All critical roles have active backup coverage</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Upcoming Expirations</span>
            </div>
            <div className="text-h2 font-bold text-blue-600">3</div>
            <p className="text-sm text-blue-700 mt-1">Delegations expiring in next 7 days</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-amber-900">Review Required: Long-term Permanent Delegations</div>
                <p className="text-sm text-amber-700 mt-1">
                  {permanentCount} permanent delegations active for &gt;90 days should be reviewed for potential role change
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Recommendations</h2>
        <ul className="space-y-2 list-disc list-inside text-gray-700">
          <li>Review permanent delegations active for &gt;6 months - consider permanent role changes</li>
          <li>Set up automated reminders 7 days before delegation expiration</li>
          <li>Ensure all senior management roles have designated backup delegates</li>
          <li>Conduct quarterly audit of delegation usage and effectiveness</li>
        </ul>
      </div>
    </div>
  );
}
