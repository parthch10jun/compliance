'use client';

/**
 * Persona Context
 * Manages current user persona for role-based views
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserPersona, PersonaPermissions } from '@/lib/doa/types/personas';
import { PERSONA_DEFINITIONS } from '@/lib/doa/types/personas';

interface PersonaContextType {
  currentPersona: UserPersona;
  setPersona: (persona: UserPersona) => void;
  permissions: PersonaPermissions;
  hasPermission: (permission: keyof PersonaPermissions['permissions']) => boolean;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<UserPersona>('Approver (Manager → Board)');
  
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('doa_current_persona');
    if (saved && saved in PERSONA_DEFINITIONS) {
      setCurrentPersona(saved as UserPersona);
    }
  }, []);
  
  const setPersona = (persona: UserPersona) => {
    setCurrentPersona(persona);
    localStorage.setItem('doa_current_persona', persona);
  };
  
  const permissions = PERSONA_DEFINITIONS[currentPersona];
  
  const hasPermission = (permission: keyof PersonaPermissions['permissions']) => {
    return permissions.permissions[permission] === true;
  };
  
  return (
    <PersonaContext.Provider value={{ currentPersona, setPersona, permissions, hasPermission }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within PersonaProvider');
  }
  return context;
}
