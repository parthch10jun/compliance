'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Save, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { mockRiskRankings, mockRiskOverrides } from '@/lib/data/risk-evaluation';

export default function RiskOverridePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    riskId: '',
    overrideType: 'rating' as 'rating' | 'rank',
    originalScore: 0,
    originalRating: 'Medium' as 'Critical' | 'High' | 'Medium' | 'Low',
    originalRank: 0,
    overrideScore: 0,
    overrideRating: 'Medium' as 'Critical' | 'High' | 'Medium' | 'Low',
    overrideRank: 0,
    rationale: '',
    overriddenBy: ''
  });

  const handleRiskSelect = (riskId: string) => {
    const risk = mockRiskRankings.find(r => r.riskId === riskId);
    if (risk) {
      setFormData({
        ...formData,
        riskId,
        originalScore: risk.residualScore,
        originalRating: risk.residualRating,
        originalRank: risk.residualRank,
        overrideScore: risk.residualScore,
        overrideRating: risk.residualRating,
        overrideRank: risk.residualRank
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Override submitted:', formData);
    router.push('/erm/evaluation');
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const selectedRisk = mockRiskRankings.find(r => r.riskId === formData.riskId);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/evaluation')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Risk Evaluation
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <Shield size={24} className="text-[var(--primary)]" />
          <h1 className="text-h2 font-bold text-[var(--foreground)]">Override Risk Rating/Ranking</h1>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Override calculated risk ratings or rankings with justification
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Override Form */}
        <div className="col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Risk Selection */}
            <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Select Risk</h2>
              
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Risk <span className="text-red-600">*</span>
                </label>
                <select
                  required
                  value={formData.riskId}
                  onChange={(e) => handleRiskSelect(e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                >
                  <option value="">Select a risk...</option>
                  {mockRiskRankings.map(risk => (
                    <option key={risk.riskId} value={risk.riskId}>
                      {risk.riskId} - {risk.riskTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedRisk && (
              <>
                {/* Override Type */}
                <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Override Type</h2>
                  
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="overrideType"
                        value="rating"
                        checked={formData.overrideType === 'rating'}
                        onChange={(e) => setFormData({ ...formData, overrideType: 'rating' })}
                        className="w-4 h-4 text-[var(--primary)] border-gray-300 focus:ring-[var(--primary)]"
                      />
                      <span className="text-sm font-medium">Override Rating</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="overrideType"
                        value="rank"
                        checked={formData.overrideType === 'rank'}
                        onChange={(e) => setFormData({ ...formData, overrideType: 'rank' })}
                        className="w-4 h-4 text-[var(--primary)] border-gray-300 focus:ring-[var(--primary)]"
                      />
                      <span className="text-sm font-medium">Override Rank</span>
                    </label>
                  </div>
                </div>

                {/* Original vs Override Values */}
                <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                    {formData.overrideType === 'rating' ? 'Rating Override' : 'Rank Override'}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {/* Original */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-red-900 mb-3">Original (Calculated)</h3>
                      
                      {formData.overrideType === 'rating' ? (
                        <>
                          <div className="mb-3">
                            <div className="text-xs text-red-700 mb-1">Score</div>
                            <div className="text-2xl font-bold text-red-900">{formData.originalScore}</div>
                          </div>
                          <div>
                            <div className="text-xs text-red-700 mb-1">Rating</div>
                            <span className={clsx('px-3 py-1 text-sm font-bold rounded border', getRatingColor(formData.originalRating))}>
                              {formData.originalRating}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div>
                          <div className="text-xs text-red-700 mb-1">Rank</div>
                          <div className="text-3xl font-bold text-red-900">#{formData.originalRank}</div>
                        </div>
                      )}
                    </div>

                    {/* Override */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-green-900 mb-3">Override (New)</h3>
                      
                      {formData.overrideType === 'rating' ? (
                        <>
                          <div className="mb-3">
                            <div className="text-xs text-green-700 mb-1">Score</div>
                            <input
                              type="number"
                              min="1"
                              max="25"
                              value={formData.overrideScore}
                              onChange={(e) => setFormData({ ...formData, overrideScore: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 text-2xl font-bold border border-green-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <div className="text-xs text-green-700 mb-1">Rating</div>
                            <select
                              value={formData.overrideRating}
                              onChange={(e) => setFormData({ ...formData, overrideRating: e.target.value as any })}
                              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                              <option value="Critical">Critical</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        <div>
                          <div className="text-xs text-green-700 mb-1">Rank</div>
                          <input
                            type="number"
                            min="1"
                            value={formData.overrideRank}
                            onChange={(e) => setFormData({ ...formData, overrideRank: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 text-3xl font-bold border border-green-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Justification */}
                <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Justification</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Overridden By <span className="text-red-600">*</span>
                      </label>
                      <select
                        required
                        value={formData.overriddenBy}
                        onChange={(e) => setFormData({ ...formData, overriddenBy: e.target.value })}
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      >
                        <option value="">Select user...</option>
                        <option value="Jennifer Walsh (CCO)">Jennifer Walsh (CCO)</option>
                        <option value="Sarah Chen (CISO)">Sarah Chen (CISO)</option>
                        <option value="David Kumar (COO)">David Kumar (COO)</option>
                        <option value="Board Risk Committee">Board Risk Committee</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Rationale <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        required
                        value={formData.rationale}
                        onChange={(e) => setFormData({ ...formData, rationale: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="Provide detailed rationale for this override..."
                      />
                      <p className="text-xs text-[var(--foreground-muted)] mt-1">
                        Explain why the calculated rating/rank doesn't reflect actual risk level
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Save size={18} />
                    Submit Override
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/erm/evaluation')}
                    className="px-6 py-3 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Right Column - Override History */}
        <div className="space-y-6">
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Override History</h2>
            
            <div className="space-y-3">
              {mockRiskOverrides.map(override => (
                <div key={override.id} className="p-3 border border-[var(--border)] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--primary)]">{override.riskId}</span>
                    <span className={clsx(
                      'px-2 py-0.5 text-xs font-medium rounded',
                      override.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      override.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    )}>
                      {override.status}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-2">
                    Rank: {override.originalRank} → {override.overrideRank}
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)]">
                    By: {override.overriddenBy}
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)]">
                    Date: {new Date(override.overrideDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle size={20} className="text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Override Guidelines</h3>
                <p className="text-xs text-blue-800">
                  Overrides should only be used when calculated risk doesn't reflect actual risk level due to factors not captured in the model. All overrides are logged and require approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
