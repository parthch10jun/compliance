/**
 * Profile-aware branding mask.
 *
 * The DoA modules (matrix sub-pages, change requests, delegations, glossary,
 * reports …) all read from the JNBP-seeded Authority Matrix. When the SEC
 * client profile is active we must never surface JERA Nex bp branding, so the
 * data-access layer runs every string it returns through this mask.
 *
 * The mask is applied at the read boundary (e.g. getMatrix) so individual
 * pages don't need to know about it. It is:
 *  - profile-gated  — only rewrites when the SEC profile is active;
 *  - non-mutating   — returns a deep clone, never touches the seed/store;
 *  - idempotent     — re-masking already-masked text is a no-op;
 *  - id-safe        — identifier/style keys (id, *Id, key, href, accent …) are
 *                     left untouched so referential integrity is preserved
 *                     (e.g. the internal matrix id "matrix-jnbp").
 */

// Replacement neutral brand (matches the SEC entity label used elsewhere).
const SEC_BRAND = 'Saudi Energy';

// Ordered most-specific → least-specific so compound names win before the
// bare "JERA" / "JNBP" fallbacks.
const BRAND_RULES: ReadonlyArray<readonly [RegExp, string]> = [
  [/JERA\s*Nex\s*bp/gi, SEC_BRAND],
  [/JERA\s*Nex/gi, SEC_BRAND],
  [/Snowmass\s+Holdings\s+Limited/gi, `${SEC_BRAND} Holdings`],
  [/Snowmass/gi, SEC_BRAND],
  [/\bJNBP\b/gi, SEC_BRAND],
  [/\bJERA\b/gi, SEC_BRAND],
];

/** Rewrite brand tokens in a single string. Safe to call on any text. */
export function maskBrandingText(input: string): string {
  let out = input;
  for (const [re, replacement] of BRAND_RULES) out = out.replace(re, replacement);
  return out;
}

// Keys whose values are identifiers / styling tokens, not human-readable copy.
// We never rewrite these (or anything nested under them) to avoid corrupting
// ids, enum values, colors, etc.
const SKIP_KEYS = new Set([
  'id', 'key', 'slug', 'href', 'url', 'icon', 'color', 'accent', 'monogram',
  'status', 'changeType', 'type', 'permission', 'role', 'roleKey',
]);

const isSkippableKey = (k: string): boolean => SKIP_KEYS.has(k) || /Id$/.test(k);

/**
 * Deep-clone `value`, rewriting brand tokens in every human-readable string.
 * Identifier/style keys (see SKIP_KEYS) are copied through verbatim.
 */
export function maskBrandingDeep<T>(value: T): T {
  if (typeof value === 'string') {
    return maskBrandingText(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map(v => maskBrandingDeep(v)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = isSkippableKey(k) ? v : maskBrandingDeep(v);
    }
    return out as T;
  }
  return value;
}

/**
 * Whether branding should currently be masked — true only when the SEC client
 * profile is active. Reads localStorage directly (the store layer is already
 * browser-only). Mirrors the key used by useClientProfile.
 */
export function shouldMaskBranding(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem('doa_client_profile') === 'sec';
  } catch {
    return false;
  }
}

/** Convenience: mask `value` iff the SEC profile is active, else return as-is. */
export function maskBrandingIfSEC<T>(value: T): T {
  return shouldMaskBranding() ? maskBrandingDeep(value) : value;
}
