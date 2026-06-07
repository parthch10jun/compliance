'use client';

/**
 * Discrete client-profile switcher.
 *
 * Renders a small, unlabeled icon button in the top bar. Clicking reveals
 * the available customer experiences. Intentionally low-key so a customer
 * glancing at the screen doesn't see another customer's name — the names
 * only appear inside the dropdown when the presenter opens it.
 */

import React, { useState } from 'react';
import { Layers, Check } from 'lucide-react';
import { useClientProfile } from '@/lib/doa/hooks/useClientProfile';
import { CLIENT_PROFILES, PROFILE_IDS } from '@/lib/doa/profiles';

export default function ProfileSwitcher() {
  const { profileId, setProfile } = useClientProfile();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        title="Workspace"
        aria-label="Switch workspace"
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Layers className="w-5 h-5 text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                Workspace
              </div>
            </div>
            <div className="p-1.5">
              {PROFILE_IDS.map(id => {
                const p = CLIENT_PROFILES[id];
                const active = id === profileId;
                return (
                  <button
                    key={id}
                    onClick={() => { setProfile(id); setOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-2 py-2 rounded text-left hover:bg-gray-50 ${active ? 'bg-gray-50' : ''}`}
                  >
                    <span
                      className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: p.accent }}
                    >
                      {p.monogram}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-gray-900 truncate">{p.name}</span>
                      <span className="block text-[11px] text-gray-500">{p.layout === 'raci-grid' ? 'Authorization matrix' : 'Delegation matrix'}</span>
                    </span>
                    {active && <Check className="w-4 h-4 text-gray-700 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
