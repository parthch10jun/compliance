/**
 * Delegation Rule Store
 *
 * localStorage-backed persistence for DelegationRule records.
 * Read-side merges localStorage (user-created/modified) on top of the seed.
 * Write-side updates localStorage; a modified seed record is copied in on first
 * write so subsequent reads return the user-modified version.
 */

import type { AuditEntry, DelegationRule } from '../types/delegation-rule-types';
import { seedDelegationRules } from '../data/mockDelegationRules';

const STORAGE_KEY = 'doa_delegation_rules_v2';

type Store = Record<string, DelegationRule>;

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

export function listDelegationRules(): DelegationRule[] {
  const store = readStore();
  const merged: DelegationRule[] = [];
  const seenIds = new Set<string>();

  Object.values(store).forEach(rule => {
    merged.push(rule);
    seenIds.add(rule.id);
  });
  seedDelegationRules.forEach(rule => {
    if (!seenIds.has(rule.id)) merged.push(rule);
  });

  return merged.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getDelegationRuleById(id: string): DelegationRule | undefined {
  const store = readStore();
  if (store[id]) return store[id];
  return seedDelegationRules.find(rule => rule.id === id);
}

export function saveDelegationRule(rule: DelegationRule): void {
  const store = readStore();
  store[rule.id] = rule;
  writeStore(store);
}

export function deleteDelegationRule(id: string): void {
  const store = readStore();
  delete store[id];
  writeStore(store);
}

export function resetDelegationRules(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function appendAuditEntry(ruleId: string, entry: AuditEntry): void {
  const rule = getDelegationRuleById(ruleId);
  if (!rule) return;
  saveDelegationRule({
    ...rule,
    auditTrail: [...rule.auditTrail, entry],
  });
}

export function generateDelegationRuleId(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 7);
  return `dr-${t}-${r}`;
}

export function generateAuditEntryId(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 7);
  return `au-${t}-${r}`;
}
