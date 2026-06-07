'use client';

/**
 * useClientProfile — the active customer experience (JNBP cap-tier vs SEC
 * RACI grid). Mirrors the useCurrentUser pattern: localStorage-backed,
 * cross-component sync via a window event.
 */

import { useEffect, useState } from 'react';
import {
  CLIENT_PROFILES, DEFAULT_PROFILE,
  type ClientProfile, type ClientProfileId,
} from '../profiles';

const STORAGE_KEY = 'doa_client_profile';
const EVENT = 'doa-client-profile-changed';

export function setClientProfileId(id: ClientProfileId): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, id);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: id }));
}

function readProfileId(): ClientProfileId {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved && saved in CLIENT_PROFILES ? (saved as ClientProfileId) : DEFAULT_PROFILE;
}

export function useClientProfile(): {
  profile: ClientProfile;
  profileId: ClientProfileId;
  setProfile: (id: ClientProfileId) => void;
} {
  const [id, setId] = useState<ClientProfileId>(DEFAULT_PROFILE);

  useEffect(() => {
    setId(readProfileId());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === 'string' && detail in CLIENT_PROFILES) {
        setId(detail as ClientProfileId);
      }
    };
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  return {
    profile: CLIENT_PROFILES[id],
    profileId: id,
    setProfile: setClientProfileId,
  };
}
