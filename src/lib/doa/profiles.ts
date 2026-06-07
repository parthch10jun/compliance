/**
 * Client Profiles — drive which DoA matrix layout + branding renders.
 *
 * The app ships both customer experiences in one deploy; the active profile
 * (persisted in localStorage) decides what the user sees. CRITICAL: when a
 * given profile is active, no other profile's branding may leak into the UI.
 */

export type ClientProfileId = 'jnbp' | 'sec';

export interface ClientProfile {
  id: ClientProfileId;
  /** Full organisation name (shown in matrix title, etc.). */
  name: string;
  /** Short label for chips / compact spaces. */
  shortName: string;
  /** Matrix landing layout style. */
  layout: 'cap-tier' | 'raci-grid';
  /** Title shown atop the matrix landing. */
  matrixTitle: string;
  /** Two-letter monogram for the switcher chip. */
  monogram: string;
  /** Accent color (hex) used for SEC's corporate blue, etc. */
  accent: string;
}

export const CLIENT_PROFILES: Record<ClientProfileId, ClientProfile> = {
  jnbp: {
    id: 'jnbp',
    name: 'JERA Nex bp',
    shortName: 'JNBP',
    layout: 'cap-tier',
    matrixTitle: 'JERA Nex bp DoA Matrix',
    monogram: 'JN',
    accent: '#F59E0B',
  },
  sec: {
    id: 'sec',
    name: 'Saudi Electricity Company',
    shortName: 'SEC',
    layout: 'raci-grid',
    matrixTitle: 'Authorization Matrix — Tier 1',
    monogram: 'SEC',
    accent: '#1B4B8F',
  },
};

export const PROFILE_IDS: ClientProfileId[] = ['jnbp', 'sec'];
export const DEFAULT_PROFILE: ClientProfileId = 'jnbp';
