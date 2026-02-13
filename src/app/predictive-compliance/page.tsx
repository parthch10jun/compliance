"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { TrendingUp, AlertTriangle, Target, Calendar, FileText, CheckCircle2 } from "lucide-react";

// Simple date formatter to avoid hydration issues
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
};

interface LayerTransition {
  currentLayer: string;
  projectedLayer: string;
  transitionDate: string;
  confidence: number;
  currentAUM: number;
  projectedAUM: number;
  threshold: number;
  newRequirements: number;
  modifiedRequirements: number;
  estimatedCost: number;
  preparationTime: string;
}

const mockTransition: LayerTransition = {
  currentLayer: "Base Layer",
  projectedLayer: "Middle Layer",
  transitionDate: "2024-09-15",
  confidence: 87,
  currentAUM: 850,
  projectedAUM: 1050,
  threshold: 1000,
  newRequirements: 23,
  modifiedRequirements: 12,
  estimatedCost: 450000,
  preparationTime: "4-6 months"
};

interface NewRequirement {
  id: string;
  title: string;
  category: string;
  priority: "critical" | "high" | "medium";
  estimatedEffort: string;
  dependencies: string[];
}

const mockNewRequirements: NewRequirement[] = [
  {
    id: "1",
    title: "Establish Risk Management Committee",
    category: "Governance",
    priority: "critical",
    estimatedEffort: "2-3 months",
    dependencies: ["Board Resolution", "Committee Charter", "Member Appointment"]
  },
  {
    id: "2",
    title: "Implement Internal Capital Adequacy Assessment Process (ICAAP)",
    category: "Risk Management",
    priority: "critical",
    estimatedEffort: "3-4 months",
    dependencies: ["Risk Framework", "Capital Model", "Board Approval"]
  },
  {
    id: "3",
    title: "Enhanced Cyber Security Framework",
    category: "IT & Security",
    priority: "high",
    estimatedEffort: "2 months",
    dependencies: ["VAPT", "SIEM Implementation", "Incident Response Plan"]
  },
  {
    id: "4",
    title: "Quarterly Stress Testing",
    category: "Risk Management",
    priority: "high",
    estimatedEffort: "1-2 months",
    dependencies: ["Stress Testing Model", "Data Infrastructure"]
  }
];

export default function PredictiveCompliancePage() {
  const [showDetails, setShowDetails] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-900 border-red-300";
      case "high": return "bg-orange-100 text-orange-900 border-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-900 border-yellow-300";
      default: return "bg-gray-100 text-gray-900 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Predictive Compliance"
        description="Forecast regulatory changes based on your growth trajectory"
      />

      {/* Current Status */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Layer Transition Forecast</h2>
            <p className="text-blue-100">Based on your current growth rate of 23.5% YoY</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{mockTransition.confidence}%</div>
            <div className="text-sm text-blue-100">Confidence</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 shadow-lg">
            <div className="text-sm text-green-50 mb-1 font-medium">Current Layer</div>
            <div className="text-xl font-bold text-white">{mockTransition.currentLayer}</div>
            <div className="text-sm text-green-50 mt-1">₹{mockTransition.currentAUM} Cr AUM</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 shadow-lg">
            <div className="text-sm text-orange-50 mb-1 font-medium">Projected Layer</div>
            <div className="text-xl font-bold text-white">{mockTransition.projectedLayer}</div>
            <div className="text-sm text-orange-50 mt-1">₹{mockTransition.projectedAUM} Cr AUM</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 shadow-lg">
            <div className="text-sm text-purple-50 mb-1 font-medium">Estimated Transition</div>
            <div className="text-xl font-bold text-white">{formatDate(mockTransition.transitionDate)}</div>
            <div className="text-sm text-purple-50 mt-1">
              {Math.ceil((new Date(mockTransition.transitionDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days away
            </div>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">{mockTransition.newRequirements}</span>
          </div>
          <div className="text-sm font-medium text-gray-700">New Requirements</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <span className="text-3xl font-bold text-gray-900">{mockTransition.modifiedRequirements}</span>
          </div>
          <div className="text-sm font-medium text-gray-700">Modified Requirements</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-8 w-8 text-green-600" />
            <span className="text-3xl font-bold text-gray-900">₹{(mockTransition.estimatedCost / 100000).toFixed(1)}L</span>
          </div>
          <div className="text-sm font-medium text-gray-700">Estimated Cost</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">{mockTransition.preparationTime}</span>
          </div>
          <div className="text-sm font-medium text-gray-700">Preparation Time</div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-orange-900 mb-1">Action Required: Start Preparation Now</h3>
            <p className="text-sm text-orange-800">
              Based on your growth trajectory, you'll cross into Middle Layer in approximately 8 months. 
              We recommend starting compliance preparation immediately as some requirements take 4-6 months to implement.
            </p>
          </div>
        </div>
      </div>

      {/* New Requirements */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          New Requirements for Middle Layer ({mockNewRequirements.length} of {mockTransition.newRequirements})
        </h2>

        <div className="space-y-4">
          {mockNewRequirements.map((req) => (
            <div key={req.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(req.priority)}`}>
                      {req.priority.toUpperCase()}
                    </span>
                    <span className="text-xs font-medium text-gray-700">{req.category}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{req.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-800 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {req.estimatedEffort}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {req.dependencies.length} dependencies
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>

              {/* Dependencies */}
              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs font-semibold text-gray-900 mb-2">Dependencies:</div>
                <div className="flex flex-wrap gap-2">
                  {req.dependencies.map((dep, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-900 rounded text-xs font-semibold border border-gray-300">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-6 text-center">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            View All {mockTransition.newRequirements} Requirements
          </button>
        </div>
      </div>

      {/* Preparation Roadmap */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Preparation Roadmap</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-700">Month 1-2</div>
            <div className="flex-1">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Foundation & Governance</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Establish Risk Management Committee</li>
                  <li>• Draft Committee Charter and Terms of Reference</li>
                  <li>• Appoint Committee Members</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-700">Month 3-4</div>
            <div className="flex-1">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Risk Framework Implementation</h4>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>• Develop ICAAP Framework</li>
                  <li>• Implement Stress Testing Models</li>
                  <li>• Enhance Cyber Security Controls</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-700">Month 5-6</div>
            <div className="flex-1">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Testing & Validation</h4>
                <ul className="space-y-1 text-sm text-purple-800">
                  <li>• Conduct Internal Audit</li>
                  <li>• Test All New Controls</li>
                  <li>• Board Review and Approval</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Generate Detailed Project Plan
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Download Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}


