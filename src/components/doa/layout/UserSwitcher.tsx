'use client';

import React, { useState } from 'react';
import { ChevronDown, UserCircle } from 'lucide-react';
import { useCurrentUser } from '@/lib/doa/hooks/useCurrentUser';
import { mockUsers } from '@/lib/doa/data/mockUsers';

const DEMO_USER_IDS = [
  'user-107', // Priya Nair — Creator
  'user-101', // Kundan Verma — CEO (Approval Authority)
  'user-104', // Ritu Bansal — CFO
  'user-102', // Subhash Iyer — COO
  'user-103', // Anurag Kapoor — CTO
  'user-105', // Vikram Joshi — CHRO
  'user-106', // Deepak Sharma — CISO
  'user-110', // Sanjay Gupta — Legal
];

export default function UserSwitcher() {
  const { user, setUserId } = useCurrentUser();
  const [open, setOpen] = useState(false);

  const demoUsers = DEMO_USER_IDS
    .map(id => mockUsers.find(u => u.id === id))
    .filter((u): u is NonNullable<typeof u> => Boolean(u));

  const otherUsers = mockUsers.filter(u => !DEMO_USER_IDS.includes(u.id));

  const initials = user.name
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-semibold">
          {initials}
        </div>
        <div className="text-left">
          <div className="text-xs font-medium text-gray-900 leading-tight">{user.name}</div>
          <div className="text-[10px] text-gray-500 leading-tight">{user.role}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-[28rem] overflow-y-auto">
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Act as (demo)
              </div>
            </div>
            <div className="px-1.5 py-1.5">
              <div className="text-[10px] uppercase tracking-wide text-gray-400 px-2 py-1">Demo cast</div>
              {demoUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => { setUserId(u.id); setOpen(false); }}
                  className={`w-full flex items-start gap-2.5 px-2 py-2 rounded text-left hover:bg-gray-50 ${u.id === user.id ? 'bg-amber-50' : ''}`}
                >
                  <UserCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{u.name}</div>
                    <div className="text-xs text-gray-500 truncate">{u.role}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 flex flex-wrap gap-1">
                      {u.canCreateDelegations && (
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">can create</span>
                      )}
                      {u.canApproveDelegations && (
                        <span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded">can approve</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {otherUsers.length > 0 && (
                <>
                  <div className="text-[10px] uppercase tracking-wide text-gray-400 px-2 py-1 mt-2 border-t border-gray-100 pt-2">
                    Other users ({otherUsers.length})
                  </div>
                  {otherUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => { setUserId(u.id); setOpen(false); }}
                      className={`w-full flex items-start gap-2.5 px-2 py-1.5 rounded text-left hover:bg-gray-50 ${u.id === user.id ? 'bg-amber-50' : ''}`}
                    >
                      <UserCircle className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-700 truncate">{u.name}</div>
                        <div className="text-[10px] text-gray-500 truncate">{u.role}</div>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
