'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Grid3X3, Plus, Trash2, Save } from 'lucide-react';
import clsx from 'clsx';
import { type LikelihoodLevel, type ConsequenceLevel, type RiskMatrix, generateMatrixCells } from '@/lib/data/categories-matrices';

export default function NewMatrixPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<'basic' | 'likelihood' | 'consequence' | 'thresholds' | 'preview'>('basic');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 'Enterprise' as RiskMatrix['level'],
    dimensions: { likelihood: 5, consequence: 5 },
    isDefault: false
  });

  const [likelihoodScale, setLikelihoodScale] = useState<LikelihoodLevel[]>([
    { value: 1, label: 'Rare', description: 'May occur only in exceptional circumstances', probabilityRange: '< 1%', frequencyRange: 'Once in 10+ years', examples: [] },
    { value: 2, label: 'Unlikely', description: 'Could occur at some time', probabilityRange: '1% - 10%', frequencyRange: 'Once in 5-10 years', examples: [] },
    { value: 3, label: 'Possible', description: 'Might occur at some time', probabilityRange: '10% - 50%', frequencyRange: 'Once every 1-5 years', examples: [] },
    { value: 4, label: 'Likely', description: 'Will probably occur in most circumstances', probabilityRange: '50% - 90%', frequencyRange: 'Multiple times per year', examples: [] },
    { value: 5, label: 'Almost Certain', description: 'Expected to occur in most circumstances', probabilityRange: '> 90%', frequencyRange: 'Weekly or daily', examples: [] }
  ]);

  const [consequenceScale, setConsequenceScale] = useState<ConsequenceLevel[]>([
    { value: 1, label: 'Insignificant', description: 'Minimal impact on operations', financial: '< $10K', operational: 'No disruption', reputational: 'Internal only', compliance: 'Minor procedural issue', examples: [] },
    { value: 2, label: 'Minor', description: 'Minor impact, manageable with routine procedures', financial: '$10K - $100K', operational: 'Brief disruption (< 1 day)', reputational: 'Local concern', compliance: 'Reportable incident', examples: [] },
    { value: 3, label: 'Moderate', description: 'Moderate impact requiring management attention', financial: '$100K - $1M', operational: 'Significant disruption (1-7 days)', reputational: 'Regional media', compliance: 'Regulatory warning', examples: [] },
    { value: 4, label: 'Major', description: 'Significant impact requiring senior management intervention', financial: '$1M - $10M', operational: 'Major disruption (1-4 weeks)', reputational: 'National media', compliance: 'Regulatory fine', examples: [] },
    { value: 5, label: 'Catastrophic', description: 'Severe impact threatening organizational viability', financial: '> $10M', operational: 'Extended outage (> 1 month)', reputational: 'International crisis', compliance: 'License revocation', examples: [] }
  ]);

  const [thresholds, setThresholds] = useState({
    low: { min: 1, max: 4, color: '#10B981' },
    medium: { min: 5, max: 9, color: '#F59E0B' },
    high: { min: 10, max: 15, color: '#F97316' },
    critical: { min: 16, max: 25, color: '#EF4444' }
  });

  const updateLikelihoodLevel = (index: number, field: keyof LikelihoodLevel, value: any) => {
    const updated = [...likelihoodScale];
    updated[index] = { ...updated[index], [field]: value };
    setLikelihoodScale(updated);
  };

  const updateConsequenceLevel = (index: number, field: keyof ConsequenceLevel, value: any) => {
    const updated = [...consequenceScale];
    updated[index] = { ...updated[index], [field]: value };
    setConsequenceScale(updated);
  };

  const handleSubmit = () => {
    const matrix: RiskMatrix = {
      id: `MATRIX-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      level: formData.level,
      dimensions: formData.dimensions,
      likelihoodScale,
      consequenceScale,
      thresholds,
      cells: [],
      isDefault: formData.isDefault,
      applicableTo: ['All'],
      createdBy: 'Current User',
      createdDate: new Date().toISOString(),
      version: 1
    };
    
    matrix.cells = generateMatrixCells(matrix);
    
    console.log('New matrix created:', matrix);
    alert('Matrix created successfully!');
    router.push('/erm/matrices');
  };

  const previewMatrix = {
    ...formData,
    likelihoodScale,
    consequenceScale,
    thresholds,
    cells: [] as any,
    id: 'PREVIEW',
    isDefault: false,
    applicableTo: [],
    createdBy: '',
    createdDate: '',
    version: 1
  };
  previewMatrix.cells = generateMatrixCells(previewMatrix);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/matrices')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Matrices
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <Grid3X3 size={24} className="text-[var(--primary)]" />
          <h1 className="text-h2 font-bold text-[var(--foreground)]">Create Custom Risk Matrix</h1>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Build a custom risk assessment matrix with your own likelihood and consequence scales
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          {[
            { id: 'basic', label: 'Basic Info', icon: '1' },
            { id: 'likelihood', label: 'Likelihood Scale', icon: '2' },
            { id: 'consequence', label: 'Consequence Scale', icon: '3' },
            { id: 'thresholds', label: 'Thresholds', icon: '4' },
            { id: 'preview', label: 'Preview', icon: '5' }
          ].map((s, idx) => (
            <>
              <button
                key={s.id}
                onClick={() => setStep(s.id as any)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                  step === s.id
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
                )}
              >
                <div className={clsx(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                  step === s.id ? 'bg-white text-[var(--primary)]' : 'bg-gray-300 text-gray-600'
                )}>
                  {s.icon}
                </div>
                <span className="text-sm font-medium">{s.label}</span>
              </button>
              {idx < 4 && (
                <div
                  key={`line-${idx}`}
                  className="h-0.5 bg-gray-300 flex-1 mx-3"
                  style={{ maxWidth: '60px' }}
                />
              )}
            </>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 'basic' && (
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">Basic Matrix Information</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Matrix Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., IT Department Risk Matrix"
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the purpose and applicability of this matrix"
                rows={3}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Organization Level *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="Business Unit">Business Unit</option>
                  <option value="Department">Department</option>
                  <option value="Project">Project</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Matrix Dimensions
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={formData.dimensions.likelihood}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions, likelihood: parseInt(e.target.value) }
                    })}
                    className="px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  >
                    {[3, 4, 5, 6, 7].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <span className="text-[var(--foreground-muted)]">×</span>
                  <select
                    value={formData.dimensions.consequence}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions, consequence: parseInt(e.target.value) }
                    })}
                    className="px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  >
                    {[3, 4, 5, 6, 7].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  Likelihood × Consequence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]"
              />
              <label htmlFor="isDefault" className="text-sm text-[var(--foreground)]">
                Set as default matrix for organization
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-[var(--border)]">
            <button
              onClick={() => router.push('/erm/matrices')}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep('likelihood')}
              disabled={!formData.name}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Likelihood Scale →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Likelihood Scale */}
      {step === 'likelihood' && (
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">Configure Likelihood Scale</h2>

          <div className="space-y-6">
            {likelihoodScale.slice(0, formData.dimensions.likelihood).map((level, idx) => (
              <div key={level.value} className="border border-[var(--border)] rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[var(--foreground)]">Level {level.value}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                    Likelihood {level.value}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Label *
                    </label>
                    <input
                      type="text"
                      value={level.label}
                      onChange={(e) => updateLikelihoodLevel(idx, 'label', e.target.value)}
                      placeholder="e.g., Rare, Unlikely, Possible..."
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Probability Range
                    </label>
                    <input
                      type="text"
                      value={level.probabilityRange || ''}
                      onChange={(e) => updateLikelihoodLevel(idx, 'probabilityRange', e.target.value)}
                      placeholder="e.g., < 1%, 1-10%"
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Description *
                    </label>
                    <input
                      type="text"
                      value={level.description}
                      onChange={(e) => updateLikelihoodLevel(idx, 'description', e.target.value)}
                      placeholder="Describe this likelihood level"
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Frequency Range
                    </label>
                    <input
                      type="text"
                      value={level.frequencyRange || ''}
                      onChange={(e) => updateLikelihoodLevel(idx, 'frequencyRange', e.target.value)}
                      placeholder="e.g., Once in 10 years"
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
            <button
              onClick={() => setStep('basic')}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep('consequence')}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
            >
              Next: Consequence Scale →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Consequence Scale */}
      {step === 'consequence' && (
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">Configure Consequence Scale</h2>

          <div className="space-y-6">
            {consequenceScale.slice(0, formData.dimensions.consequence).map((level, idx) => (
              <div key={level.value} className="border border-[var(--border)] rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[var(--foreground)]">Level {level.value}</h3>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm font-medium">
                    Consequence {level.value}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Label *
                    </label>
                    <input
                      type="text"
                      value={level.label}
                      onChange={(e) => updateConsequenceLevel(idx, 'label', e.target.value)}
                      placeholder="e.g., Insignificant, Minor..."
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Description *
                    </label>
                    <input
                      type="text"
                      value={level.description}
                      onChange={(e) => updateConsequenceLevel(idx, 'description', e.target.value)}
                      placeholder="Describe this consequence level"
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Financial Impact
                    </label>
                    <input
                      type="text"
                      value={level.financial || ''}
                      onChange={(e) => updateConsequenceLevel(idx, 'financial', e.target.value)}
                      placeholder="e.g., < $10K, $10K - $100K"
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Operational Impact
                    </label>
                    <input
                      type="text"
                      value={level.operational || ''}
                      onChange={(e) => updateConsequenceLevel(idx, 'operational', e.target.value)}
                      placeholder="e.g., No disruption, Brief disruption"
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Reputational Impact
                    </label>
                    <input
                      type="text"
                      value={level.reputational || ''}
                      onChange={(e) => updateConsequenceLevel(idx, 'reputational', e.target.value)}
                      placeholder="e.g., Internal only, Local media"
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Compliance Impact
                    </label>
                    <input
                      type="text"
                      value={level.compliance || ''}
                      onChange={(e) => updateConsequenceLevel(idx, 'compliance', e.target.value)}
                      placeholder="e.g., Minor violation, Major breach"
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
            <button
              onClick={() => setStep('likelihood')}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep('thresholds')}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
            >
              Next: Thresholds →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Thresholds */}
      {step === 'thresholds' && (
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">Configure Risk Rating Thresholds</h2>

          <div className="space-y-6">
            {Object.entries(thresholds).map(([rating, values]) => (
              <div key={rating} className="border border-[var(--border)] rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[var(--foreground)] capitalize">{rating} Risk</h3>
                  <div
                    className="w-12 h-12 rounded"
                    style={{ backgroundColor: values.color }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Minimum Score
                    </label>
                    <input
                      type="number"
                      value={values.min}
                      onChange={(e) => setThresholds({
                        ...thresholds,
                        [rating]: { ...values, min: parseInt(e.target.value) || 0 }
                      })}
                      min="1"
                      max="25"
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Maximum Score
                    </label>
                    <input
                      type="number"
                      value={values.max}
                      onChange={(e) => setThresholds({
                        ...thresholds,
                        [rating]: { ...values, max: parseInt(e.target.value) || 0 }
                      })}
                      min="1"
                      max="25"
                      className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      value={values.color}
                      onChange={(e) => setThresholds({
                        ...thresholds,
                        [rating]: { ...values, color: e.target.value }
                      })}
                      className="w-full h-10 border border-[var(--border)] rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Threshold Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure thresholds don't overlap</li>
              <li>• Typically: Low (1-4), Medium (5-9), High (10-15), Critical (16-25) for 5×5 matrix</li>
              <li>• Adjust based on your risk appetite and matrix dimensions</li>
            </ul>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
            <button
              onClick={() => setStep('consequence')}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep('preview')}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
            >
              Preview Matrix →
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Preview & Create */}
      {step === 'preview' && (
        <div className="space-y-6">
          {/* Matrix Preview */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">Matrix Preview</h2>

            {/* Matrix Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-[var(--foreground-muted)]">Name:</span> <span className="font-medium">{formData.name}</span></div>
                <div><span className="text-[var(--foreground-muted)]">Level:</span> <span className="font-medium">{formData.level}</span></div>
                <div><span className="text-[var(--foreground-muted)]">Dimensions:</span> <span className="font-medium">{formData.dimensions.likelihood} × {formData.dimensions.consequence}</span></div>
                <div><span className="text-[var(--foreground-muted)]">Default:</span> <span className="font-medium">{formData.isDefault ? 'Yes' : 'No'}</span></div>
              </div>
            </div>

            {/* Matrix Grid */}
            <div className="overflow-x-auto">
              <div className="inline-block border-2 border-gray-300 rounded-lg overflow-hidden">
                <table className="border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-gray-100 border border-gray-300 p-2 text-xs font-semibold w-24"></th>
                      {consequenceScale.slice(0, formData.dimensions.consequence).map(level => (
                        <th key={level.value} className="bg-gray-100 border border-gray-300 p-2 text-xs font-semibold text-center min-w-[80px]">
                          <div>{level.label}</div>
                          <div className="font-normal text-gray-600">({level.value})</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewMatrix.cells.map((row, rowIndex) => {
                      const likelihoodLevel = likelihoodScale.find(l => l.value === row[0].likelihood);
                      return (
                        <tr key={rowIndex}>
                          <th className="bg-gray-100 border border-gray-300 p-2 text-xs font-semibold text-right">
                            <div>{likelihoodLevel?.label}</div>
                            <div className="font-normal text-gray-600">({row[0].likelihood})</div>
                          </th>
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="border border-gray-300 p-3 text-center font-bold text-sm"
                              style={{ backgroundColor: cell.color, color: '#fff' }}
                              title={`Score: ${cell.score} | Rating: ${cell.rating}`}
                            >
                              {cell.score}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Summary Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Likelihood Scale Summary</h3>
              <div className="space-y-2">
                {likelihoodScale.slice(0, formData.dimensions.likelihood).map(level => (
                  <div key={level.value} className="text-sm">
                    <span className="font-medium">{level.value}. {level.label}:</span> {level.description}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-lg p-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Consequence Scale Summary</h3>
              <div className="space-y-2">
                {consequenceScale.slice(0, formData.dimensions.consequence).map(level => (
                  <div key={level.value} className="text-sm">
                    <span className="font-medium">{level.value}. {level.label}:</span> {level.description}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between bg-white border border-[var(--border)] rounded-lg p-6">
            <button
              onClick={() => setStep('thresholds')}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Edit
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-semibold text-lg"
            >
              <Save size={20} />
              Create Matrix
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
