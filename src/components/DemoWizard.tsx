'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDemoWizard } from '@/contexts/DemoWizardContext';
import {
  X, ChevronRight, ChevronLeft, Sparkles, Play, SkipForward,
  CheckCircle2, ArrowRight, ArrowDown, ArrowLeft, ArrowUp
} from 'lucide-react';
import clsx from 'clsx';

export default function DemoWizard() {
  const {
    isActive,
    currentTour,
    currentStepIndex,
    nextStep,
    previousStep,
    skipTour,
    progress,
  } = useDemoWizard();

  const router = useRouter();
  const pathname = usePathname();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = currentTour?.steps[currentStepIndex];
  const [isNavigating, setIsNavigating] = useState(false);

  // Navigate to route if step requires it
  useEffect(() => {
    if (currentStep?.route) {
      // Extract pathname from route (handle query params)
      const routePath = currentStep.route.split('?')[0];
      const needsNavigation = pathname !== routePath;

      if (needsNavigation) {
        setIsNavigating(true);
        router.push(currentStep.route);
      } else {
        setIsNavigating(false);
      }
    } else {
      setIsNavigating(false);
    }
  }, [currentStep, pathname, router]);

  // Find and highlight target element
  useEffect(() => {
    if (!isActive || !currentStep || isNavigating) return;

    // Wait a bit for the page to render after navigation
    const routePath = currentStep.route ? currentStep.route.split('?')[0] : null;
    const isOnRoutePage = routePath && pathname === routePath;
    const initialDelay = isOnRoutePage ? 500 : 100;

    const timeoutId = setTimeout(() => {
      let retryCount = 0;
      const maxRetries = 20; // Try for up to 2 seconds

      const findElement = () => {
        const element = document.querySelector(currentStep.targetSelector) as HTMLElement;
        if (element) {
          // Check if element is visible
          const rect = element.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0;

          if (isVisible) {
            setTargetElement(element);

            // Scroll element into view first
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });

            // Wait for scroll to complete, then update positions
            setTimeout(() => {
              const updatedRect = element.getBoundingClientRect();
              setHighlightRect(updatedRect);
              calculateTooltipPosition(updatedRect, currentStep.position);
            }, 300);
          } else if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(findElement, 100);
          }
        } else if (currentStep.waitForElement !== false && retryCount < maxRetries) {
          // Retry finding element (default behavior)
          retryCount++;
          setTimeout(findElement, 100);
        }
      };

      findElement();
    }, initialDelay);

    return () => clearTimeout(timeoutId);
  }, [isActive, currentStep, isNavigating, pathname]);

  const calculateTooltipPosition = (rect: DOMRect, position: string) => {
    const padding = 20;
    const tooltipWidth = currentStep?.tooltipWidth || 400;
    const tooltipHeight = 280; // Increased for better estimation

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top - tooltipHeight - padding;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + padding;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - padding;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + padding;
        break;
      case 'center':
        top = window.innerHeight / 2 - tooltipHeight / 2;
        left = window.innerWidth / 2 - tooltipWidth / 2;
        break;
    }

    // Aggressive viewport boundary checking
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Ensure tooltip doesn't overflow right edge
    if (left + tooltipWidth > viewportWidth - padding) {
      left = viewportWidth - tooltipWidth - padding;
    }

    // Ensure tooltip doesn't overflow left edge
    if (left < padding) {
      left = padding;
    }

    // Ensure tooltip doesn't overflow bottom edge
    if (top + tooltipHeight > viewportHeight - padding) {
      top = viewportHeight - tooltipHeight - padding;
    }

    // Ensure tooltip doesn't overflow top edge
    if (top < padding) {
      top = padding;
    }

    setTooltipPosition({ top, left });
  };

  // Recalculate positions on window resize
  useEffect(() => {
    if (!isActive || !targetElement || !currentStep) return;

    const handleResize = () => {
      const rect = targetElement.getBoundingClientRect();
      setHighlightRect(rect);
      calculateTooltipPosition(rect, currentStep.position);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive, targetElement, currentStep]);

  const getArrowComponent = () => {
    if (!currentStep?.arrowPosition) return null;

    const arrowClass = "absolute text-[var(--primary)] animate-bounce";
    const size = 32;

    switch (currentStep.arrowPosition) {
      case 'top':
        return <ArrowUp className={clsx(arrowClass, "-top-12 left-1/2 -translate-x-1/2")} size={size} />;
      case 'bottom':
        return <ArrowDown className={clsx(arrowClass, "-bottom-12 left-1/2 -translate-x-1/2")} size={size} />;
      case 'left':
        return <ArrowLeft className={clsx(arrowClass, "-left-12 top-1/2 -translate-y-1/2")} size={size} />;
      case 'right':
        return <ArrowRight className={clsx(arrowClass, "-right-12 top-1/2 -translate-y-1/2")} size={size} />;
    }
  };

  if (!isActive || !currentTour || !currentStep) return null;

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === currentTour.steps.length - 1;

  return (
    <>
      {/* Overlay with spotlight effect */}
      <div className="fixed inset-0 z-[9998] pointer-events-none">
        {/* Dark overlay with cutout for highlighted element */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {highlightRect && currentStep.position !== 'center' && (
                <rect
                  x={highlightRect.left - (currentStep.highlightPadding || 8)}
                  y={highlightRect.top - (currentStep.highlightPadding || 8)}
                  width={highlightRect.width + (currentStep.highlightPadding || 8) * 2}
                  height={highlightRect.height + (currentStep.highlightPadding || 8) * 2}
                  rx="12"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.7)"
            mask="url(#spotlight-mask)"
          />
        </svg>

        {/* Highlight border */}
        {highlightRect && currentStep.position !== 'center' && (
          <div
            className="absolute border-4 border-[var(--primary)] rounded-xl shadow-2xl animate-pulse-slow pointer-events-none"
            style={{
              top: highlightRect.top - (currentStep.highlightPadding || 8),
              left: highlightRect.left - (currentStep.highlightPadding || 8),
              width: highlightRect.width + (currentStep.highlightPadding || 8) * 2,
              height: highlightRect.height + (currentStep.highlightPadding || 8) * 2,
              boxShadow: '0 0 0 4px rgba(13, 148, 136, 0.2)',
            }}
          >
            {getArrowComponent()}
          </div>
        )}
      </div>

      {/* Tooltip Card */}
      <div
        ref={tooltipRef}
        className="fixed z-[9999] pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: currentStep.tooltipWidth || 400,
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-[var(--primary)] overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1.5 bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">
                    {currentStep.title}
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    Step {currentStepIndex + 1} of {currentTour.steps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={skipTour}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-6">
              {currentStep.description}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={skipTour}
                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1"
              >
                <SkipForward size={14} />
                Skip Tour
              </button>

              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <button
                    onClick={previousStep}
                    className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white hover:shadow-lg transition-all flex items-center gap-2"
                >
                  {isLastStep ? (
                    <>
                      <CheckCircle2 size={16} />
                      Finish
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

