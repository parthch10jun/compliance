"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { GitBranch, Clock, AlertCircle, CheckCircle2, FileText, ArrowRight } from "lucide-react";

// Simple date formatter to avoid hydration issues
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
};

interface RequirementVersion {
  version: string;
  effectiveDate: string;
  endDate: string | null;
  status: "active" | "upcoming" | "archived";
  requirement: string;
  changes: string[];
  affectedPolicies: string[];
  complianceStatus: "compliant" | "gap" | "not-applicable";
}

const mockVersions: RequirementVersion[] = [
  {
    version: "v2.0",
    effectiveDate: "2024-04-01",
    endDate: null,
    status: "upcoming",
    requirement: "Capital Adequacy Ratio - Minimum 18% for Upper Layer NBFCs",
    changes: [
      "Increased from 15% to 18%",
      "Added quarterly monitoring requirement",
      "New Board reporting format"
    ],
    affectedPolicies: ["Capital Adequacy Policy", "Risk Management Framework", "Board Reporting"],
    complianceStatus: "gap"
  },
  {
    version: "v1.0",
    effectiveDate: "2022-10-01",
    endDate: "2024-03-31",
    status: "active",
    requirement: "Capital Adequacy Ratio - Minimum 15% for Upper Layer NBFCs",
    changes: [
      "Initial requirement under Scale Based Regulation"
    ],
    affectedPolicies: ["Capital Adequacy Policy"],
    complianceStatus: "compliant"
  }
];

export default function RequirementVersionsPage() {
  const [selectedVersion, setSelectedVersion] = useState<RequirementVersion | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-900 border-green-300";
      case "upcoming": return "bg-orange-100 text-orange-900 border-orange-300";
      case "archived": return "bg-gray-100 text-gray-900 border-gray-300";
      default: return "bg-gray-100 text-gray-900 border-gray-300";
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant": return "text-green-800";
      case "gap": return "text-red-800";
      case "not-applicable": return "text-gray-800";
      default: return "text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Requirement Version History"
        description="Track changes to regulatory requirements over time with full audit trail"
      />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <GitBranch className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            RBI Scale Based Regulation - Section 13: Capital Adequacy
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Master Direction on Non-Banking Financial Company – Scale Based Regulation
        </p>
      </div>

      {/* Version Timeline */}
      <div className="space-y-8">
        {mockVersions.map((version, index) => (
          <div key={version.version} className="relative">
            {/* Timeline connector - positioned to connect circles */}
            {index < mockVersions.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300 z-0"></div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow relative z-10">
              <div className="flex items-start gap-4">
                {/* Version indicator */}
                <div className="flex-shrink-0">
                  <div className={`h-12 w-12 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                    version.status === "active" ? "bg-green-100 border-green-500 text-green-900" :
                    version.status === "upcoming" ? "bg-orange-100 border-orange-500 text-orange-900" :
                    "bg-gray-100 border-gray-400 text-gray-900"
                  }`}>
                    {version.version}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(version.status)}`}>
                      {version.status.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      Effective: {formatDate(version.effectiveDate)}
                      {version.endDate && ` - ${formatDate(version.endDate)}`}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {version.requirement}
                  </h3>

                  {/* Changes */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Changes:</h4>
                    <ul className="space-y-1">
                      {version.changes.map((change, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                          <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Affected Policies */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Affected Policies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {version.affectedPolicies.map((policy, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-900 rounded text-xs font-semibold border border-blue-200">
                          {policy}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Status */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                    <span className="text-sm font-semibold text-gray-900">Compliance Status:</span>
                    <span className={`flex items-center gap-1 font-bold ${getComplianceColor(version.complianceStatus)}`}>
                      {version.complianceStatus === "compliant" && <CheckCircle2 className="h-4 w-4" />}
                      {version.complianceStatus === "gap" && <AlertCircle className="h-4 w-4" />}
                      {version.complianceStatus.toUpperCase().replace("-", " ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

