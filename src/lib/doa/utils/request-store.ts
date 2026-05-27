/**
 * Delegation Request Store
 *
 * localStorage-backed persistence for runtime DelegationRequest records.
 * Read-side merges localStorage on top of the seed; write-side updates
 * localStorage so user actions persist across reloads.
 */

import type { DelegationRequest } from '../types/request-types';
import { seedDelegationRequests } from '../data/mockRequests';

const STORAGE_KEY = 'doa_delegation_requests_v1';

type Store = Record<string, DelegationRequest>;

const isBrowser = (): boolean => typeof window !== 'undefined';

function readStore(): Store {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function writeStore(store: Store): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function listDelegationRequests(): DelegationRequest[] {
  const store = readStore();
  const merged: DelegationRequest[] = [];
  const seen = new Set<string>();
  Object.values(store).forEach(req => {
    merged.push(req);
    seen.add(req.id);
  });
  seedDelegationRequests.forEach(req => {
    if (!seen.has(req.id)) merged.push(req);
  });
  return merged.sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
}

export function getDelegationRequestById(id: string): DelegationRequest | undefined {
  const store = readStore();
  if (store[id]) return store[id];
  return seedDelegationRequests.find(r => r.id === id);
}

export function saveDelegationRequest(req: DelegationRequest): void {
  const store = readStore();
  store[req.id] = req;
  writeStore(store);
}

export function resetDelegationRequests(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function generateRequestId(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 7);
  return `req-${t}-${r}`;
}
