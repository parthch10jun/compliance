'use client';

import { useState } from 'react';
import { X, Sparkles, Lightbulb, Target, CheckCircle2, AlertCircle, TrendingUp, Link2, Brain } from 'lucide-react';
import { controls } from '@/lib/data/controls';
import { requirements } from '@/lib/data/requirements-obligations';
import clsx from 'clsx';

interface AIControlMappingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  controlId?: string;
  requirementId?: string;
  onApplyMapping?: (mappings: { controlId: string; requirementIds: string[] } | { requirementId: string; controlIds: string[] }) => void;
}

interface MappingSuggestion {
  id: string;
  code: string;
  title: string;
  confidence: number;
  reasoning: string[];
  category: string;
  riskAlignment: string;
}

export function AIControlMappingAssistant({ 
  isOpen, 
  onClose, 
  controlId, 
  requirementId,
  onApplyMapping 
}: AIControlMappingAssistantProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [suggestions, setSuggestions] = useState<MappingSuggestion[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [analysisInsights, setAnalysisInsights] = useState<{
    controlPurpose?: string;
    requirementPurpose?: string;
    keyThemes: string[];
    bestPractices: string[];
    potentialGaps: string[];
  }>({
    keyThemes: [],
    bestPractices: [],
    potentialGaps: []
  });

  if (!isOpen) return null;

  const control = controlId ? controls.find(c => c.id === controlId) : null;
  const requirement = requirementId ? requirements.find(r => r.id === requirementId) : null;

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    // Simulate AI analysis
    setTimeout(() => {
      if (control) {
        // Analyzing a control to find matching requirements
        const mockSuggestions: MappingSuggestion[] = [
          {
            id: 'req-001',
            code: 'REQ-RBI-001',
            title: 'Implement Multi-Factor Authentication',
            confidence: 95,
            reasoning: [
              'Control implements MFA which directly satisfies this requirement',
              'Both focus on access control and authentication',
              'Control type (Preventive) aligns with requirement intent'
            ],
            category: 'Access Control',
            riskAlignment: 'High'
          },
          {
            id: 'req-002',
            code: 'REQ-RBI-002',
            title: 'Maintain Data Encryption Standards',
            confidence: 72,
            reasoning: [
              'MFA provides additional layer of security for encrypted data access',
              'Complementary control for data protection',
              'Supports overall security posture'
            ],
            category: 'Data Protection',
            riskAlignment: 'Medium'
          },
          {
            id: 'req-003',
            code: 'REQ-ISO-001',
            title: 'Establish Information Security Policy',
            confidence: 68,
            reasoning: [
              'MFA is typically part of information security policy',
              'Demonstrates implementation of security controls',
              'Supports policy enforcement'
            ],
            category: 'Policy & Governance',
            riskAlignment: 'Medium'
          }
        ];

        setSuggestions(mockSuggestions);
        setAnalysisInsights({
          controlPurpose: 'This control enforces multi-factor authentication to prevent unauthorized access to critical systems. It is a preventive control that operates continuously.',
          keyThemes: ['Authentication', 'Access Control', 'Identity Management', 'Security'],
          bestPractices: [
            'Map to all requirements that mandate strong authentication',
            'Consider linking to access control policies',
            'Include in security awareness training requirements'
          ],
          potentialGaps: [
            'May need additional controls for privileged access management',
            'Consider session management controls'
          ]
        });
      } else if (requirement) {
        // Analyzing a requirement to find matching controls
        const mockSuggestions: MappingSuggestion[] = [
          {
            id: 'ctrl-001',
            code: 'CTRL-001',
            title: 'Multi-Factor Authentication (MFA)',
            confidence: 95,
            reasoning: [
              'Directly implements the MFA requirement',
              'Fully automated and continuously monitored',
              'Currently effective with 100% test pass rate'
            ],
            category: 'Access Control',
            riskAlignment: 'High'
          },
          {
            id: 'ctrl-005',
            code: 'CTRL-005',
            title: 'Privileged Access Management',
            confidence: 85,
            reasoning: [
              'Extends MFA to privileged accounts',
              'Provides additional layer of access control',
              'Complements primary MFA control'
            ],
            category: 'Access Control',
            riskAlignment: 'High'
          },
          {
            id: 'ctrl-010',
            code: 'CTRL-010',
            title: 'Access Review and Certification',
            confidence: 70,
            reasoning: [
              'Ensures MFA is properly configured for all users',
              'Periodic validation of access controls',
              'Supports ongoing compliance'
            ],
            category: 'Access Control',
            riskAlignment: 'Medium'
          }
        ];

        setSuggestions(mockSuggestions);
        setAnalysisInsights({
          requirementPurpose: 'This requirement mandates multi-factor authentication for all critical system access to prevent unauthorized access and data breaches.',
          keyThemes: ['Authentication', 'Access Control', 'Security', 'Risk Mitigation'],
          bestPractices: [
            'Implement multiple controls for defense in depth',
            'Include both preventive and detective controls',
            'Ensure controls are tested regularly'
          ],
          potentialGaps: [
            'Consider mobile device authentication',
            'May need controls for emergency access procedures'
          ]
        });
      }

      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2500);
  };

  const toggleSuggestion = (id: string) => {
    setSelectedSuggestions(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    if (onApplyMapping) {
      if (control) {
        onApplyMapping({ controlId: control.id, requirementIds: selectedSuggestions });
      } else if (requirement) {
        onApplyMapping({ requirementId: requirement.id, controlIds: selectedSuggestions });
      }
    }
    onClose();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-700 bg-green-100';
    if (confidence >= 70) return 'text-blue-700 bg-blue-100';
    return 'text-orange-700 bg-orange-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles size={20} />
                AI Mapping Assistant
              </h2>
              <p className="text-sm text-purple-100">
                {control ? 'Find requirements for this control' : 'Find controls for this requirement'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Subject Being Analyzed */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {control ? <Target className="h-5 w-5 text-purple-600" /> : <CheckCircle2 className="h-5 w-5 text-purple-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-purple-700 bg-purple-200 px-2 py-0.5 rounded">
                    {control ? control.code : requirement?.code}
                  </span>
                  <span className="text-xs text-purple-600">
                    {control ? control.category : requirement?.category}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {control ? control.name : requirement?.title}
                </h3>
                <p className="text-sm text-gray-700">
                  {control ? control.description : requirement?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Analysis Button or Results */}
          {!analysisComplete ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className={clsx(
                  "h-8 w-8 text-purple-600",
                  isAnalyzing && "animate-pulse"
                )} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isAnalyzing ? 'Analyzing...' : 'Ready to Analyze'}
              </h3>
              <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                {isAnalyzing
                  ? 'Our AI is analyzing the control/requirement and finding the best matches based on category, purpose, risk alignment, and compliance best practices.'
                  : `Click below to let AI analyze this ${control ? 'control' : 'requirement'} and suggest the best mappings.`
                }
              </p>
              {!isAnalyzing && (
                <button
                  onClick={startAnalysis}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2 mx-auto shadow-lg"
                >
                  <Sparkles size={18} />
                  Start AI Analysis
                </button>
              )}
              {isAnalyzing && (
                <div className="flex items-center justify-center gap-2 text-purple-600">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* AI Insights */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  AI Insights
                </h3>

                {/* Purpose Analysis */}
                {(analysisInsights.controlPurpose || analysisInsights.requirementPurpose) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Purpose Analysis</h4>
                    <p className="text-sm text-blue-800">
                      {analysisInsights.controlPurpose || analysisInsights.requirementPurpose}
                    </p>
                  </div>
                )}

                {/* Key Themes */}
                {analysisInsights.keyThemes.length > 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-purple-900 mb-2">Key Themes Identified</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisInsights.keyThemes.map((theme, idx) => (
                        <span key={idx} className="text-xs font-medium bg-purple-200 text-purple-800 px-2 py-1 rounded">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Best Practices */}
                {analysisInsights.bestPractices.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Best Practices
                    </h4>
                    <ul className="space-y-1">
                      {analysisInsights.bestPractices.map((practice, idx) => (
                        <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span>{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Potential Gaps */}
                {analysisInsights.potentialGaps.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-orange-900 mb-2 flex items-center gap-2">
                      <AlertCircle size={16} />
                      Considerations
                    </h4>
                    <ul className="space-y-1">
                      {analysisInsights.potentialGaps.map((gap, idx) => (
                        <li key={idx} className="text-sm text-orange-800 flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5">•</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Suggested Mappings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    Suggested Mappings ({suggestions.length})
                  </h3>
                  <span className="text-xs text-gray-600">
                    {selectedSuggestions.length} selected
                  </span>
                </div>

                <div className="space-y-3">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      onClick={() => toggleSuggestion(suggestion.id)}
                      className={clsx(
                        "border-2 rounded-lg p-4 cursor-pointer transition-all",
                        selectedSuggestions.includes(suggestion.id)
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300 bg-white"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={clsx(
                          "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                          selectedSuggestions.includes(suggestion.id)
                            ? "border-purple-600 bg-purple-600"
                            : "border-gray-300"
                        )}>
                          {selectedSuggestions.includes(suggestion.id) && (
                            <CheckCircle2 size={14} className="text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-gray-700 bg-gray-200 px-2 py-0.5 rounded">
                              {suggestion.code}
                            </span>
                            <span className={clsx(
                              "text-xs font-semibold px-2 py-0.5 rounded",
                              getConfidenceColor(suggestion.confidence)
                            )}>
                              {suggestion.confidence}% Match
                            </span>
                            <span className="text-xs text-gray-600">
                              {suggestion.category}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">{suggestion.title}</h4>
                          <div className="space-y-1">
                            {suggestion.reasoning.map((reason, idx) => (
                              <div key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-purple-600 mt-0.5">✓</span>
                                <span>{reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={selectedSuggestions.length === 0}
                  className={clsx(
                    "px-4 py-2 rounded-lg transition-colors flex items-center gap-2",
                    selectedSuggestions.length > 0
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <Link2 size={18} />
                  Apply {selectedSuggestions.length} Mapping{selectedSuggestions.length !== 1 ? 's' : ''}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

