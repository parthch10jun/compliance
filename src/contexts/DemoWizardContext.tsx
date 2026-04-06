'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface DemoStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string; // CSS selector for element to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  arrowPosition?: 'top' | 'bottom' | 'left' | 'right';
  route?: string; // Navigate to this route before showing step
  action?: () => void; // Optional action to perform
  waitForElement?: boolean; // Wait for element to appear
  highlightPadding?: number; // Padding around highlighted element
  tooltipWidth?: number; // Custom tooltip width
}

export interface DemoTour {
  id: string;
  name: string;
  description: string;
  category: 'getting-started' | 'programs' | 'requirements' | 'controls' | 'workflows' | 'advanced';
  estimatedTime: string; // e.g., "3 min"
  steps: DemoStep[];
  icon?: string;
}

interface DemoWizardContextType {
  isActive: boolean;
  currentTour: DemoTour | null;
  currentStepIndex: number;
  startTour: (tour: DemoTour) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  goToStep: (index: number) => void;
  progress: number; // 0-100
}

const DemoWizardContext = createContext<DemoWizardContextType | undefined>(undefined);

export function DemoWizardProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentTour, setCurrentTour] = useState<DemoTour | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const startTour = useCallback((tour: DemoTour) => {
    setCurrentTour(tour);
    setCurrentStepIndex(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    if (!currentTour) return;
    
    if (currentStepIndex < currentTour.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTour();
    }
  }, [currentTour, currentStepIndex]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    setCurrentTour(null);
    setCurrentStepIndex(0);
  }, []);

  const completeTour = useCallback(() => {
    setIsActive(false);
    setCurrentTour(null);
    setCurrentStepIndex(0);
    // Could trigger confetti or completion animation here
  }, []);

  const goToStep = useCallback((index: number) => {
    if (!currentTour) return;
    if (index >= 0 && index < currentTour.steps.length) {
      setCurrentStepIndex(index);
    }
  }, [currentTour]);

  const progress = currentTour 
    ? ((currentStepIndex + 1) / currentTour.steps.length) * 100 
    : 0;

  return (
    <DemoWizardContext.Provider
      value={{
        isActive,
        currentTour,
        currentStepIndex,
        startTour,
        nextStep,
        previousStep,
        skipTour,
        completeTour,
        goToStep,
        progress,
      }}
    >
      {children}
    </DemoWizardContext.Provider>
  );
}

export function useDemoWizard() {
  const context = useContext(DemoWizardContext);
  if (context === undefined) {
    throw new Error('useDemoWizard must be used within a DemoWizardProvider');
  }
  return context;
}

