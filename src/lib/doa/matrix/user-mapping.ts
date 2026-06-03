/**
 * Map demo users → canonical matrix role IDs.
 *
 * The matrix has 54 specific role columns (JNBP's canonical org); our user
 * cast covers the C-suite + a handful of directors. Where a user doesn't
 * cleanly map to a matrix role we return null and the matrix lookups treat
 * them as "no matrix authority".
 */

import type { DoAUser } from '../types/doa-types';

const USER_TO_MATRIX_ROLE: Record<string, string> = {
  'user-101': 'role-ceo',                                  // Kundan Verma
  'user-102': 'role-coo',                                  // Subhash Iyer
  'user-103': 'role-cto',                                  // Anurag Kapoor
  'user-104': 'role-cfo',                                  // Ritu Bansal
  'user-105': 'role-svp-hr',                               // Vikram Joshi → SVP HR
  'user-106': 'role-head-of-digital-it',                   // Deepak Sharma → Head of Digital/IT (CISO proxy)
  'user-107': 'role-head-of-investment-governance-and-ir', // Priya Nair → Head of Investment Governance & IR
  'user-108': 'role-head-of-finance-operations-deputy-cfo',// Arjun Mehta → Deputy CFO equivalent
  'user-109': 'role-head-of-procurement',                  // Neha Reddy → Head of Procurement
  'user-110': 'role-svp-legal-general-counsel',            // Sanjay Gupta → SVP Legal / GC
};

export function getMatrixRoleIdForUser(user: DoAUser): string | null {
  return USER_TO_MATRIX_ROLE[user.id] ?? null;
}
