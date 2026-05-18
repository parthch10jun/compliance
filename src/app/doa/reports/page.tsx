'use client';

/**
 * Reports & Analytics Dashboard
 * DoA module reporting and analytics hub
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, TrendingUp, Download, Calendar, FileText, 
  Users, Shield, Clock, DollarSign 
} from 'lucide-react';

export default function ReportsDashboard() {
  const [dateRange, setDateRange] = useState('last30days');
  
  const reportCategories = [
    {
      name: 'Authority Matrix Reports',
      icon: FileText,
      color: 'amber',
      reports: [
        { name: 'Authority Matrix Coverage Report', description: 'Matrix coverage by function and role' },
        { name: 'Authority Usage Report', description: 'Authority utilization across organization' },
        { name: 'Matrix Version History', description: 'Changes and updates to matrices' },
      ]
    },
    {
      name: 'Approval Analytics',
      icon: TrendingUp,
      color: 'blue',
      reports: [
        { name: 'Approval Cycle Time Analysis', description: 'Average time per approval step' },
        { name: 'Bottleneck Identification', description: 'Identify approval delays' },
        { name: 'Approval Volume Trends', description: 'Request volume over time' },
        { name: 'Exception Rate Analysis', description: 'Track exception frequency' },
      ]
    },
    {
      name: 'Delegation Reports',
      icon: Users,
      color: 'green',
      reports: [
        { name: 'Active Delegations Summary', description: 'Current delegation status' },
        { name: 'Delegation Coverage Report', description: 'OOO coverage and gaps' },
        { name: 'Permanent Delegation Review', description: 'Long-standing delegations' },
      ]
    },
    {
      name: 'SoD Compliance',
      icon: Shield,
      color: 'red',
      reports: [
        { name: 'SoD Conflict Summary', description: 'Open conflicts by severity' },
        { name: 'Remediation Tracking', description: 'Conflict resolution progress' },
        { name: 'SoD Rule Effectiveness', description: 'Rule performance analysis' },
      ]
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-p2 text-gray-600 mt-1">
            Comprehensive reporting and insights across all DoA functions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
            <option value="thisyear">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium">
            <Download className="w-5 h-5" />
            Export All
          </button>
        </div>
      </div>
      
      {/* Featured: Executive Dashboard */}
      <Link
        href="/doa/reports/executive-dashboard"
        className="block bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-300 p-6 hover:border-amber-500 hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Executive Dashboard</h2>
              <span className="px-3 py-1 bg-amber-600 text-white rounded-full text-xs font-bold uppercase tracking-wide">
                Featured
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Continuously updated view of DoA health: approval volume, cycle time, SLA, exceptions, SoD violations, and bottlenecks
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                5 KPI cards with trends
              </span>
              <span>•</span>
              <span>4 interactive charts</span>
              <span>•</span>
              <span>Click-through drill-down</span>
              <span>•</span>
              <span className="text-amber-700 font-semibold">Refreshes in &lt;1s</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors font-medium">
            View Dashboard
          </div>
        </div>
      </Link>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">1,247</div>
              <div className="text-p3 text-gray-600">Total Requests (30d)</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">94.3%</div>
              <div className="text-p3 text-gray-600">Approval Rate</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">4.2h</div>
              <div className="text-p3 text-gray-600">Avg Cycle Time</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-orange-600" />
            <div>
              <div className="text-h2 font-bold text-gray-900">$4.2M</div>
              <div className="text-p3 text-gray-600">Total Value Approved</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Categories */}
      <div className="space-y-6">
        {reportCategories.map((category) => {
          const IconComponent = category.icon;
          const colorClasses = {
            amber: 'from-amber-50 to-amber-100 border-amber-200',
            blue: 'from-blue-50 to-blue-100 border-blue-200',
            green: 'from-green-50 to-green-100 border-green-200',
            red: 'from-red-50 to-red-100 border-red-200',
          }[category.color];
          
          const iconColor = {
            amber: 'text-amber-600',
            blue: 'text-blue-600',
            green: 'text-green-600',
            red: 'text-red-600',
          }[category.color];
          
          return (
            <div key={category.name} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className={`bg-gradient-to-r ${colorClasses} px-6 py-4 border-b`}>
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-6 h-6 ${iconColor}`} />
                  <h2 className="text-h3 font-semibold text-gray-900">{category.name}</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.reports.map((report) => (
                    <Link
                      key={report.name}
                      href={`/doa/reports/${report.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-[#F59E0B] hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 group-hover:text-[#F59E0B] transition-colors mb-1">
                            {report.name}
                          </h3>
                          <p className="text-sm text-gray-600">{report.description}</p>
                        </div>
                        <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-[#F59E0B] border border-gray-300 rounded-lg hover:border-[#F59E0B] transition-colors">
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick Export Templates */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-h3 font-semibold text-gray-900 mb-4">Quick Export Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-[#F59E0B] hover:bg-gray-50 transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-[#F59E0B]" />
              <h3 className="font-medium text-gray-900">Executive Summary</h3>
            </div>
            <p className="text-sm text-gray-600">High-level overview for leadership</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-[#F59E0B] hover:bg-gray-50 transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Audit Package</h3>
            </div>
            <p className="text-sm text-gray-600">Complete audit trail and evidence</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-[#F59E0B] hover:bg-gray-50 transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-gray-900">Monthly Report</h3>
            </div>
            <p className="text-sm text-gray-600">Standard monthly metrics package</p>
          </button>
        </div>
      </div>
    </div>
  );
}
