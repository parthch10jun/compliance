'use client';

/**
 * Policy State Machine Visualizer
 * Implements BR-POL-02 - Visual state flow with transition validation
 */

import { CheckCircle, Clock, FileCheck, Zap, Archive, AlertCircle, ArrowRight } from 'lucide-react';
import type { PolicyState, DoAPolicy } from '@/lib/doa/types/policy-types';
import { canTransitionState } from '@/lib/doa/types/policy-types';

interface PolicyStateMachineProps {
  policy: DoAPolicy;
  onTransition?: (toState: PolicyState) => void;
}

export default function PolicyStateMachine({ policy, onTransition }: PolicyStateMachineProps) {
  const currentState = policy.state;
  
  const states: { state: PolicyState; label: string; icon: any; color: string }[] = [
    { state: 'draft', label: 'Draft', icon: FileCheck, color: 'gray' },
    { state: 'in_review', label: 'In Review', icon: Clock, color: 'blue' },
    { state: 'approved', label: 'Approved', icon: CheckCircle, color: 'green' },
    { state: 'effective', label: 'Effective', icon: Zap, color: 'amber' },
    { state: 'superseded', label: 'Superseded', icon: Archive, color: 'orange' },
    { state: 'archived', label: 'Archived', icon: Archive, color: 'slate' },
  ];
  
  const currentIndex = states.findIndex(s => s.state === currentState);
  
  const getStateColor = (state: PolicyState, type: 'bg' | 'text' | 'border' = 'bg') => {
    const stateData = states.find(s => s.state === state);
    if (!stateData) return '';
    
    const colorMap = {
      gray: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
      green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
      slate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
    };
    
    return colorMap[stateData.color as keyof typeof colorMap][type];
  };
  
  const canTransition = (toState: PolicyState): boolean => {
    const transition = canTransitionState(currentState, toState);
    return transition !== null && transition.allowed;
  };
  
  const handleTransition = (toState: PolicyState) => {
    if (!canTransition(toState)) {
      alert(`Cannot transition from ${currentState} to ${toState}`);
      return;
    }
    onTransition?.(toState);
  };
  
  return (
    <div className="space-y-6">
      {/* Current State Banner */}
      <div className={`p-4 rounded-lg border-2 ${getStateColor(currentState, 'border')} ${getStateColor(currentState, 'bg')}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {states.map(s => {
              if (s.state === currentState) {
                const Icon = s.icon;
                return (
                  <div key={s.state} className="flex items-center gap-2">
                    <Icon className={`w-6 h-6 ${getStateColor(currentState, 'text')}`} />
                    <div>
                      <div className={`text-sm font-semibold ${getStateColor(currentState, 'text')}`}>
                        Current State
                      </div>
                      <div className={`text-lg font-bold ${getStateColor(currentState, 'text')}`}>
                        {s.label}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
          
          {policy.metadata.isHotfix && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 border border-red-300 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">HOTFIX</span>
              {policy.metadata.hotfixExpiryDate && (
                <span className="text-xs text-red-600">
                  Expires: {new Date(policy.metadata.hotfixExpiryDate).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Visual State Flow */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Lifecycle</h3>
        
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded" />
          
          {/* Progress Bar Fill */}
          <div 
            className="absolute top-5 left-0 h-1 bg-amber-500 rounded transition-all duration-500"
            style={{ width: `${(currentIndex / (states.length - 1)) * 100}%` }}
          />
          
          {/* State Nodes */}
          <div className="relative flex justify-between">
            {states.map((stateData, index) => {
              const Icon = stateData.icon;
              const isActive = stateData.state === currentState;
              const isPast = index < currentIndex;
              const isFuture = index > currentIndex;
              
              return (
                <div key={stateData.state} className="flex flex-col items-center" style={{ width: '16.66%' }}>
                  {/* Node Circle */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10
                    ${isActive ? `${getStateColor(stateData.state, 'bg')} ${getStateColor(stateData.state, 'border')} ring-4 ring-amber-200` :
                      isPast ? 'bg-green-100 border-green-500' :
                      'bg-white border-gray-300'}
                  `}>
                    <Icon className={`w-5 h-5 ${
                      isActive ? getStateColor(stateData.state, 'text') :
                      isPast ? 'text-green-600' :
                      'text-gray-400'
                    }`} />
                  </div>
                  
                  {/* Label */}
                  <div className={`mt-2 text-xs font-medium text-center ${
                    isActive ? 'text-gray-900' :
                    isPast ? 'text-green-700' :
                    'text-gray-500'
                  }`}>
                    {stateData.label}
                  </div>
                  
                  {/* Transition Button */}
                  {isFuture && index === currentIndex + 1 && canTransition(stateData.state) && (
                    <button
                      onClick={() => handleTransition(stateData.state)}
                      className="mt-2 px-3 py-1 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-1"
                    >
                      <ArrowRight className="w-3 h-3" />
                      Transition
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* State History */}
      {policy.stateHistory && policy.stateHistory.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">State History</h3>
          
          <div className="space-y-3">
            {policy.stateHistory.map((history, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {history.fromState} → {history.toState}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(history.changedDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    By: {history.changedBy} - {history.reason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
