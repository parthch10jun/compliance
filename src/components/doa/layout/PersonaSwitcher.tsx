'use client';

/**
 * Persona Switcher Component
 * Allows switching between different user personas for demo
 */

import React, { useState } from 'react';
import { Users, ChevronDown, Check } from 'lucide-react';
import { usePersona } from '@/contexts/PersonaContext';
import type { UserPersona } from '@/lib/doa/types/personas';
import { PERSONA_DEFINITIONS } from '@/lib/doa/types/personas';

export default function PersonaSwitcher() {
  const { currentPersona, setPersona, permissions } = usePersona();
  const [isOpen, setIsOpen] = useState(false);
  
  const personas: UserPersona[] = [
    'DoA Administrator',
    'Policy Owner / Compliance',
    'Approver (Manager → Board)',
    'Originator / Requester',
    'Internal Auditor',
    'Risk Officer',
    'Integrator / IT Admin',
    'Executive / Board',
  ];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Users className="w-4 h-4 text-gray-600" />
        <div className="text-left">
          <div className="text-xs text-gray-500">Viewing as:</div>
          <div className="text-sm font-medium text-gray-900">{permissions.displayName}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-3 border-b border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Switch Persona
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Select a role to view different permissions
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto p-2">
              {personas.map((persona) => {
                const def = PERSONA_DEFINITIONS[persona];
                const isSelected = persona === currentPersona;
                
                return (
                  <button
                    key={persona}
                    onClick={() => {
                      setPersona(persona);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-amber-50 border border-amber-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${isSelected ? 'text-[#F59E0B]' : 'text-gray-900'}`}>
                          {def.displayName}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {def.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {def.primaryActions.slice(0, 2).join(' • ')}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#F59E0B] flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="text-xs text-gray-600">
                <span className="font-medium">Current permissions:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {permissions.primaryActions.map((action, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white border border-gray-200"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
