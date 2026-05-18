'use client';

/**
 * Advanced Delegation Form
 * Implements BR-DEL-01 through BR-DEL-10
 */

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle, XCircle, Users, Calendar, 
  DollarSign, Shield, Clock, AlertCircle, Zap 
} from 'lucide-react';
import type { 
  HRMSUser, 
  Role, 
  DelegationType, 
  DelegationScope,
  AdvancedDelegation 
} from '@/lib/doa/types/delegation-types';
import { mockHRMSUsers, mockRoles, getUserById, getRoleById } from '@/lib/doa/data/mockHRMS';
import { 
  validateDelegation, 
  resolveActiveApprover 
} from '@/lib/doa/utils/delegation-validation';

interface AdvancedDelegationFormProps {
  onSave?: (delegation: Partial<AdvancedDelegation>) => void;
  onCancel?: () => void;
}

export default function AdvancedDelegationForm({ onSave, onCancel }: AdvancedDelegationFormProps) {
  // BR-DEL-01: Role-based selection
  const [delegatorId, setDelegatorId] = useState('');
  const [delegateId, setDelegateId] = useState('');
  const [delegatorUser, setDelegatorUser] = useState<HRMSUser | null>(null);
  const [delegateUser, setDelegateUser] = useState<HRMSUser | null>(null);
  
  // BR-DEL-02: Delegation type
  const [delegationType, setDelegationType] = useState<DelegationType>('temporary');
  
  // BR-DEL-03: Scope configuration
  const [scopeType, setScopeType] = useState<'full' | 'partial'>('full');
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // BR-DEL-04: Monetary cap
  const [monetaryCap, setMonetaryCap] = useState('');
  const [capCurrency, setCapCurrency] = useState('USD');
  
  // BR-DEL-07: Lifecycle
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [autoExpire, setAutoExpire] = useState(true);
  
  // BR-DEL-09: Emergency activation
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyJustification, setEmergencyJustification] = useState('');
  const [authorizingOfficer, setAuthorizingOfficer] = useState('');
  
  // Validation state
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showValidation, setShowValidation] = useState(false);
  
  // Update users when selection changes
  useEffect(() => {
    if (delegatorId) {
      const user = getUserById(delegatorId);
      setDelegatorUser(user || null);
    }
  }, [delegatorId]);
  
  useEffect(() => {
    if (delegateId) {
      const user = getUserById(delegateId);
      setDelegateUser(user || null);
    }
  }, [delegateId]);
  
  // Validate on change
  useEffect(() => {
    if (delegatorUser && delegateUser) {
      const result = validateDelegation(
        delegatorUser.id,
        delegateUser.id,
        monetaryCap ? parseFloat(monetaryCap) : undefined,
        delegatorUser.roles[0]?.authorityLimit || 0,
        [], // Empty for demo - would load from storage
        delegatorUser.grade,
        delegateUser.grade
      );
      setValidationResult(result);
    }
  }, [delegatorUser, delegateUser, monetaryCap]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);
    
    if (!validationResult?.valid) {
      return;
    }
    
    // Build delegation object
    const delegation: Partial<AdvancedDelegation> = {
      id: `del-${Date.now()}`,
      delegatorUser: delegatorUser!,
      delegateUser: delegateUser!,
      delegatorRole: delegatorUser!.roles[0],
      delegateRole: delegateUser!.roles[0],
      type: delegationType,
      scope: {
        full: scopeType === 'full',
        functions: scopeType === 'partial' ? selectedFunctions : undefined,
        categories: scopeType === 'partial' ? selectedCategories : undefined,
        monetaryCap: monetaryCap ? parseFloat(monetaryCap) : undefined,
        currency: capCurrency,
      },
      monetaryCap: monetaryCap ? {
        amount: parseFloat(monetaryCap),
        currency: capCurrency,
        delegatorLimit: delegatorUser!.roles[0].authorityLimit,
        validated: true,
      } : undefined,
      approval: validationResult.approvalRequired,
      circularCheck: validationResult.circularDelegation,
      lifecycle: {
        status: validationResult.approvalRequired.required ? 'pending_approval' : 'active',
        activationDate: startDate || new Date().toISOString(),
        expiryDate: endDate || undefined,
        autoExpire,
        revocable: true,
      },
      emergency: isEmergency ? {
        isEmergency: true,
        activationTimestamp: new Date().toISOString(),
        activationSLA: 60,
        authorizingOfficer,
        complianceReviewRequired: true,
        justification: emergencyJustification,
      } : undefined,
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
    };
    
    onSave?.(delegation);
  };
  
  const availableFunctions = ['Finance', 'IT', 'Procurement', 'HR', 'Legal', 'Operations'];
  const availableCategories = ['Capital Expenditure', 'Operating Expenditure', 'Contracts', 'Hiring'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* BR-DEL-01: Role-Based Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="text-lg font-semibold text-gray-900">Participants (HRMS Integration)</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Delegator */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delegator (Authority Holder)
            </label>
            <select
              value={delegatorId}
              onChange={(e) => setDelegatorId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              required
            >
              <option value="">Select delegator...</option>
              {mockHRMSUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.roles[0]?.name} (Grade {user.grade})
                  {user.isOnLeave ? ' 🏖️ ON LEAVE' : ''}
                </option>
              ))}
            </select>

            {delegatorUser && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Authority Limit:</span>
                  <span className="font-semibold text-gray-900">
                    ${delegatorUser.roles[0]?.authorityLimit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-semibold text-gray-900">
                    {delegatorUser.roles[0]?.department}
                  </span>
                </div>
                {delegatorUser.isOnLeave && (
                  <div className="mt-2 flex items-center gap-2 text-amber-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">
                      On leave: {delegatorUser.leaveStartDate} to {delegatorUser.leaveEndDate}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Delegate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delegate (Receiving Authority)
            </label>
            <select
              value={delegateId}
              onChange={(e) => setDelegateId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              required
            >
              <option value="">Select delegate...</option>
              {mockHRMSUsers.filter(u => u.id !== delegatorId).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.roles[0]?.name} (Grade {user.grade})
                  {user.isOnLeave ? ' 🏖️ ON LEAVE' : ''}
                </option>
              ))}
            </select>

            {delegateUser && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Authority Limit:</span>
                  <span className="font-semibold text-gray-900">
                    ${delegateUser.roles[0]?.authorityLimit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-semibold text-gray-900">
                    {delegateUser.roles[0]?.department}
                  </span>
                </div>
                {delegateUser.isOnLeave && (
                  <div className="mt-2 flex items-center gap-2 text-amber-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">Currently on leave</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BR-DEL-02: Delegation Type */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delegation Type</h3>

        <div className="grid grid-cols-4 gap-3">
          {[
            { value: 'temporary', label: 'Temporary', desc: 'Date-bounded delegation' },
            { value: 'permanent', label: 'Permanent', desc: 'Primary holder assignment' },
            { value: 'acting', label: 'Acting', desc: 'Interim coverage' },
            { value: 'ooo', label: 'Out of Office', desc: 'Leave coverage' },
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setDelegationType(type.value as DelegationType)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                delegationType === type.value
                  ? 'border-[#F59E0B] bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">{type.label}</div>
              <div className="text-xs text-gray-600 mt-1">{type.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* BR-DEL-03: Partial Scope Delegation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delegation Scope</h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setScopeType('full')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                scopeType === 'full'
                  ? 'border-[#F59E0B] bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">Full Authority</div>
              <div className="text-xs text-gray-600 mt-1">Delegate entire role authority</div>
            </button>

            <button
              type="button"
              onClick={() => setScopeType('partial')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                scopeType === 'partial'
                  ? 'border-[#F59E0B] bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">Partial Scope</div>
              <div className="text-xs text-gray-600 mt-1">Specific functions & limits</div>
            </button>
          </div>

          {scopeType === 'partial' && (
            <div className="mt-4 space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Functions (Select which functions to delegate)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableFunctions.map((func) => (
                    <label key={func} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 cursor-pointer hover:border-[#F59E0B]">
                      <input
                        type="checkbox"
                        checked={selectedFunctions.includes(func)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFunctions([...selectedFunctions, func]);
                          } else {
                            setSelectedFunctions(selectedFunctions.filter(f => f !== func));
                          }
                        }}
                        className="rounded text-[#F59E0B] focus:ring-[#F59E0B]"
                      />
                      <span className="text-sm text-gray-900">{func}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories (Select transaction categories)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableCategories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 cursor-pointer hover:border-[#F59E0B]">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, cat]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== cat));
                          }
                        }}
                        className="rounded text-[#F59E0B] focus:ring-[#F59E0B]"
                      />
                      <span className="text-sm text-gray-900">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BR-DEL-04: Monetary Cap */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="text-lg font-semibold text-gray-900">Monetary Cap</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Amount (Cannot exceed delegator's limit)
            </label>
            <input
              type="number"
              value={monetaryCap}
              onChange={(e) => setMonetaryCap(e.target.value)}
              placeholder="e.g., 250000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={capCurrency}
              onChange={(e) => setCapCurrency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="AED">AED</option>
              <option value="SAR">SAR</option>
            </select>
          </div>
        </div>

        {delegatorUser && monetaryCap && parseFloat(monetaryCap) > delegatorUser.roles[0]?.authorityLimit && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              <div className="font-semibold">Cap exceeds delegator's authority!</div>
              <div className="mt-1">
                Delegate cap (${parseFloat(monetaryCap).toLocaleString()}) cannot be greater than
                delegator's limit (${delegatorUser.roles[0]?.authorityLimit.toLocaleString()})
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BR-DEL-07: Lifecycle & BR-DEL-09: Emergency */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="text-lg font-semibold text-gray-900">Activation & Lifecycle</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoExpire}
              onChange={(e) => setAutoExpire(e.target.checked)}
              className="rounded text-[#F59E0B] focus:ring-[#F59E0B]"
            />
            <span className="text-sm text-gray-700">Automatically expire on end date</span>
          </label>

          {/* Emergency Delegation */}
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-600"
              />
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-red-900">Emergency Activation (60s SLA)</span>
              </div>
            </label>

            {isEmergency && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Authorizing Officer
                  </label>
                  <select
                    value={authorizingOfficer}
                    onChange={(e) => setAuthorizingOfficer(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    required={isEmergency}
                  >
                    <option value="">Select officer...</option>
                    {mockHRMSUsers.filter(u => u.grade >= 9).map(u => (
                      <option key={u.id} value={u.id}>{u.name} - {u.roles[0]?.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Justification
                  </label>
                  <textarea
                    value={emergencyJustification}
                    onChange={(e) => setEmergencyJustification(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    rows={2}
                    placeholder="Explain why emergency activation is required..."
                    required={isEmergency}
                  />
                </div>

                <div className="text-xs text-red-700">
                  ⚠️ Emergency delegations activate within 60 seconds and require compliance review.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BR-DEL-05 & BR-DEL-06: Validation Results */}
      {showValidation && validationResult && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="text-lg font-semibold text-gray-900">Validation Results</h3>
          </div>

          <div className="space-y-3">
            {/* Errors */}
            {validationResult.errors?.length > 0 && (
              <div className="space-y-2">
                {validationResult.errors.map((error: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Warnings */}
            {validationResult.warnings?.length > 0 && (
              <div className="space-y-2">
                {validationResult.warnings.map((warning: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-700">{warning}</div>
                  </div>
                ))}
              </div>
            )}

            {/* BR-DEL-05: Manager Approval Required */}
            {validationResult.approvalRequired?.required && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <div className="font-semibold">Manager Approval Required</div>
                  <div className="mt-1">
                    {validationResult.approvalRequired.reason === 'grade_difference' && (
                      <>
                        Delegate is {validationResult.approvalRequired.gradeDifference} grade
                        {validationResult.approvalRequired.gradeDifference > 1 ? 's' : ''} below delegator.
                        This delegation will be routed to {delegatorUser?.manager?.name || 'manager'} for approval.
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Success */}
            {validationResult.valid && (
              <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-700">
                  <div className="font-semibold">Validation Passed</div>
                  <div className="mt-1">This delegation meets all requirements and can be created.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowValidation(true)}
            className="px-6 py-2 border border-[#F59E0B] text-[#F59E0B] rounded-lg hover:bg-amber-50 transition-colors"
          >
            Validate
          </button>

          <button
            type="submit"
            disabled={showValidation && !validationResult?.valid}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              showValidation && !validationResult?.valid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#F59E0B] text-white hover:bg-amber-600'
            }`}
          >
            {isEmergency ? '⚡ Activate Emergency Delegation' : 'Create Delegation'}
          </button>
        </div>
      </div>

    </form>
  );
}
