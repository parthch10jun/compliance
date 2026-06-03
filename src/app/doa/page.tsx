'use client';

/**
 * DoA Dashboard - Executive Command Center
 * Comprehensive dashboard with KPIs, charts, tables, activity feeds, and insights
 */

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  Repeat,
  AlertTriangle,
  TrendingUp,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Plus,
  Users,
  Shield,
  BarChart3,
  Activity,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { getDoAKPIMetrics, getPendingApprovals, getActiveDelegations, getOpenSoDConflicts, mockApprovalRequests } from '@/lib/doa/data';

export default function DoADashboard() {
  // Get KPI data
  const kpis = getDoAKPIMetrics();
  const pendingApprovals = getPendingApprovals();
  const activeDelegations = getActiveDelegations();
  const openConflicts = getOpenSoDConflicts();

  // Recent activity (last 10 approval actions)
  const recentActivity = mockApprovalRequests.slice(0, 10);

  // Authority usage by role (simulated data)
  const authorityUsage = [
    { role: 'CEO', limit: 5000000, used: 3750000, utilization: 75, count: 12 },
    { role: 'CFO', limit: 2000000, used: 1680000, utilization: 84, count: 28 },
    { role: 'VP Operations', limit: 500000, used: 285000, utilization: 57, count: 45 },
    { role: 'VP Sales', limit: 500000, used: 420000, utilization: 84, count: 52 },
  ];

  // Approval trend (last 7 days)
  const approvalTrend = [
    { day: 'Mon', approved: 18, rejected: 2, pending: 5 },
    { day: 'Tue', approved: 22, rejected: 3, pending: 7 },
    { day: 'Wed', approved: 15, rejected: 1, pending: 4 },
    { day: 'Thu', approved: 28, rejected: 2, pending: 8 },
    { day: 'Fri', approved: 31, rejected: 4, pending: 6 },
    { day: 'Sat', approved: 8, rejected: 1, pending: 2 },
    { day: 'Sun', approved: 5, rejected: 0, pending: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">
            Delegation of Authority Dashboard
          </h1>
          <p className="text-p2 text-gray-600 mt-1">
            Real-time authority governance and compliance monitoring
          </p>
        </div>

        <Link
          href="/doa/delegations"
          className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
        >
          <Repeat className="w-5 h-5" />
          Active Delegations
        </Link>
      </div>

      {/* KPI Cards - Redesigned with trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Approvals - Needs Action */}
        <Link href="/doa/change-request" className="bg-white rounded-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Requires Action
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {kpis.pendingApprovals}
          </div>
          <div className="text-sm text-gray-600 mb-3">
            Pending Approvals
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="font-medium text-blue-600">5</span> require your approval
          </div>
        </Link>

        {/* SoD Conflicts - Critical */}
        <Link href="/doa/sod/conflicts" className="bg-white rounded-lg p-6 border-2 border-red-200 hover:border-red-400 transition-all shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              Critical
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {kpis.sodConflictsDetected}
          </div>
          <div className="text-sm text-gray-600 mb-3">
            SoD Conflicts
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="font-medium text-red-600">5</span> critical severity
          </div>
        </Link>

        {/* Active Delegations */}
        <Link href="/doa/delegations" className="bg-white rounded-lg p-6 border-2 border-green-200 hover:border-green-400 transition-all shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Repeat className="w-6 h-6 text-green-600" />
            </div>
            <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {kpis.activeDelegations}
          </div>
          <div className="text-sm text-gray-600 mb-3">
            Active Delegations
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            100% role coverage
          </div>
        </Link>

        {/* Approval Performance */}
        <Link href="/doa/reports/approval-cycle-time" className="bg-white rounded-lg p-6 border-2 border-purple-200 hover:border-purple-400 transition-all shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              Improving
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {kpis.avgApprovalTimeHours}h
          </div>
          <div className="text-sm text-gray-600 mb-3">
            Avg Approval Time
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4 rotate-180" />
            16% faster vs last quarter
          </div>
        </Link>
      </div>


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Approvals Requiring Action */}
        <div className="lg:col-span-2 space-y-6">
          {/* Approvals Requiring Your Action */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-h3 font-semibold text-gray-900">Approvals Requiring Your Action</h2>
                  <p className="text-sm text-gray-600 mt-1">5 requests pending your review</p>
                </div>
                <Link
                  href="/doa/change-request"
                  className="text-sm text-[#F59E0B] hover:text-[#D97706] font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {pendingApprovals.slice(0, 5).map((approval) => (
                <Link
                  key={approval.id}
                  href={`/doa/approvals/${approval.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm font-medium text-gray-900">{approval.requestNumber}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          approval.priority === 'High' ? 'bg-red-100 text-red-800' :
                          approval.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {approval.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{approval.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {approval.requestor}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ${(approval.monetaryAmount || 0).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(approval.submittedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-md text-xs font-medium ${
                        approval.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                        approval.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {approval.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Approval Trend Chart */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-h3 font-semibold text-gray-900">Approval Activity (Last 7 Days)</h2>
              <p className="text-sm text-gray-600 mt-1">127 approvals processed this week</p>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between gap-2 h-48">
                {approvalTrend.map((day, idx) => {
                  const total = day.approved + day.rejected + day.pending;
                  const maxHeight = 140;
                  const approvedHeight = (day.approved / 35) * maxHeight;
                  const rejectedHeight = (day.rejected / 35) * maxHeight;
                  const pendingHeight = (day.pending / 35) * maxHeight;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center justify-end" style={{ height: `${maxHeight}px` }}>
                        <div className="w-full bg-green-500 rounded-t" style={{ height: `${approvedHeight}px` }} title={`Approved: ${day.approved}`} />
                        <div className="w-full bg-red-500" style={{ height: `${rejectedHeight}px` }} title={`Rejected: ${day.rejected}`} />
                        <div className="w-full bg-blue-500 rounded-b" style={{ height: `${pendingHeight}px` }} title={`Pending: ${day.pending}`} />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{day.day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600">Rejected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Insights & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-h4 font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/doa/delegations"
                className="flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-[#F59E0B] rounded-lg">
                  <Repeat className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Active Delegations</div>
                  <div className="text-xs text-gray-600">View delegation calendar</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#F59E0B]" />
              </Link>

              <Link
                href="/doa/delegations/new"
                className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-green-600 rounded-lg">
                  <Repeat className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">New Delegation</div>
                  <div className="text-xs text-gray-600">Delegate authority</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
              </Link>

              <Link
                href="/doa/reports/executive-summary"
                className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-blue-600 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">View Reports</div>
                  <div className="text-xs text-gray-600">Analytics & insights</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </Link>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-h4 font-semibold text-gray-900">Critical Alerts</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">5 Critical SoD Conflicts</div>
                    <p className="text-xs text-gray-600 mb-2">Immediate remediation required</p>
                    <Link href="/doa/sod/conflicts" className="text-xs text-red-600 hover:text-red-700 font-medium">
                      Review Conflicts →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">3 Approvals Overdue</div>
                    <p className="text-xs text-gray-600 mb-2">Exceeded SLA threshold</p>
                    <Link href="/doa/change-request" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                      View Approvals →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">3 Delegations Expiring</div>
                    <p className="text-xs text-gray-600 mb-2">Within next 7 days</p>
                    <Link href="/doa/delegations" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      Manage Delegations →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Authority Usage */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-h4 font-semibold text-gray-900">Authority Usage</h3>
                <Link href="/doa/reports/authority-usage" className="text-xs text-[#F59E0B] hover:text-[#D97706] font-medium">
                  View Report
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {authorityUsage.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.role}</span>
                    <span className={`text-sm font-bold ${
                      item.utilization >= 90 ? 'text-red-600' :
                      item.utilization >= 70 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {item.utilization}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        item.utilization >= 90 ? 'bg-red-600' :
                        item.utilization >= 70 ? 'bg-amber-600' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${item.utilization}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ${(item.used / 1000).toFixed(0)}K of ${(item.limit / 1000).toFixed(0)}K • {item.count} approvals
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-h4 font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${
                      activity.status === 'Approved' ? 'bg-green-100' :
                      activity.status === 'Rejected' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.status === 'Approved' ? (
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      ) : activity.status === 'Rejected' ? (
                        <XCircle className="w-3 h-3 text-red-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{activity.requestNumber}</p>
                      <p className="text-xs text-gray-600 mt-0.5">${(activity.monetaryAmount || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(activity.submittedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <Link href="/doa/change-request" className="text-sm text-[#F59E0B] hover:text-[#D97706] font-medium flex items-center justify-center gap-1">
                View All Activity
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}