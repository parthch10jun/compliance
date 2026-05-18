'use client';

/**
 * Screen 12 — Audit Trail Search
 * Auditors' workbench with hash-chained events, powerful filtering, and evidence pack export
 */

import React, { useState } from 'react';
import {
  Search, Shield, CheckCircle, XCircle,
  ChevronDown, ChevronRight, Lock, FileArchive, RefreshCw, Calendar
} from 'lucide-react';

// Enhanced audit entry with hash chain
interface AuditEntry {
  id: string;
  time: string;
  actor: string;
  action: string;
  entity: string;
  entityType: string;
  beforeAfter: string;
  hash: string;
  prevHash: string;
  fullBefore?: any;
  fullAfter?: any;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  function: string;
}

// Generate realistic hash (truncated SHA-256 style)
const generateHash = (index: number, seed: number = 0) => {
  const chars = '0123456789abcdef';
  let hash = '';
  // Use deterministic generation based on index and seed
  for (let i = 0; i < 64; i++) {
    const charIndex = (index + i + seed) % 16;
    hash += chars[charIndex];
  }
  return hash;
};

// Generate mock audit trail data
const generateAuditTrail = (): AuditEntry[] => {
  const events: AuditEntry[] = [];
  const actions = [
    'APPROVE_STEP', 'ADVANCE_CHAIN', 'SEND_EMAIL', 'RESOLVE_CHAIN', 
    'SUBMIT_REQUEST', 'APPROVE_VERSION', 'CREATE_VERSION', 'CREATE_DELEGATION',
    'EXPIRE_DELEGATION', 'REJECT_STEP', 'UPDATE_SOD_RULE'
  ];
  const actors = ['Lily Tan', 'DoA Engine', 'Notif. Service', 'Priya M.', 'Anna F. (CFO)', 'S. Compliance', 'J. Müller', 'DoA Scheduler', 'M. Ahmed', 'DoA Admin'];
  const entities = ['Step st_98112', 'Req DOA-23491', 'ntf_55821', 'Policy v2026.2', 'Req DOA-23493', 'Delegation d_8821', 'Delegation d_9804', 'Step st_96090', 'Rule SOD-004'];
  const functions = ['Procurement', 'Finance', 'HR', 'IT', 'Legal', 'Compliance'];
  
  let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
  
  for (let i = 0; i < 12; i++) {
    const currentHash = generateHash(i);
    const action = actions[i % actions.length];
    const actor = actors[i % actors.length];
    const entity = entities[i % entities.length];
    
    let beforeAfter = '';
    switch (action) {
      case 'APPROVE_STEP':
        beforeAfter = 'status: PENDING → APPROVED';
        break;
      case 'ADVANCE_CHAIN':
        beforeAfter = 'step 1 closed; step 2 routed to Shashi K.';
        break;
      case 'SEND_EMAIL':
        beforeAfter = 'to=lily.tan@... subject="Approval required"';
        break;
      case 'RESOLVE_CHAIN':
        beforeAfter = 'matrix=DOA-PROC-2026.2; chain=[L1,L2,3]; sod=CLEAR';
        break;
      case 'SUBMIT_REQUEST':
        beforeAfter = 'amount=EUR 450,000; vendor=Salesforce.com EU';
        break;
      case 'APPROVE_VERSION':
        beforeAfter = 'state: IN_REVIEW → APPROVED; signed PDF stored';
        break;
      case 'CREATE_VERSION':
        beforeAfter = 'cloned from v2026.2; 12 changes proposed';
        break;
      case 'CREATE_DELEGATION':
        beforeAfter = 'delegator=u_38291; delegate=u_77221; cap=EUR 250,000';
        break;
      case 'EXPIRE_DELEGATION':
        beforeAfter = 'status: ACTIVE → EXPIRED; 3 pending steps rerouted';
        break;
      case 'REJECT_STEP':
        beforeAfter = 'decision: REJECT; reason="Out of category scope"';
        break;
      case 'UPDATE_SOD_RULE':
        beforeAfter = 'severity: High → Medium; reviewed by Compliance';
        break;
    }
    
    events.push({
      id: `evt-${1247 - i}`,
      time: `06 May ${15 - Math.floor(i / 2)}:${String(Math.max(2, 60 - i * 5)).padStart(2, '0')}`,
      actor,
      action,
      entity,
      entityType: entity.includes('Step') ? 'Approval' : entity.includes('Req') ? 'Request' : entity.includes('Policy') ? 'Policy' : entity.includes('Delegation') ? 'Delegation' : entity.includes('Rule') ? 'SoD Rule' : 'Notification',
      beforeAfter,
      hash: currentHash.substring(0, 4) + '...',
      prevHash: prevHash.substring(0, 4) + '...',
      fullBefore: { status: 'PENDING', approver: 'null' },
      fullAfter: { status: 'APPROVED', approver: actor, timestamp: new Date().toISOString() },
      severity: i % 3 === 0 ? 'Critical' : i % 3 === 1 ? 'High' : 'Medium',
      function: functions[i % functions.length],
    });
    
    prevHash = currentHash;
  }
  
  return events.reverse();
};

export default function AuditTrailSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-04-01');
  const [dateTo, setDateTo] = useState('2026-05-13');
  const [selectedEntity, setSelectedEntity] = useState('All');
  const [selectedFunction, setSelectedFunction] = useState('Procurement');
  const [selectedAction, setSelectedAction] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedActor, setSelectedActor] = useState('Anyone');
  const [hashChainStatus, setHashChainStatus] = useState('Verified ✓');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'broken' | null>('verified');
  
  const auditData = generateAuditTrail();
  const filteredData = auditData; // In real app, apply filters
  
  const handleVerifyIntegrity = () => {
    setIsVerifying(true);
    // Simulate 5s chain verification (FR-AUD: 100K events in 5s)
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStatus('verified');
    }, 2000);
  };
  
  const handleExportEvidence = () => {
    alert('Exporting evidence pack:\n\n✓ JSON event log\n✓ Signed PDF summary\n✓ SHA-256 manifest\n\nZIP file will be downloaded.');
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Trail Search</h1>
          <p className="text-sm text-gray-600 mt-1">Auditors' workbench — hash-chained events, tamper evidence, and evidence pack export</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleVerifyIntegrity}
            disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Verify Integrity
              </>
            )}
          </button>
          <button
            onClick={handleExportEvidence}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <FileArchive className="w-4 h-4" />
            Export Evidence Pack
          </button>
        </div>
      </div>

      {/* Search & Date Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by actor, action, entity, or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <span className="text-sm text-gray-500">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Filters:</span>

        {/* Entity Filter */}
        <select
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-medium hover:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option>All Entities</option>
          <option>Approval</option>
          <option>Request</option>
          <option>Policy</option>
          <option>Delegation</option>
          <option>SoD Rule</option>
          <option>Notification</option>
        </select>

        {/* Function Filter */}
        <select
          value={selectedFunction}
          onChange={(e) => setSelectedFunction(e.target.value)}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-medium hover:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option>All Functions</option>
          <option>Procurement</option>
          <option>Finance</option>
          <option>HR</option>
          <option>IT</option>
          <option>Legal</option>
          <option>Compliance</option>
        </select>

        {/* Action Filter */}
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-medium hover:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option>All Actions</option>
          <option>Approve, Reject</option>
          <option>Create, Update</option>
          <option>Submit</option>
          <option>System Actions</option>
        </select>

        {/* Severity Filter */}
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-medium hover:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        {/* Actor Filter */}
        <select
          value={selectedActor}
          onChange={(e) => setSelectedActor(e.target.value)}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-medium hover:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option>Anyone</option>
          <option>Lily Tan</option>
          <option>DoA Engine</option>
          <option>Priya M.</option>
          <option>Anna F. (CFO)</option>
          <option>S. Compliance</option>
        </select>

        {/* Hash Chain Status */}
        <div className="px-3 py-1.5 bg-green-50 border border-green-300 rounded-full text-xs font-medium text-green-700 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          {hashChainStatus}
        </div>
      </div>

      {/* Verification Status Banner */}
      {verificationStatus && !isVerifying && (
        <div className={`rounded-lg p-4 flex items-center gap-3 ${
          verificationStatus === 'verified'
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          {verificationStatus === 'verified' ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm font-semibold text-green-900">Chain integrity verified</div>
                <div className="text-xs text-green-700 mt-0.5">
                  Verified 1,247 events in 1.8s — No breaks detected — All hashes valid
                </div>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-sm font-semibold text-red-900">Chain break detected</div>
                <div className="text-xs text-red-700 mt-0.5">
                  Event evt-342 at offset +127 — Hash mismatch — Possible tampering
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-gray-900">Audit Events</h2>
            <span className="px-2 py-0.5 bg-gray-100 text-xs font-medium text-gray-700 rounded">
              {filteredData.length} events
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Showing events from Apr 1 to May 13, 2026
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-8 px-4 py-3"></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Entity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Before → After</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((event) => (
                <React.Fragment key={event.id}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === event.id ? null : event.id)}
                  >
                    <td className="px-4 py-3">
                      {expandedRow === event.id ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{event.time}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{event.actor}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        {event.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{event.entity}</div>
                      <div className="text-xs text-gray-500">{event.entityType}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono text-xs max-w-md truncate">
                      {event.beforeAfter}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-mono text-gray-600">{event.hash}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row Detail */}
                  {expandedRow === event.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="grid grid-cols-2 gap-6">
                          {/* Left: Before State */}
                          <div>
                            <div className="text-xs font-semibold text-gray-700 uppercase mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              Before State
                            </div>
                            <pre className="bg-white border border-gray-200 rounded p-3 text-xs font-mono text-gray-800 overflow-x-auto">
{JSON.stringify(event.fullBefore, null, 2)}
                            </pre>
                          </div>

                          {/* Right: After State */}
                          <div>
                            <div className="text-xs font-semibold text-gray-700 uppercase mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              After State
                            </div>
                            <pre className="bg-white border border-gray-200 rounded p-3 text-xs font-mono text-gray-800 overflow-x-auto">
{JSON.stringify(event.fullAfter, null, 2)}
                            </pre>
                          </div>
                        </div>

                        {/* Hash Chain Info */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-xs font-semibold text-gray-700 uppercase mb-2 flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5" />
                            Hash Chain
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <div className="text-gray-500 mb-1">Previous Hash</div>
                              <div className="font-mono text-gray-900 bg-white border border-gray-200 rounded px-2 py-1">
                                {event.prevHash}a1b2c3d4e5f6...
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500 mb-1">Current Hash</div>
                              <div className="font-mono text-gray-900 bg-white border border-gray-200 rounded px-2 py-1">
                                {event.hash}f9e8d7c6b5a4...
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-green-700">
                            <CheckCircle className="w-4 h-4" />
                            <span>Hash verified — Event is part of valid chain</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integrity Status Footer */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Chain integrity: Verified</div>
              <div className="text-xs text-gray-600 mt-0.5">
                All 1,247 events verified — No tampering detected — Last check: 2 minutes ago
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <div className="mb-1"><strong>Performance:</strong> 1M events in ≤60s (NFR-AUD-01)</div>
            <div><strong>Reproducibility:</strong> Identical scope = Identical hashes (FR-AUD-05)</div>
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900">
            <div className="font-semibold mb-1">Tamper-Evident Audit Trail</div>
            <ul className="space-y-1 text-xs text-blue-800">
              <li>• <strong>Hash-chained:</strong> Each event references the previous hash, creating a tamper-evident chain</li>
              <li>• <strong>Read access logged:</strong> Viewing sensitive entities is itself logged (FR-AUD-04)</li>
              <li>• <strong>Evidence pack:</strong> Exports include JSON log, signed PDF summary, and SHA-256 manifest</li>
              <li>• <strong>Reproducible:</strong> Same scope always produces identical hashes for verification</li>
              <li>• <strong>Performance:</strong> Chain verification of 1M events completes in ≤60s</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
