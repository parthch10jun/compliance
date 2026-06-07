'use client';

/**
 * DoA Integrations — connector-permissions UI.
 *
 * Left rail: the systems a DoA programme connects to (SAP ERP, GRC,
 * SuccessFactors, Ariba, DocuSign, M365, ServiceNow), grouped by connection
 * state. Right pane: the selected system's blurb, connect/disconnect, and
 * per-tool allow / ask / deny permissions split into read-only and
 * write/sync. All toggle + connection state persists to localStorage.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Check, Hand, Ban, Plug, PlugZap, Search } from 'lucide-react';
import {
  INTEGRATIONS, getConnections, isConnected, setConnected,
  getToolPermission, setToolPermission,
  type Integration, type IntegrationTool, type ToolPermission,
} from '@/lib/doa/integrations';

export default function IntegrationsPage() {
  const [selectedId, setSelectedId] = useState<string>(INTEGRATIONS[0].id);
  const [query, setQuery] = useState('');
  // bump to force re-read of localStorage after a mutation
  const [tick, setTick] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  const connections = useMemo(() => (ready ? getConnections() : {}), [ready, tick]);
  const connectedOf = (i: Integration) =>
    i.id in connections ? connections[i.id] : i.defaultConnected;

  const filtered = useMemo(() => {
    if (!query.trim()) return INTEGRATIONS;
    const q = query.toLowerCase();
    return INTEGRATIONS.filter(i => `${i.name} ${i.vendor} ${i.category}`.toLowerCase().includes(q));
  }, [query]);

  const connectedList = filtered.filter(connectedOf);
  const availableList = filtered.filter(i => !connectedOf(i));

  const selected = INTEGRATIONS.find(i => i.id === selectedId)!;
  const selectedConnected = connectedOf(selected);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Settings</div>
        <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
        <p className="text-sm text-gray-600 mt-0.5">
          Connect the DoA programme to your core systems and control exactly what each one is allowed to do.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Left rail */}
        <div className="col-span-4 lg:col-span-3 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search integrations…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <RailGroup label="Connected" items={connectedList} selectedId={selectedId} onSelect={setSelectedId} connected />
          <RailGroup label="Available" items={availableList} selectedId={selectedId} onSelect={setSelectedId} connected={false} />
        </div>

        {/* Right pane */}
        <div className="col-span-8 lg:col-span-9">
          <div className="bg-white border border-gray-200 rounded-lg">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="w-11 h-11 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: selected.accent }}>
                  {selected.monogram}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">{selected.name}</h2>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{selected.category}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 max-w-2xl">{selected.blurb}</p>
                </div>
              </div>
              <button
                onClick={() => { setConnected(selected.id, !selectedConnected); setTick(t => t + 1); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium flex-shrink-0 ${
                  selectedConnected
                    ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                {selectedConnected ? <><Plug className="w-4 h-4" />Disconnect</> : <><PlugZap className="w-4 h-4" />Connect</>}
              </button>
            </div>

            {/* Tool permissions */}
            <div className="p-5">
              {!selectedConnected ? (
                <div className="text-center py-10">
                  <PlugZap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Connect {selected.name} to configure what it can read and write.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Tool permissions</h3>
                  <p className="text-xs text-gray-500 mb-4">Choose when {selected.name} is allowed to use these tools.</p>

                  <ToolGroup
                    title="Read-only tools"
                    count={selected.readTools.length}
                    integrationId={selected.id}
                    tools={selected.readTools}
                    onChange={() => setTick(t => t + 1)}
                  />
                  <div className="h-5" />
                  <ToolGroup
                    title="Write / sync tools"
                    count={selected.writeTools.length}
                    integrationId={selected.id}
                    tools={selected.writeTools}
                    onChange={() => setTick(t => t + 1)}
                    sensitive
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Left-rail group
// ===========================================================================

function RailGroup({
  label, items, selectedId, onSelect, connected,
}: {
  label: string;
  items: Integration[];
  selectedId: string;
  onSelect: (id: string) => void;
  connected: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 px-1 mb-1">{label}</div>
      <ul className="space-y-0.5">
        {items.map(i => (
          <li key={i.id}>
            <button
              onClick={() => onSelect(i.id)}
              className={`w-full flex items-center gap-2.5 px-2 py-2 rounded text-left transition-colors ${
                selectedId === i.id ? 'bg-amber-50 ring-1 ring-amber-200' : 'hover:bg-gray-50'
              }`}
            >
              <span className="w-7 h-7 rounded flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                style={{ backgroundColor: i.accent }}>
                {i.monogram}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-gray-900 truncate">{i.name}</span>
                <span className="block text-[10px] text-gray-500">{i.category}</span>
              </span>
              {connected && <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ===========================================================================
// Tool group + per-tool permission control
// ===========================================================================

function ToolGroup({
  title, count, integrationId, tools, onChange, sensitive = false,
}: {
  title: string;
  count: number;
  integrationId: string;
  tools: IntegrationTool[];
  onChange: () => void;
  sensitive?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <span className="text-xs text-gray-400 bg-gray-100 rounded px-1.5">{count}</span>
        </div>
        {sensitive && (
          <span className="flex items-center gap-1 text-[11px] text-amber-700">
            <Hand className="w-3 h-3" />Defaults to "ask"
          </span>
        )}
      </div>
      <ul className="divide-y divide-gray-100 border border-gray-100 rounded">
        {tools.map(tool => (
          <ToolRow key={tool.id} integrationId={integrationId} tool={tool} onChange={onChange} />
        ))}
      </ul>
    </div>
  );
}

function ToolRow({
  integrationId, tool, onChange,
}: { integrationId: string; tool: IntegrationTool; onChange: () => void }) {
  const [perm, setPerm] = useState<ToolPermission>(tool.defaultPermission);

  useEffect(() => {
    setPerm(getToolPermission(integrationId, tool));
  }, [integrationId, tool]);

  const set = (p: ToolPermission) => {
    setToolPermission(integrationId, tool.id, p);
    setPerm(p);
    onChange();
  };

  return (
    <li className="flex items-center justify-between gap-3 px-3 py-2.5">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-mono text-gray-800">{tool.label}</div>
        <div className="text-xs text-gray-500">{tool.description}</div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <PermBtn active={perm === 'allow'} onClick={() => set('allow')} title="Allow"
          icon={<Check className="w-4 h-4" />} activeCls="bg-green-100 text-green-700" />
        <PermBtn active={perm === 'ask'} onClick={() => set('ask')} title="Ask each time"
          icon={<Hand className="w-4 h-4" />} activeCls="bg-amber-100 text-amber-700" />
        <PermBtn active={perm === 'deny'} onClick={() => set('deny')} title="Deny"
          icon={<Ban className="w-4 h-4" />} activeCls="bg-red-100 text-red-700" />
      </div>
    </li>
  );
}

function PermBtn({
  active, onClick, title, icon, activeCls,
}: { active: boolean; onClick: () => void; title: string; icon: React.ReactNode; activeCls: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${active ? activeCls : 'text-gray-300 hover:text-gray-500 hover:bg-gray-50'}`}
    >
      {icon}
    </button>
  );
}
