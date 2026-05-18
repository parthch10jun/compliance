'use client';

/**
 * Visual Workflow Designer
 * Drag-and-drop workflow builder with sequential, parallel, and conditional paths
 */

import { useState } from 'react';
import { 
  Plus, Trash2, GitBranch, Users, Clock, 
  AlertCircle, ArrowRight, ChevronDown, Settings,
  Copy, Layers
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  stepNumber: number;
  name: string;
  type: 'sequential' | 'parallel' | 'conditional' | 'pool';
  approvers: string[];
  poolName?: string;
  poolMode?: 'any' | 'all' | 'majority';
  condition?: string;
  slaHours: number;
  skipRule?: string;
}

interface WorkflowDesignerProps {
  onSave?: (steps: WorkflowStep[]) => void;
}

export default function WorkflowDesigner({ onSave }: WorkflowDesignerProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 'step-1',
      stepNumber: 1,
      name: 'Manager Approval',
      type: 'sequential',
      approvers: ['Manager'],
      slaHours: 24,
    }
  ]);
  
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  
  const addStep = (type: 'sequential' | 'parallel' | 'conditional' | 'pool') => {
    const newStep: WorkflowStep = {
      id: `step-${steps.length + 1}`,
      stepNumber: steps.length + 1,
      name: getDefaultStepName(type),
      type,
      approvers: type === 'pool' ? [] : ['Select Approver'],
      poolMode: type === 'pool' ? 'any' : undefined,
      slaHours: 24,
    };
    
    setSteps([...steps, newStep]);
    setShowAddMenu(false);
    setSelectedStep(newStep.id);
  };
  
  const getDefaultStepName = (type: string): string => {
    switch (type) {
      case 'sequential': return 'Sequential Approval';
      case 'parallel': return 'Parallel Approval (All Must Approve)';
      case 'conditional': return 'Conditional Routing';
      case 'pool': return 'Approval Pool';
      default: return 'Approval Step';
    }
  };
  
  const updateStep = (id: string, updates: Partial<WorkflowStep>) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  };
  
  const deleteStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id).map((step, idx) => ({
      ...step,
      stepNumber: idx + 1
    })));
    setSelectedStep(null);
  };
  
  const duplicateStep = (id: string) => {
    const stepToDuplicate = steps.find(s => s.id === id);
    if (!stepToDuplicate) return;
    
    const newStep = {
      ...stepToDuplicate,
      id: `step-${Date.now()}`,
      stepNumber: steps.length + 1,
      name: `${stepToDuplicate.name} (Copy)`,
    };
    
    setSteps([...steps, newStep]);
  };
  
  const selectedStepData = steps.find(s => s.id === selectedStep);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Workflow Canvas */}
      <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Workflow Steps</h3>
            <p className="text-sm text-gray-600 mt-1">
              {steps.length} step{steps.length !== 1 ? 's' : ''} configured
            </p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>
            
            {showAddMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => addStep('sequential')}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <ArrowRight className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Sequential</div>
                      <div className="text-xs text-gray-600">One approver at a time</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => addStep('parallel')}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Layers className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Parallel</div>
                      <div className="text-xs text-gray-600">Multiple approvers, all must approve</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => addStep('conditional')}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <GitBranch className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Conditional</div>
                      <div className="text-xs text-gray-600">Route based on conditions</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => addStep('pool')}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Users className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Approval Pool</div>
                      <div className="text-xs text-gray-600">Any qualified approver</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id}>
              {/* Step Card */}
              <div
                onClick={() => setSelectedStep(step.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedStep === step.id
                    ? 'border-[#F59E0B] bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Step Icon */}
                    <div className={`p-2 rounded-lg ${
                      step.type === 'sequential' ? 'bg-gray-100' :
                      step.type === 'parallel' ? 'bg-blue-100' :
                      step.type === 'conditional' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      {step.type === 'sequential' && <ArrowRight className="w-5 h-5 text-gray-600" />}
                      {step.type === 'parallel' && <Layers className="w-5 h-5 text-blue-600" />}
                      {step.type === 'conditional' && <GitBranch className="w-5 h-5 text-purple-600" />}
                      {step.type === 'pool' && <Users className="w-5 h-5 text-green-600" />}
                    </div>

                    {/* Step Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono text-gray-500">Step {step.stepNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          step.type === 'parallel' ? 'bg-blue-100 text-blue-700' :
                          step.type === 'conditional' ? 'bg-purple-100 text-purple-700' :
                          step.type === 'pool' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {step.type === 'parallel' ? 'Parallel' :
                           step.type === 'conditional' ? 'Conditional' :
                           step.type === 'pool' ? 'Pool' : 'Sequential'}
                        </span>
                      </div>

                      <div className="font-medium text-gray-900 mb-2">{step.name}</div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {step.type === 'pool'
                            ? `Pool (${step.poolMode || 'any'})`
                            : `${step.approvers.length} approver${step.approvers.length > 1 ? 's' : ''}`
                          }
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {step.slaHours}h SLA
                        </div>
                        {step.skipRule && (
                          <div className="flex items-center gap-1 text-amber-600">
                            <AlertCircle className="w-4 h-4" />
                            Skip rule
                          </div>
                        )}
                      </div>

                      {step.condition && (
                        <div className="mt-2 text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded inline-block">
                          If: {step.condition}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateStep(step.id);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStep(step.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex items-center justify-center py-2">
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
          ))}

          {steps.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <GitBranch className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No steps configured yet</p>
              <p className="text-xs mt-1">Click "Add Step" to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="text-lg font-semibold text-gray-900">Step Configuration</h3>
        </div>

        {selectedStepData ? (
          <div className="space-y-4">
            {/* Step Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Step Name
              </label>
              <input
                type="text"
                value={selectedStepData.name}
                onChange={(e) => updateStep(selectedStep!, { name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              />
            </div>

            {/* Approvers (for non-pool steps) */}
            {selectedStepData.type !== 'pool' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approvers
                  {selectedStepData.type === 'parallel' && (
                    <span className="text-xs text-blue-600 ml-2">(All must approve)</span>
                  )}
                </label>
                <select
                  multiple
                  value={selectedStepData.approvers}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    updateStep(selectedStep!, { approvers: selected });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  size={4}
                >
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="VP Finance">VP Finance</option>
                  <option value="CFO">CFO</option>
                  <option value="CEO">CEO</option>
                  <option value="Legal">Legal Team</option>
                  <option value="Compliance">Compliance Officer</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
            )}

            {/* Pool Configuration */}
            {selectedStepData.type === 'pool' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pool Name
                  </label>
                  <input
                    type="text"
                    value={selectedStepData.poolName || ''}
                    onChange={(e) => updateStep(selectedStep!, { poolName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Finance VPs Pool"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Mode
                  </label>
                  <select
                    value={selectedStepData.poolMode || 'any'}
                    onChange={(e) => updateStep(selectedStep!, { poolMode: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="any">Any One (First Takes It)</option>
                    <option value="all">All Must Approve</option>
                    <option value="majority">Majority (50%+)</option>
                  </select>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  Pool members will be selected from available approvers who are not on leave.
                  The first person to approve will complete this step.
                </div>
              </>
            )}

            {/* Conditional Routing */}
            {selectedStepData.type === 'conditional' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={selectedStepData.condition || ''}
                  onChange={(e) => updateStep(selectedStep!, { condition: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select condition...</option>
                  <option value="amount > 100000">Amount &gt; $100,000</option>
                  <option value="amount > 500000">Amount &gt; $500,000</option>
                  <option value="amount > 1000000">Amount &gt; $1,000,000</option>
                  <option value="risk = high">Risk Level = High</option>
                  <option value="department = IT">Department = IT</option>
                  <option value="vendor = new">Vendor = New</option>
                </select>

                <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-700">
                  If the condition is true, this approval step will be required. Otherwise, it will be skipped.
                </div>
              </div>
            )}

            {/* SLA Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SLA (Hours)
              </label>
              <input
                type="number"
                value={selectedStepData.slaHours}
                onChange={(e) => updateStep(selectedStep!, { slaHours: parseInt(e.target.value) || 24 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
                max="168"
              />
              <p className="text-xs text-gray-500 mt-1">
                Approver has {selectedStepData.slaHours} hours to respond
              </p>
            </div>

            {/* Skip Rule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skip Rule (Optional)
              </label>
              <select
                value={selectedStepData.skipRule || ''}
                onChange={(e) => updateStep(selectedStep!, { skipRule: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">No skip rule</option>
                <option value="originator_senior">Skip if originator is senior enough</option>
                <option value="low_amount">Skip if amount &lt; threshold</option>
                <option value="same_department">Skip if same department</option>
              </select>

              {selectedStepData.skipRule && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                  ⚠️ This step may be automatically skipped based on the rule
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Select a step to configure</p>
          </div>
        )}
      </div>
    </div>
  );
}

