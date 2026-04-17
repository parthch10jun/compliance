'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Edit, Trash2, AlertCircle, CheckCircle2, Calendar, DollarSign, TrendingUp, Link as LinkIcon } from 'lucide-react';
import clsx from 'clsx';
import { mockERMControls, type ERMControl } from '@/lib/data/erm-controls';
import { mockRisks } from '@/lib/data/erm-risks';

export default function ControlDetailPage() {
  const params = useParams();
  const router = useRouter();
  const controlId = params.id as string;
  
  const control = mockERMControls.find(c => c.id === controlId);
  
  if (!control) {
    return (
      <div>
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold mb-2">Control Not Found</h2>
          <p className="text-[var(--foreground-muted)] mb-4">The control you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/erm/controls')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
          >
            Back to Controls Library
          </button>
        </div>
      </div>
    );
  }

  const linkedRisks = mockRisks.filter(r => control.linkedRisks.includes(r.id));

  const getStatusColor = (status: ERMControl['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Not Started': return 'bg-gray-100 text-gray-700';
      case 'Overdue': return 'bg-red-100 text-red-700';
      case 'On Hold': return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'Very Effective': return 'bg-green-100 text-green-700';
      case 'Effective': return 'bg-blue-100 text-blue-700';
      case 'Moderately Effective': return 'bg-yellow-100 text-yellow-700';
      case 'Ineffective': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/erm/controls')}
          className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Controls Library
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={24} className="text-[var(--primary)]" />
              <h1 className="text-h2 font-bold text-[var(--foreground)]">{control.id}</h1>
              <span className={clsx('px-3 py-1 text-sm font-medium rounded-full', getStatusColor(control.status))}>
                {control.status}
              </span>
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-700">
                {control.type}
              </span>
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                {control.category}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">{control.name}</h2>
            <p className="text-p1 text-[var(--foreground-muted)] mb-4">{control.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push(`/erm/controls/${control.id}/edit`)}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
            >
              <Edit size={18} />
              Edit Control
            </button>
            <button className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="col-span-2 space-y-6">
          {/* Effectiveness Section */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Effectiveness Assessment
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <div className="text-sm text-[var(--foreground-muted)] mb-2">Qualitative Rating</div>
                <span className={clsx('px-4 py-2 rounded-lg font-semibold inline-block', getEffectivenessColor(control.effectivenessQualitative))}>
                  {control.effectivenessQualitative}
                </span>
              </div>
              
              {control.effectivenessQuantitative !== undefined && (
                <div>
                  <div className="text-sm text-[var(--foreground-muted)] mb-2">Quantitative Rating</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-green-600"
                        style={{ width: `${control.effectivenessQuantitative}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-green-600">{control.effectivenessQuantitative}%</span>
                  </div>
                </div>
              )}
            </div>

            {control.effectivenessRationale && (
              <div>
                <div className="text-sm text-[var(--foreground-muted)] mb-2">Rationale</div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">{control.effectivenessRationale}</p>
                </div>
              </div>
            )}
          </div>

          {/* Treatment Effects - RM_TR_09 */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Risk Treatment Effects</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-sm text-orange-700 mb-2">Likelihood Reduction</div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(val => (
                    <div
                      key={val}
                      className={clsx(
                        'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                        val <= (control.likelihoodReduction || 0)
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      )}
                    >
                      {val}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-orange-600 mt-2 font-medium">
                  Reduces likelihood by {control.likelihoodReduction || 0} level{(control.likelihoodReduction || 0) !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-sm text-red-700 mb-2">Consequence Reduction</div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(val => (
                    <div
                      key={val}
                      className={clsx(
                        'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                        val <= (control.consequenceReduction || 0)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      )}
                    >
                      {val}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-red-600 mt-2 font-medium">
                  Reduces consequence by {control.consequenceReduction || 0} level{(control.consequenceReduction || 0) !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Cost Information - RM_TR_08, RM_TR_23 */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <DollarSign size={20} />
              Cost Information
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mb-4">
              {control.costQualitative && (
                <div>
                  <div className="text-sm text-[var(--foreground-muted)] mb-2">Qualitative Cost</div>
                  <div className="text-lg font-semibold">{control.costQualitative}</div>
                </div>
              )}
              
              {control.costQuantitative && (
                <div>
                  <div className="text-sm text-[var(--foreground-muted)] mb-2">Quantitative Cost</div>
                  <div className="text-lg font-semibold">
                    ${control.costQuantitative.toLocaleString()} {control.costCurrency || 'USD'}
                  </div>
                </div>
              )}
            </div>

            {control.costAssumptions && (
              <div>
                <div className="text-sm text-[var(--foreground-muted)] mb-2">Cost Assumptions</div>
                <div className="bg-gray-50 border border-[var(--border)] rounded-lg p-4">
                  <p className="text-sm">{control.costAssumptions}</p>
                </div>
              </div>
            )}
          </div>

          {/* Linked Risks - RM_TR_06, RM_TR_07 */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <LinkIcon size={20} />
              Linked Risks ({linkedRisks.length})
            </h2>
            
            {linkedRisks.length > 0 ? (
              <div className="space-y-3">
                {linkedRisks.map(risk => (
                  <div
                    key={risk.id}
                    onClick={() => router.push(`/erm/risk-register/${risk.id}`)}
                    className="p-4 border border-[var(--border)] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[var(--primary)]">{risk.id}</span>
                          <span className={clsx(
                            'px-2 py-0.5 text-xs font-medium rounded',
                            risk.residualRating === 'Critical' ? 'bg-red-100 text-red-700' :
                            risk.residualRating === 'High' ? 'bg-orange-100 text-orange-700' :
                            risk.residualRating === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          )}>
                            {risk.residualRating}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-[var(--foreground)]">{risk.title}</h3>
                        <p className="text-xs text-[var(--foreground-muted)] mt-1">{risk.category} • {risk.owner}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--foreground-muted)] text-center py-8">No risks linked to this control</p>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar Info */}
        <div className="space-y-6">
          {/* Control Information */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Control Information</h2>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">ID</div>
                <div className="text-sm font-medium">{control.id}</div>
              </div>
              
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Type</div>
                <div className="text-sm font-medium">{control.type}</div>
              </div>
              
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Category</div>
                <div className="text-sm font-medium">{control.category}</div>
              </div>
              
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Status</div>
                <div className="text-sm font-medium">{control.status}</div>
              </div>
              
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Owner</div>
                <div className="text-sm font-medium">{control.owner}</div>
              </div>
              
              {control.monitor && (
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Monitor</div>
                  <div className="text-sm font-medium">{control.monitor}</div>
                </div>
              )}
            </div>
          </div>

          {/* Implementation Timeline - RM_TR_17, RM_TR_18 */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Timeline
            </h2>
            
            <div className="space-y-3">
              {control.implementationDate && (
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Implementation Date</div>
                  <div className="text-sm font-medium">
                    {new Date(control.implementationDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              )}
              
              {control.dueDate && (
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Due Date</div>
                  <div className="text-sm font-medium">
                    {new Date(control.dueDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              )}
              
              {control.completionDate && (
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Completion Date</div>
                  <div className="text-sm font-medium">
                    {new Date(control.completionDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Review Schedule - RM_TR_19, RM_TR_20 */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Review Schedule</h2>
            
            <div className="space-y-3">
              {control.reviewFrequency && (
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Review Frequency</div>
                  <div className="text-sm font-medium">{control.reviewFrequency}</div>
                </div>
              )}
              
              {control.reviewDate && (
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Last Review</div>
                  <div className="text-sm font-medium">
                    {new Date(control.reviewDate).toLocaleDateString()}
                  </div>
                </div>
              )}
              
              {control.nextReviewDate && (
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Next Review</div>
                  <div className="text-sm font-medium">
                    {new Date(control.nextReviewDate).toLocaleDateString()}
                  </div>
                  {/* Check if review is upcoming (within 30 days) */}
                  {new Date(control.nextReviewDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 && (
                    <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                      ⚠️ Review due soon
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Metadata</h2>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Created By</div>
                <div className="text-sm font-medium">{control.createdBy}</div>
              </div>
              
              <div>
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Created Date</div>
                <div className="text-sm font-medium">
                  {new Date(control.createdDate).toLocaleDateString()}
                </div>
              </div>
              
              {control.modifiedBy && (
                <>
                  <div>
                    <div className="text-xs text-[var(--foreground-muted)] mb-1">Modified By</div>
                    <div className="text-sm font-medium">{control.modifiedBy}</div>
                  </div>
                  
                  {control.modifiedDate && (
                    <div>
                      <div className="text-xs text-[var(--foreground-muted)] mb-1">Modified Date</div>
                      <div className="text-sm font-medium">
                        {new Date(control.modifiedDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
