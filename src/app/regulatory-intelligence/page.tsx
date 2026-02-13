"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Calendar,
  Target,
  Zap
} from "lucide-react";

// Simple date formatter to avoid hydration issues
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
};

interface RegulatoryUpdate {
  id: string;
  title: string;
  source: string;
  publishDate: string;
  effectiveDate: string;
  status: "new" | "analyzed" | "action-required" | "compliant";
  severity: "critical" | "high" | "medium" | "low";
  affectedRequirements: number;
  affectedControls: number;
  applicability: string;
  summary: string;
  impactScore: number;
}

const mockUpdates: RegulatoryUpdate[] = [
  {
    id: "1",
    title: "RBI/DoR/2024/15 - Scale Based Regulation Amendment",
    source: "RBI Master Direction",
    publishDate: "2024-01-15",
    effectiveDate: "2024-04-01",
    status: "action-required",
    severity: "critical",
    affectedRequirements: 12,
    affectedControls: 8,
    applicability: "Upper Layer NBFCs",
    summary: "Capital Adequacy Ratio increased from 15% to 18% for Upper Layer NBFCs",
    impactScore: 95
  },
  {
    id: "2",
    title: "RBI/DoR/2024/12 - Fraud Reporting Timeline Update",
    source: "RBI Master Direction on Frauds",
    publishDate: "2024-01-10",
    effectiveDate: "2024-02-01",
    status: "analyzed",
    severity: "high",
    affectedRequirements: 5,
    affectedControls: 3,
    applicability: "All NBFCs",
    summary: "Fraud reporting timeline reduced from 7 days to 72 hours",
    impactScore: 78
  },
  {
    id: "3",
    title: "RBI Circular - Board Meeting Frequency",
    source: "RBI Scale Based Regulation",
    publishDate: "2024-01-05",
    effectiveDate: "2024-03-01",
    status: "compliant",
    severity: "medium",
    affectedRequirements: 3,
    affectedControls: 2,
    applicability: "Middle & Upper Layer",
    summary: "Risk Committee meetings increased to monthly frequency",
    impactScore: 62
  }
];

export default function RegulatoryIntelligencePage() {
  const [selectedUpdate, setSelectedUpdate] = useState<RegulatoryUpdate | null>(null);
  const [filter, setFilter] = useState<"all" | "action-required" | "new">("all");

  const filteredUpdates = mockUpdates.filter(update =>
    filter === "all" || update.status === filter
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-800 bg-red-100 border-red-300";
      case "high": return "text-orange-800 bg-orange-100 border-orange-300";
      case "medium": return "text-yellow-900 bg-yellow-100 border-yellow-300";
      case "low": return "text-blue-800 bg-blue-100 border-blue-300";
      default: return "text-gray-800 bg-gray-100 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <Bell className="h-4 w-4" />;
      case "action-required": return <AlertTriangle className="h-4 w-4" />;
      case "analyzed": return <Clock className="h-4 w-4" />;
      case "compliant": return <CheckCircle2 className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regulatory Intelligence"
        description="Real-time monitoring of RBI updates and their impact on your compliance program"
      />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Active Alerts</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">3</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Require immediate action</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Upcoming Deadlines</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">5</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Next 90 days</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Monitored Sources</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">RBI, SEBI, MCA</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Compliance Score</p>
              <p className="text-3xl font-bold text-green-600 mt-1">94%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">+2% from last month</p>
        </div>
      </div>

      {/* Filters - Tab Style */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex gap-1 px-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                filter === "all"
                  ? "border-blue-600 text-blue-700 bg-white"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              All Updates
            </button>
            <button
              onClick={() => setFilter("action-required")}
              className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                filter === "action-required"
                  ? "border-blue-600 text-blue-700 bg-white"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              Action Required
            </button>
            <button
              onClick={() => setFilter("new")}
              className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                filter === "new"
                  ? "border-blue-600 text-blue-700 bg-white"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              New
            </button>
          </div>
        </div>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {filteredUpdates.map((update) => (
          <div
            key={update.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedUpdate(update)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(update.severity)}`}>
                    {update.severity.toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    {getStatusIcon(update.status)}
                    {update.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {update.title}
                </h3>
                <p className="text-sm text-gray-800 mb-3">{update.summary}</p>
                <div className="flex items-center gap-6 text-sm text-gray-700">
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {update.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Published: {formatDate(update.publishDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Effective: {formatDate(update.effectiveDate)}
                  </span>
                </div>
              </div>
              <div className="ml-6">
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{update.impactScore}</div>
                  <div className="text-xs text-gray-500">Impact Score</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-700 font-medium">Applicability:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold border border-blue-200">
                  {update.applicability}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-700 font-medium">
                <span>{update.affectedRequirements} Requirements Affected</span>
                <span>•</span>
                <span>{update.affectedControls} Controls Impacted</span>
              </div>
              <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                View Impact Analysis
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Impact Analysis Modal */}
      {selectedUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Impact Analysis</h2>
              <button
                onClick={() => setSelectedUpdate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Quick Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Quick Impact Summary</h3>
                    <p className="text-sm text-blue-800">{selectedUpdate.summary}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Published</div>
                    <div className="font-medium">{formatDate(selectedUpdate.publishDate)}</div>
                  </div>
                  <div className="h-px flex-1 bg-gray-300"></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Effective Date</div>
                    <div className="font-medium text-orange-600">{formatDate(selectedUpdate.effectiveDate)}</div>
                  </div>
                  <div className="h-px flex-1 bg-gray-300"></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Days Remaining</div>
                    <div className="font-bold text-red-600">
                      {Math.ceil((new Date(selectedUpdate.effectiveDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                </div>
              </div>

              {/* Affected Requirements */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Affected Requirements ({selectedUpdate.affectedRequirements})</h3>
                <div className="space-y-2">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Capital Adequacy Ratio</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Previous: Minimum 15% CAR for Upper Layer NBFCs
                        </div>
                        <div className="text-sm text-red-600 mt-1 font-medium">
                          New: Minimum 18% CAR for Upper Layer NBFCs
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                        GAP IDENTIFIED
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-sm text-gray-700">
                        <strong>Your Current Status:</strong> 16.5% CAR
                      </div>
                      <div className="text-sm text-red-600 mt-1">
                        <strong>Action Required:</strong> Increase capital by ₹2.5 Cr to meet new threshold
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remediation Tasks */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Auto-Generated Remediation Tasks</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Update Capital Adequacy Policy</div>
                      <div className="text-xs text-gray-600">Assigned to: CFO • Due: Feb 15, 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Board Resolution for Capital Infusion</div>
                      <div className="text-xs text-gray-600">Assigned to: Company Secretary • Due: Feb 28, 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Update ALM Process Documentation</div>
                      <div className="text-xs text-gray-600">Assigned to: Risk Manager • Due: Mar 15, 2024</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                  Accept & Add to Workflow
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                  Download Report
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                  Schedule Review Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

