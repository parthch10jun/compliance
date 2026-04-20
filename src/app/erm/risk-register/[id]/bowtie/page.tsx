'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, ZoomIn, ZoomOut, Maximize2, Shield, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface BowTieNode {
  id: string;
  label: string;
  type: 'threat' | 'event' | 'consequence' | 'preventive' | 'mitigating';
}

interface BowTieData {
  riskId: string;
  riskTitle: string;
  event: string;
  threats: Array<{ id: string; label: string; controls: string[] }>;
  consequences: Array<{ id: string; label: string; dimension: string; controls: string[] }>;
}

const mockBowTieData: Record<string, BowTieData> = {
  'RSK-001': {
    riskId: 'RSK-001',
    riskTitle: 'Third-party vendor data breach',
    event: 'Unauthorized access to customer data via vendor systems',
    threats: [
      {
        id: 'T1',
        label: 'Vendor security vulnerabilities',
        controls: ['CTRL-001: Vendor security assessments', 'CTRL-002: Security SLAs']
      },
      {
        id: 'T2',
        label: 'Inadequate vendor access controls',
        controls: ['CTRL-003: Access management policy', 'CTRL-004: MFA requirement']
      },
      {
        id: 'T3',
        label: 'Phishing attacks on vendor employees',
        controls: ['CTRL-005: Security awareness training', 'CTRL-006: Email filtering']
      },
      {
        id: 'T4',
        label: 'Insider threats at vendor',
        controls: ['CTRL-007: Background checks', 'CTRL-008: Monitoring & logging']
      }
    ],
    consequences: [
      {
        id: 'C1',
        label: 'Financial loss from regulatory fines',
        dimension: 'Financial',
        controls: ['CTRL-009: Cyber insurance', 'CTRL-010: Legal reserve fund']
      },
      {
        id: 'C2',
        label: 'Reputational damage',
        dimension: 'Reputational',
        controls: ['CTRL-011: Crisis PR plan', 'CTRL-012: Stakeholder communication']
      },
      {
        id: 'C3',
        label: 'Customer data exposure',
        dimension: 'Operational',
        controls: ['CTRL-013: Data encryption', 'CTRL-014: Breach notification process']
      },
      {
        id: 'C4',
        label: 'Legal liability',
        dimension: 'Legal',
        controls: ['CTRL-015: Legal response team', 'CTRL-016: Compliance monitoring']
      }
    ]
  }
};

export default function BowTieDiagramPage() {
  const params = useParams();
  const router = useRouter();
  const riskId = params.id as string;
  const [zoom, setZoom] = useState(100);
  const [showControls, setShowControls] = useState(true);

  const bowTieData = mockBowTieData[riskId] || mockBowTieData['RSK-001'];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push(`/erm/risk-register/${riskId}`)}
          className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4"
        >
          <ArrowLeft size={16} />
          Back to Risk Details
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h2 font-bold text-[var(--foreground)] mb-1">{bowTieData.riskTitle}</h1>
            <p className="text-sm text-[var(--foreground-muted)]">Bow-Tie Analysis - {riskId}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowControls(!showControls)}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {showControls ? 'Hide' : 'Show'} Controls
            </button>
            <button className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(150, zoom + 10))}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Maximize2 size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
            <span>Threats/Hazards</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 border-2 border-orange-500 rounded"></div>
            <span>Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-100 border-2 border-amber-500 rounded"></div>
            <span>Consequences</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-green-600" />
            <span>Controls</span>
          </div>
        </div>
      </div>

      {/* Bow-Tie Diagram */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-8 overflow-auto">
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}>
          <div className="flex items-center justify-center gap-12 min-h-[600px]">
            {/* Threats Section */}
            <div className="flex flex-col gap-4 w-64">
              <h3 className="text-sm font-semibold text-gray-700 text-center mb-2">Threats / Hazards</h3>
              {bowTieData.threats.map((threat, idx) => (
                <div key={threat.id} className="relative">
                  {/* Threat Box */}
                  <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs font-medium text-red-900">{threat.label}</div>
                    </div>
                  </div>

                  {/* Preventive Controls */}
                  {showControls && threat.controls.length > 0 && (
                    <div className="mt-2 ml-4 space-y-1">
                      {threat.controls.map((control, ctrlIdx) => (
                        <div key={ctrlIdx} className="flex items-start gap-2">
                          <Shield size={12} className="text-green-600 flex-shrink-0 mt-1" />
                          <div className="text-xs text-green-800 bg-green-50 px-2 py-1 rounded border border-green-200">
                            {control}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Arrow to Event */}
                  <svg className="absolute top-1/2 -right-12 -translate-y-1/2" width="48" height="2">
                    <line x1="0" y1="1" x2="40" y2="1" stroke="#ef4444" strokeWidth="2" />
                    <polygon points="40,1 35,4 35,-2" fill="#ef4444" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Event (Center) */}
            <div className="relative">
              <div className="bg-orange-100 border-4 border-orange-500 rounded-lg p-6 w-72 shadow-lg">
                <div className="text-center">
                  <div className="text-xs font-semibold text-orange-900 uppercase tracking-wide mb-2">
                    Risk Event
                  </div>
                  <div className="text-sm font-bold text-orange-900">
                    {bowTieData.event}
                  </div>
                </div>
              </div>
            </div>

            {/* Consequences Section */}
            <div className="flex flex-col gap-4 w-64">
              <h3 className="text-sm font-semibold text-gray-700 text-center mb-2">Consequences</h3>
              {bowTieData.consequences.map((consequence, idx) => (
                <div key={consequence.id} className="relative">
                  {/* Arrow from Event */}
                  <svg className="absolute top-1/2 -left-12 -translate-y-1/2" width="48" height="2">
                    <line x1="8" y1="1" x2="48" y2="1" stroke="#f59e0b" strokeWidth="2" />
                    <polygon points="48,1 43,4 43,-2" fill="#f59e0b" />
                  </svg>

                  {/* Consequence Box */}
                  <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-3">
                    <div className="text-xs font-medium text-amber-900 mb-1">{consequence.label}</div>
                    <div className="text-xs text-amber-700 font-semibold">{consequence.dimension}</div>
                  </div>

                  {/* Mitigating Controls */}
                  {showControls && consequence.controls.length > 0 && (
                    <div className="mt-2 ml-4 space-y-1">
                      {consequence.controls.map((control, ctrlIdx) => (
                        <div key={ctrlIdx} className="flex items-start gap-2">
                          <Shield size={12} className="text-blue-600 flex-shrink-0 mt-1" />
                          <div className="text-xs text-blue-800 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                            {control}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Details */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Bow-Tie Structure</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="font-semibold text-gray-900 mb-1">Left Side: Proactive (Prevention)</div>
              <p className="text-gray-600">
                Shows threats/hazards that could cause the risk event and preventive controls that reduce likelihood.
              </p>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">Center: Risk Event</div>
              <p className="text-gray-600">
                The actual risk event that could occur if threats materialize despite preventive controls.
              </p>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-1">Right Side: Reactive (Mitigation)</div>
              <p className="text-gray-600">
                Shows consequences if the event occurs and mitigating controls that reduce impact/severity.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Control Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-green-700 mb-1">Preventive Controls</div>
              <div className="text-2xl font-bold text-green-700">
                {bowTieData.threats.reduce((sum, t) => sum + t.controls.length, 0)}
              </div>
              <div className="text-xs text-green-600 mt-1">Reduce likelihood</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-700 mb-1">Mitigating Controls</div>
              <div className="text-2xl font-bold text-blue-700">
                {bowTieData.consequences.reduce((sum, c) => sum + c.controls.length, 0)}
              </div>
              <div className="text-xs text-blue-600 mt-1">Reduce impact</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

