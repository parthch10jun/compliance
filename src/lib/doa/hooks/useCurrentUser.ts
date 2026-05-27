'use client';

/**
 * useCurrentUser — current logged-in user identity for the DoA module.
 *
 * Separate from PersonaContext (which is role-based). This hook drives
 * "act as" persona switching by userId so the demo can walk through
 * the creator, chain designees, and the approval authority POVs.
 *
 * Synchronisation: setCurrentUserId writes localStorage and fires a
 * window event so other components using this hook re-render.
 */

import { useEffect, useState } from 'react';
import { getUserById, mockUsers } from '../data/mockUsers';
import type { DoAUser } from '../types/doa-types';

const STORAGE_KEY = 'doa_current_user_id';
const EVENT = 'doa-current-user-changed';
const DEFAULT_USER_ID = 'user-107'; // Priya Nair, Head of Governance & Compliance

function readUserId(): string {
  if (typeof window === 'undefined') return DEFAULT_USER_ID;
  return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_USER_ID;
}

export function setCurrentUserId(userId: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, userId);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: userId }));
}

export function useCurrentUser(): {
  user: DoAUser;
  userId: string;
  setUserId: (id: string) => void;
} {
  const [userId, setUserIdState] = useState<string>(DEFAULT_USER_ID);

  useEffect(() => {
    setUserIdState(readUserId());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === 'string') setUserIdState(detail);
    };
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  const user =
    getUserById(userId) ?? getUserById(DEFAULT_USER_ID) ?? mockUsers[0];

  const setUserId = (id: string) => setCurrentUserId(id);

  return { user, userId: user.id, setUserId };
}
