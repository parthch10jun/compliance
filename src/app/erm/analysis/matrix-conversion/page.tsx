'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Layers, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { enterpriseRiskMatrix, convertBetweenMatrices, type RiskMatrix } from '@/lib/data/risk-analysis';

export default function MatrixConversionPage() {
  const router = useRouter();
  
  // Mock multiple matrices
  const matrices: RiskMatrix[] = [
    { ...enterpriseRiskMatrix, id: 'MATRIX-ENT', name: 'Enterprise Risk Matrix', level: 'Enterprise' },
    { ...enterpriseRiskMatrix, id: 'MATRIX-BU', name: 'Business Unit Risk Matrix', level: 'Business Unit' },
    { ...enterpriseRiskMatrix, id: 'MATRIX-PROJ', name: 'Project Risk Matrix', level: 'Project' }
  ];

  const [sourceMatrixId, setSourceMatrixId] = useState('MATRIX-BU');
  const [targetMatrixId, setTargetMatrixId] = useState('MATRIX-ENT');
  const [sourceLikelihood, setSourceLikelihood] = useState(3);
  const [sourceConsequence, setSourceConsequence] = useState(4);

  const sourceMatrix = matrices.find(m => m.id === sourceMatrixId) || matrices[0];
  const targetMatrix = matrices.find(m => m.id === targetMatrixId) || matrices[0];

  const sourceScore = sourceLikelihood * sourceConsequence;
  const sourceRating = sourceScore >= 16 ? 'Critical' : sourceScore >= 10 ? 'High' : sourceScore >= 5 ? 'Medium' : 'Low';

  const converted = convertBetweenMatrices(sourceLikelihood, sourceConsequence, sourceMatrix, targetMatrix);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 16) return 'bg-red-500';
    if (score >= 10) return 'bg-orange-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/analysis')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Risk Analysis
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <Layers size={24} className="text-[var(--primary)]" />
          <h1 className="text-h2 font-bold text-[var(--foreground)]">Risk Matrix Conversion</h1>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Convert risk ratings between different organizational matrices
        </p>
      </div>

      {/* Matrix Selection */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Source Matrix */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Source Matrix</h2>
          <select
            value={sourceMatrixId}
            onChange={(e) => setSourceMatrixId(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent mb-4"
          >
            {matrices.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <div className="text-sm text-[var(--foreground-muted)]">
            Level: <span className="font-medium text-[var(--foreground)]">{sourceMatrix.level}</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <ArrowRight size={48} className="text-[var(--primary)]" />
        </div>

        {/* Target Matrix */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Target Matrix</h2>
          <select
            value={targetMatrixId}
            onChange={(e) => setTargetMatrixId(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent mb-4"
          >
            {matrices.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <div className="text-sm text-[var(--foreground-muted)]">
            Level: <span className="font-medium text-[var(--foreground)]">{targetMatrix.level}</span>
          </div>
        </div>
      </div>

      {/* Input Risk Values */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Source Risk Values</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Likelihood (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={sourceLikelihood}
              onChange={(e) => setSourceLikelihood(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Consequence (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={sourceConsequence}
              onChange={(e) => setSourceConsequence(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Conversion Results */}
      <div className="grid grid-cols-3 gap-6">
        {/* Source Result */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Source Matrix Result</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-red-700 mb-2">L × C</div>
              <div className="text-3xl font-bold text-red-900">
                {sourceLikelihood} × {sourceConsequence}
              </div>
            </div>

            <div>
              <div className="text-sm text-red-700 mb-2">Risk Score</div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-red-900">{sourceScore}</div>
                <div className={clsx('w-12 h-12 rounded', getScoreColor(sourceScore))} />
              </div>
            </div>

            <div>
              <div className="text-sm text-red-700 mb-2">Risk Rating</div>
              <div className="text-xl font-bold text-red-900">{sourceRating}</div>
            </div>
          </div>
        </div>

        {/* Conversion Arrow */}
        <div className="flex flex-col items-center justify-center bg-white border border-[var(--border)] rounded-lg p-6">
          <div className="text-lg font-semibold text-[var(--foreground)] mb-4">Converting</div>
          <ArrowRight size={64} className="text-[var(--primary)] mb-4" />
          <div className="text-sm text-[var(--foreground-muted)] text-center">
            From {sourceMatrix.level} to {targetMatrix.level}
          </div>
        </div>

        {/* Target Result */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Target Matrix Result</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-green-700 mb-2">L × C</div>
              <div className="text-3xl font-bold text-green-900">
                {converted.likelihood} × {converted.consequence}
              </div>
            </div>

            <div>
              <div className="text-sm text-green-700 mb-2">Risk Score</div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-green-900">{converted.score}</div>
                <div className={clsx('w-12 h-12 rounded', getScoreColor(converted.score))} />
              </div>
            </div>

            <div>
              <div className="text-sm text-green-700 mb-2">Risk Rating</div>
              <div className="text-xl font-bold text-green-900">{converted.rating}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-900 mb-2">How Matrix Conversion Works</h3>
        <p className="text-sm text-blue-800">
          Risk matrix conversion ensures consistent risk levels when risks are evaluated at different organizational levels. 
          The conversion algorithm maintains the same absolute risk level while adjusting for different matrix scales and thresholds.
        </p>
      </div>
    </div>
  );
}
