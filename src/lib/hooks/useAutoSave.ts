// Auto-Save Hook
// Requirements: RM_MR_22 (Regular auto-save), RM_MR_23 (Save/cancel before logout)

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AUTO_SAVE_CONFIG } from '@/lib/data/validation';

interface UseAutoSaveOptions {
  data: any;
  onSave: (data: any) => void | Promise<void>;
  interval?: number; // seconds
  enabled?: boolean;
  entityType?: string;
  entityId?: string;
}

interface AutoSaveState {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  saveCount: number;
  error: string | null;
}

export function useAutoSave({
  data,
  onSave,
  interval = AUTO_SAVE_CONFIG.interval,
  enabled = AUTO_SAVE_CONFIG.enabled,
  entityType = 'Unknown',
  entityId = 'new'
}: UseAutoSaveOptions) {
  const [state, setState] = useState<AutoSaveState>({
    lastSaved: null,
    isSaving: false,
    hasUnsavedChanges: false,
    saveCount: 0,
    error: null
  });

  const dataRef = useRef(data);
  const initialDataRef = useRef(JSON.stringify(data));
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // RM_MR_22: Auto-save at regular intervals
  const performAutoSave = useCallback(async () => {
    if (!enabled || state.isSaving) return;

    setState(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      await onSave(dataRef.current);
      
      setState(prev => ({
        ...prev,
        lastSaved: new Date(),
        isSaving: false,
        hasUnsavedChanges: false,
        saveCount: prev.saveCount + 1
      }));

      // Update initial data reference after successful save
      initialDataRef.current = JSON.stringify(dataRef.current);

      if (AUTO_SAVE_CONFIG.showNotification) {
        console.log(`[Auto-Save] ${entityType} saved successfully at ${new Date().toLocaleTimeString()}`);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: error instanceof Error ? error.message : 'Auto-save failed'
      }));
      console.error('[Auto-Save] Error:', error);
    }
  }, [enabled, onSave, state.isSaving, entityType]);

  // Track data changes
  useEffect(() => {
    dataRef.current = data;
    
    // Check if data has changed from initial
    const currentDataStr = JSON.stringify(data);
    const hasChanges = currentDataStr !== initialDataRef.current;
    
    setState(prev => ({
      ...prev,
      hasUnsavedChanges: hasChanges
    }));

    // Schedule auto-save if data changed
    if (hasChanges && enabled) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        performAutoSave();
      }, interval * 1000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, enabled, interval, performAutoSave]);

  // RM_MR_23: Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.hasUnsavedChanges]);

  // Manual save function
  const saveNow = useCallback(async () => {
    await performAutoSave();
  }, [performAutoSave]);

  // Mark as saved (useful when parent component saves)
  const markAsSaved = useCallback(() => {
    setState(prev => ({
      ...prev,
      lastSaved: new Date(),
      hasUnsavedChanges: false
    }));
    initialDataRef.current = JSON.stringify(dataRef.current);
  }, []);

  return {
    ...state,
    saveNow,
    markAsSaved,
    timeSinceLastSave: state.lastSaved 
      ? Math.floor((Date.now() - state.lastSaved.getTime()) / 1000)
      : null
  };
}

// Hook for form validation with unsaved changes warning
export function useFormWithAutoSave<T extends Record<string, any>>(
  initialData: T,
  onSave: (data: T) => void | Promise<void>,
  options?: Partial<UseAutoSaveOptions>
) {
  const [formData, setFormData] = useState<T>(initialData);

  const autoSave = useAutoSave({
    data: formData,
    onSave,
    ...options
  });

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateFields = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    autoSave.markAsSaved();
  }, [initialData, autoSave]);

  return {
    formData,
    updateField,
    updateFields,
    resetForm,
    autoSave
  };
}
