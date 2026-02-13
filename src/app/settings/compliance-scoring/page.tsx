'use client';

import { useState } from 'react';
import {
  Calculator, Settings, Save, RotateCcw, Plus, Trash2, Edit2, Check, X,
  TrendingUp, Shield, AlertTriangle, Target, Layers, Code
} from 'lucide-react';
import { PageHeader, ComplianceScoreBreakdown } from '@/components';
import {
  CalculationMethod,
  AnyCalculationConfig,
  DEFAULT_CALCULATION_CONFIGS,
  WeightedAverageConfig,
  ControlBasedConfig,
  RiskWeightedConfig,
  MaturityBasedConfig,
  CustomFormulaConfig,
} from '@/lib/types/compliance-calculations';
import { ComplianceCalculator } from '@/lib/utils/compliance-calculator';
import clsx from 'clsx';

// Mock program data for preview
const mockProgramData = {
  requirements: [
    { id: 'req-1', complianceScore: 85, priority: 'Critical' as const, status: 'Compliant' },
    { id: 'req-2', complianceScore: 92, priority: 'High' as const, status: 'Compliant' },
    { id: 'req-3', complianceScore: 78, priority: 'Medium' as const, status: 'Partially Compliant' },
    { id: 'req-4', complianceScore: 65, priority: 'Low' as const, status: 'Non-Compliant' },
  ],
  controls: [
    { id: 'ctrl-1', effectiveness: 'Effective' as const, priority: 'Critical' as const },
    { id: 'ctrl-2', effectiveness: 'Effective' as const, priority: 'High' as const },
    { id: 'ctrl-3', effectiveness: 'Partially Effective' as const, priority: 'Medium' as const },
    { id: 'ctrl-4', effectiveness: 'Not Tested' as const, priority: 'Low' as const },
  ],
  tests: [
    { id: 'test-1', result: 'Pass' as const, controlId: 'ctrl-1' },
    { id: 'test-2', result: 'Pass' as const, controlId: 'ctrl-2' },
    { id: 'test-3', result: 'Fail' as const, controlId: 'ctrl-3' },
    { id: 'test-4', result: 'Pending' as const, controlId: 'ctrl-4' },
  ],
  obligations: [
    { id: 'obl-1', status: 'Completed', priority: 'Critical' as const },
    { id: 'obl-2', status: 'Completed', priority: 'High' as const },
    { id: 'obl-3', status: 'In Progress', priority: 'Medium' as const },
  ],
  risks: [
    { id: 'risk-1', rating: 'Critical' as const, residualRisk: 0.3 },
    { id: 'risk-2', rating: 'High' as const, residualRisk: 0.4 },
    { id: 'risk-3', rating: 'Medium' as const, residualRisk: 0.2 },
  ],
};

const methodIcons: Record<CalculationMethod, any> = {
  'simple-average': Calculator,
  'weighted-average': TrendingUp,
  'control-based': Shield,
  'risk-weighted': AlertTriangle,
  'maturity-based': Layers,
  'custom-formula': Code,
};

export default function ComplianceScoringSettings() {
  const [selectedMethod, setSelectedMethod] = useState<CalculationMethod>('simple-average');
  const [configs, setConfigs] = useState<Record<CalculationMethod, AnyCalculationConfig>>(
    DEFAULT_CALCULATION_CONFIGS
  );
  const [hasChanges, setHasChanges] = useState(false);

  const currentConfig = configs[selectedMethod];
  const calculationResult = ComplianceCalculator.calculate(currentConfig, mockProgramData);

  const handleSave = () => {
    // In real app, save to backend
    console.log('Saving configurations:', configs);
    setHasChanges(false);
  };

  const handleReset = () => {
    setConfigs(DEFAULT_CALCULATION_CONFIGS);
    setHasChanges(false);
  };

  const updateConfig = (method: CalculationMethod, updates: Partial<AnyCalculationConfig>) => {
    setConfigs(prev => ({
      ...prev,
      [method]: { ...prev[method], ...updates },
    }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <PageHeader
        title="Compliance Scoring Configuration"
        description="Configure how compliance scores are calculated across your programs"
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              disabled={!hasChanges}
              className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] bg-[var(--background)] rounded-xl hover:bg-[var(--background-secondary)] transition-all duration-200 text-p2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={18} />
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all duration-200 text-p2 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        }
      />

      {/* Method Selection */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-6">
        <h3 className="text-h3 font-semibold text-[var(--foreground)] mb-4">Calculation Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(DEFAULT_CALCULATION_CONFIGS) as CalculationMethod[]).map((method) => {
            const Icon = methodIcons[method];
            const config = configs[method];
            const isActive = selectedMethod === method;

            return (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={clsx(
                  'p-4 rounded-xl border-2 transition-all text-left',
                  isActive
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-[var(--border)] hover:border-violet-300 hover:bg-[var(--background-secondary)]'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    isActive ? 'bg-violet-600' : 'bg-[var(--background-secondary)]'
                  )}>
                    <Icon size={20} className={isActive ? 'text-white' : 'text-[var(--foreground-muted)]'} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-1">{config.name}</h4>
                    <p className="text-p3 text-[var(--foreground-muted)]">{config.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Configuration */}
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 border-b border-[var(--border)] bg-[var(--background-secondary)] flex-shrink-0">
            <h3 className="text-h3 font-semibold text-[var(--foreground)]">Configuration</h3>
          </div>

          <div className="p-6 overflow-y-auto flex-1" style={{ maxHeight: '100%' }}>
            {selectedMethod === 'weighted-average' && (
              <WeightedAveragePanel
                config={currentConfig as WeightedAverageConfig}
                onChange={(updates) => updateConfig(selectedMethod, updates)}
              />
            )}

            {selectedMethod === 'control-based' && (
              <ControlBasedPanel
                config={currentConfig as ControlBasedConfig}
                onChange={(updates) => updateConfig(selectedMethod, updates)}
              />
            )}

            {selectedMethod === 'risk-weighted' && (
              <RiskWeightedPanel
                config={currentConfig as RiskWeightedConfig}
                onChange={(updates) => updateConfig(selectedMethod, updates)}
              />
            )}

            {selectedMethod === 'maturity-based' && (
              <MaturityBasedPanel
                config={currentConfig as MaturityBasedConfig}
                onChange={(updates) => updateConfig(selectedMethod, updates)}
              />
            )}

            {selectedMethod === 'custom-formula' && (
              <CustomFormulaPanel
                config={currentConfig as CustomFormulaConfig}
                onChange={(updates) => updateConfig(selectedMethod, updates)}
              />
            )}

            {selectedMethod === 'simple-average' && (
              <div className="space-y-4">
                <p className="text-p2 text-[var(--foreground-muted)]">
                  Simple average calculation requires no additional configuration.
                  The score is calculated as the average of all requirement compliance scores.
                </p>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-p3 text-blue-800">
                    <strong>Formula:</strong> Sum of all requirement scores ÷ Total requirements
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex flex-col h-[600px]">
          <div className="overflow-y-auto space-y-4 flex-1" style={{ maxHeight: '100%' }}>
            <ComplianceScoreBreakdown breakdown={calculationResult.breakdown} />

            {calculationResult.warnings && calculationResult.warnings.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={18} className="text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-p2 font-semibold text-amber-900 mb-1">Warnings</p>
                    <ul className="text-p3 text-amber-800 space-y-1">
                      {calculationResult.warnings.map((warning, idx) => (
                        <li key={idx}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {calculationResult.errors && calculationResult.errors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <X size={18} className="text-red-600 mt-0.5" />
                  <div>
                    <p className="text-p2 font-semibold text-red-900 mb-1">Errors</p>
                    <ul className="text-p3 text-red-800 space-y-1">
                      {calculationResult.errors.map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Configuration Panels for each method
function WeightedAveragePanel({
  config,
  onChange,
}: {
  config: WeightedAverageConfig;
  onChange: (updates: Partial<WeightedAverageConfig>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-3">Component Weights</h4>
        <div className="space-y-3">
          {Object.entries(config.weights).map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-p3 text-[var(--foreground)] capitalize">{key}</label>
                <span className="text-p3 font-medium text-[var(--foreground)]">{(value * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={value * 100}
                onChange={(e) => onChange({
                  weights: { ...config.weights, [key]: parseInt(e.target.value) / 100 }
                })}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-3">Priority Weights</h4>
        <div className="space-y-3">
          {config.priorityWeights && Object.entries(config.priorityWeights).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-p3 text-[var(--foreground)]">{key}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="3"
                value={value}
                onChange={(e) => onChange({
                  priorityWeights: { ...config.priorityWeights!, [key]: parseFloat(e.target.value) }
                })}
                className="w-20 px-3 py-1.5 border border-[var(--border)] rounded-lg text-p3"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ControlBasedPanel({
  config,
  onChange,
}: {
  config: ControlBasedConfig;
  onChange: (updates: Partial<ControlBasedConfig>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-3">Control Effectiveness Weights</h4>
        <div className="space-y-3">
          {Object.entries(config.controlEffectivenessWeights).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-p3 text-[var(--foreground)]">{key}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={value}
                onChange={(e) => onChange({
                  controlEffectivenessWeights: { ...config.controlEffectivenessWeights, [key]: parseFloat(e.target.value) }
                })}
                className="w-20 px-3 py-1.5 border border-[var(--border)] rounded-lg text-p3"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-3">Test Result Weights</h4>
        <div className="space-y-3">
          {Object.entries(config.testResultWeights).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-p3 text-[var(--foreground)]">{key}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={value}
                onChange={(e) => onChange({
                  testResultWeights: { ...config.testResultWeights, [key]: parseFloat(e.target.value) }
                })}
                className="w-20 px-3 py-1.5 border border-[var(--border)] rounded-lg text-p3"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskWeightedPanel({
  config,
  onChange,
}: {
  config: RiskWeightedConfig;
  onChange: (updates: Partial<RiskWeightedConfig>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-3">Risk Impact Multipliers</h4>
        <div className="space-y-3">
          {Object.entries(config.riskImpactMultiplier).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-p3 text-[var(--foreground)]">{key}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={value}
                onChange={(e) => onChange({
                  riskImpactMultiplier: { ...config.riskImpactMultiplier, [key]: parseFloat(e.target.value) }
                })}
                className="w-20 px-3 py-1.5 border border-[var(--border)] rounded-lg text-p3"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-3">Additional Factors</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-p3 text-[var(--foreground)]">Residual Risk Factor</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={config.residualRiskFactor}
              onChange={(e) => onChange({ residualRiskFactor: parseFloat(e.target.value) })}
              className="w-20 px-3 py-1.5 border border-[var(--border)] rounded-lg text-p3"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-p3 text-[var(--foreground)]">Control Effectiveness Impact</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={config.controlEffectivenessImpact}
              onChange={(e) => onChange({ controlEffectivenessImpact: parseFloat(e.target.value) })}
              className="w-20 px-3 py-1.5 border border-[var(--border)] rounded-lg text-p3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MaturityBasedPanel({
  config,
  onChange,
}: {
  config: MaturityBasedConfig;
  onChange: (updates: Partial<MaturityBasedConfig>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-3">Maturity Levels</h4>
        <div className="space-y-2">
          {config.maturityLevels.map((level, idx) => (
            <div key={idx} className="p-2.5 bg-[var(--background-secondary)] rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-p3 font-medium text-[var(--foreground)]">
                  L{level.level}: {level.name}
                </span>
                <span className="text-p3 text-[var(--foreground-muted)]">
                  {level.scoreRange[0]}-{level.scoreRange[1]}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-p3 text-[var(--foreground-muted)]">Weight</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={level.weight}
                  onChange={(e) => {
                    const newLevels = [...config.maturityLevels];
                    newLevels[idx] = { ...level, weight: parseFloat(e.target.value) };
                    onChange({ maturityLevels: newLevels });
                  }}
                  className="w-16 px-2 py-1 border border-[var(--border)] rounded text-p3"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-2">Progression Factor</h4>
        <input
          type="number"
          step="0.1"
          min="0"
          max="2"
          value={config.progressionFactor}
          onChange={(e) => onChange({ progressionFactor: parseFloat(e.target.value) })}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-p2"
        />
        <p className="text-p3 text-[var(--foreground-muted)] mt-1.5">
          Multiplier for progression through levels
        </p>
      </div>
    </div>
  );
}

function CustomFormulaPanel({
  config,
  onChange,
}: {
  config: CustomFormulaConfig;
  onChange: (updates: Partial<CustomFormulaConfig>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-2">Formula</h4>
        <textarea
          value={config.formula}
          onChange={(e) => onChange({ formula: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-p3 font-mono bg-gray-50"
          placeholder="e.g., (R * 0.4 + C * 0.3 + T * 0.3) * 100"
        />
        <p className="text-p3 text-[var(--foreground-muted)] mt-1">
          Use variables defined below
        </p>
      </div>

      <div>
        <h4 className="text-p2 font-semibold text-[var(--foreground)] mb-2">Variables</h4>
        <div className="space-y-2">
          {config.variables.map((variable, idx) => (
            <div key={idx} className="p-2.5 bg-[var(--background-secondary)] rounded-lg">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-p3 text-[var(--foreground-muted)] mb-1 block">Name</label>
                  <input
                    type="text"
                    value={variable.name}
                    onChange={(e) => {
                      const newVars = [...config.variables];
                      newVars[idx] = { ...variable, name: e.target.value };
                      onChange({ variables: newVars });
                    }}
                    className="w-full px-2 py-1 border border-[var(--border)] rounded text-p3 font-mono"
                  />
                </div>
                <div>
                  <label className="text-p3 text-[var(--foreground-muted)] mb-1 block">Source</label>
                  <select
                    value={variable.source}
                    onChange={(e) => {
                      const newVars = [...config.variables];
                      newVars[idx] = { ...variable, source: e.target.value as any };
                      onChange({ variables: newVars });
                    }}
                    className="w-full px-2 py-1 border border-[var(--border)] rounded text-p3"
                  >
                    <option value="requirements">Requirements</option>
                    <option value="controls">Controls</option>
                    <option value="tests">Tests</option>
                    <option value="obligations">Obligations</option>
                    <option value="risks">Risks</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-p3 text-[var(--foreground-muted)] mb-1 block">Description</label>
                <input
                  type="text"
                  value={variable.description}
                  onChange={(e) => {
                    const newVars = [...config.variables];
                    newVars[idx] = { ...variable, description: e.target.value };
                    onChange({ variables: newVars });
                  }}
                  className="w-full px-2 py-1 border border-[var(--border)] rounded text-p3"
                  placeholder="Variable description"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


