# Feature Tier Implementation Guide

## 🎯 Overview

This guide provides technical implementation details for enforcing feature tiers (Lite, Pro, Enterprise) in the Compliance Instance SaaS platform.

---

## 📁 Recommended File Structure

```
src/lib/
├── tiers/
│   ├── config.ts              # Tier definitions and limits
│   ├── permissions.ts         # Permission checking utilities
│   ├── middleware.ts          # Route protection middleware
│   └── hooks.ts               # React hooks for tier checks
├── types/
│   └── subscription.ts        # Subscription and tier types
└── utils/
    └── tier-checker.ts        # Utility functions
```

---

## 🔧 Implementation Steps

### 1. Define Tier Configuration (`src/lib/tiers/config.ts`)

```typescript
export type TierName = 'lite' | 'pro' | 'enterprise';

export interface TierLimits {
  maxUsers: number | 'unlimited';
  storageGB: number | 'unlimited';

  // Module Access
  modules: {
    // Core modules (all tiers)
    programs: boolean;
    requirements: boolean;
    controls: boolean;
    evidence: boolean;
    testing: boolean;
    issueTracker: 'basic' | 'advanced' | false;
    basicDashboard: boolean;

    // Pro+ modules
    obligations: boolean;
    executiveDashboard: boolean;
    riskManagement: boolean;
    riskHeatMap: boolean;
    internalAudit: boolean;
    complianceCalendar: boolean;
    playbooks: boolean;
    library: boolean;

    // Enterprise-only modules
    regulatoryIntelligence: boolean;
    predictiveCompliance: boolean;
    visualBuilder: boolean;
    setupWizard: boolean;
    authorityManagement: boolean;
    assessmentManagement: boolean;
    assetManagement: boolean;
    policyManagement: boolean;
  };

  // Feature Access
  features: {
    // Compliance scoring
    complianceScoring: 'simple' | 'advanced' | 'ai-enhanced';

    // Workflows
    workflowAutomation: 'manual' | 'semi' | 'full';
    evidenceApproval: 'basic' | 'multi-role' | 'ai-assisted';
    bulkOperations: boolean;

    // Integrations
    apiAccess: 'none' | 'readonly' | 'full';
    slackTeams: boolean;
    calendarSync: boolean;
    webhooks: boolean;
    ssoSaml: boolean;
    grcIntegration: boolean;
    siemIntegration: boolean;
    customIntegrations: boolean;

    // Customization
    customBranding: boolean;
    multiTenant: boolean;
    customRoles: 'none' | 'basic' | 'advanced';

    // AI Features
    aiInsights: boolean;
    automatedRecommendations: boolean;
    regulatoryChangeTracking: boolean;
  };

  // Support & SLA
  support: {
    responseTime: '48h' | '24h' | '1h';
    channels: string[];
    uptimeSLA: '99%' | '99.5%' | '99.9%';
    dedicatedCSM: boolean;
  };
}

export const TIER_CONFIG: Record<TierName, TierLimits> = {
  lite: {
    maxUsers: 3,
    storageGB: 10,

    modules: {
      // Core modules
      programs: true,
      requirements: true,
      controls: true,
      evidence: true,
      testing: true,
      issueTracker: 'basic',
      basicDashboard: true,

      // Pro+ modules - NOT available
      obligations: false,
      executiveDashboard: false,
      riskManagement: false,
      riskHeatMap: false,
      internalAudit: false,
      complianceCalendar: false,
      playbooks: false,
      library: false,

      // Enterprise-only modules - NOT available
      regulatoryIntelligence: false,
      predictiveCompliance: false,
      visualBuilder: false,
      setupWizard: false,
      authorityManagement: false,
      assessmentManagement: false,
      assetManagement: false,
      policyManagement: false,
    },

    features: {
      complianceScoring: 'simple',
      workflowAutomation: 'manual',
      evidenceApproval: 'basic',
      bulkOperations: false,

      apiAccess: 'none',
      slackTeams: false,
      calendarSync: false,
      webhooks: false,
      ssoSaml: false,
      grcIntegration: false,
      siemIntegration: false,
      customIntegrations: false,

      customBranding: false,
      multiTenant: false,
      customRoles: 'none',

      aiInsights: false,
      automatedRecommendations: false,
      regulatoryChangeTracking: false,
    },

    support: {
      responseTime: '48h',
      channels: ['email'],
      uptimeSLA: '99%',
      dedicatedCSM: false,
    },
  },

  pro: {
    maxUsers: 10,
    storageGB: 100,

    modules: {
      // Core modules
      programs: true,
      requirements: true,
      controls: true,
      evidence: true,
      testing: true,
      issueTracker: 'advanced',
      basicDashboard: true,

      // Pro+ modules - AVAILABLE
      obligations: true,
      executiveDashboard: true,
      riskManagement: true,
      riskHeatMap: true,
      internalAudit: true,
      complianceCalendar: true,
      playbooks: true,
      library: true,

      // Enterprise-only modules - NOT available
      regulatoryIntelligence: false,
      predictiveCompliance: false,
      visualBuilder: false,
      setupWizard: false,
      authorityManagement: false,
      assessmentManagement: false,
      assetManagement: false,
      policyManagement: false,
    },

    features: {
      complianceScoring: 'advanced',
      workflowAutomation: 'semi',
      evidenceApproval: 'multi-role',
      bulkOperations: true,

      apiAccess: 'readonly',
      slackTeams: true,
      calendarSync: true,
      webhooks: true,
      ssoSaml: false,
      grcIntegration: false,
      siemIntegration: false,
      customIntegrations: false,

      customBranding: false,
      multiTenant: false,
      customRoles: 'basic',

      aiInsights: false,
      automatedRecommendations: false,
      regulatoryChangeTracking: false,
    },

    support: {
      responseTime: '24h',
      channels: ['email', 'chat'],
      uptimeSLA: '99.5%',
      dedicatedCSM: false,
    },
  },

  enterprise: {
    maxUsers: 'unlimited',
    storageGB: 'unlimited',

    modules: {
      // Core modules
      programs: true,
      requirements: true,
      controls: true,
      evidence: true,
      testing: true,
      issueTracker: 'advanced',
      basicDashboard: true,

      // Pro+ modules - AVAILABLE
      obligations: true,
      executiveDashboard: true,
      riskManagement: true,
      riskHeatMap: true,
      internalAudit: true,
      complianceCalendar: true,
      playbooks: true,
      library: true,

      // Enterprise-only modules - AVAILABLE
      regulatoryIntelligence: true,
      predictiveCompliance: true,
      visualBuilder: true,
      setupWizard: true,
      authorityManagement: true,
      assessmentManagement: true,
      assetManagement: true,
      policyManagement: true,
    },

    features: {
      complianceScoring: 'ai-enhanced',
      workflowAutomation: 'full',
      evidenceApproval: 'ai-assisted',
      bulkOperations: true,

      apiAccess: 'full',
      slackTeams: true,
      calendarSync: true,
      webhooks: true,
      ssoSaml: true,
      grcIntegration: true,
      siemIntegration: true,
      customIntegrations: true,

      customBranding: true,
      multiTenant: true,
      customRoles: 'advanced',

      aiInsights: true,
      automatedRecommendations: true,
      regulatoryChangeTracking: true,
    },

    support: {
      responseTime: '1h',
      channels: ['email', 'chat', 'phone'],
      uptimeSLA: '99.9%',
      dedicatedCSM: true,
    },
  },
};
```

### 2. Create Subscription Types (`src/lib/types/subscription.ts`)

```typescript
import { TierName } from '../tiers/config';

export interface Subscription {
  id: string;
  organizationId: string;
  tier: TierName;
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  trialEndsAt?: string;
  
  // Usage tracking
  currentUsage: {
    programs: number;
    users: number;
    requirements: number;
    controls: number;
    evidence: number;
    testsThisYear: number;
    storageUsedGB: number;
  };
  
  // Add-ons
  addOns: {
    extraPrograms?: number;
    extraStorage?: number;
    extraUsers?: number;
  };
  
  createdAt: string;
  updatedAt: string;
}
```

### 3. Permission Checking Utilities (`src/lib/tiers/permissions.ts`)

```typescript
import { TIER_CONFIG, TierName } from './config';
import { Subscription } from '../types/subscription';

export class TierPermissions {
  constructor(private subscription: Subscription) {}

  // User management
  canAddUser(): boolean {
    const limit = TIER_CONFIG[this.subscription.tier].maxUsers;
    if (limit === 'unlimited') return true;
    const totalAllowed = limit + (this.subscription.addOns.extraUsers || 0);
    return this.subscription.currentUsage.users < totalAllowed;
  }

  // Module access checks
  hasModule(module: keyof typeof TIER_CONFIG.lite.modules): boolean {
    const moduleAccess = TIER_CONFIG[this.subscription.tier].modules[module];
    // Handle boolean and string values
    return moduleAccess !== false;
  }

  canAccessObligations(): boolean {
    return this.hasModule('obligations');
  }

  canAccessRiskManagement(): boolean {
    return this.hasModule('riskManagement');
  }

  canAccessExecutiveDashboard(): boolean {
    return this.hasModule('executiveDashboard');
  }

  canAccessAIFeatures(): boolean {
    return this.hasModule('regulatoryIntelligence') ||
           this.hasModule('predictiveCompliance');
  }

  // Feature access checks
  hasFeature(feature: keyof typeof TIER_CONFIG.lite.features): boolean {
    const featureValue = TIER_CONFIG[this.subscription.tier].features[feature];
    // Handle boolean and string values
    return featureValue !== false && featureValue !== 'none';
  }

  getComplianceScoringLevel(): 'simple' | 'advanced' | 'ai-enhanced' {
    return TIER_CONFIG[this.subscription.tier].features.complianceScoring;
  }

  getWorkflowAutomationLevel(): 'manual' | 'semi' | 'full' {
    return TIER_CONFIG[this.subscription.tier].features.workflowAutomation;
  }

  getApiAccessLevel(): 'none' | 'readonly' | 'full' {
    return TIER_CONFIG[this.subscription.tier].features.apiAccess;
  }

  // Storage checks
  canUploadFile(fileSizeBytes: number): boolean {
    const limit = TIER_CONFIG[this.subscription.tier].storageGB;
    if (limit === 'unlimited') return true;

    const limitBytes = limit * 1024 * 1024 * 1024; // Convert GB to bytes
    const currentBytes = this.subscription.currentUsage.storageUsedGB * 1024 * 1024 * 1024;

    return (currentBytes + fileSizeBytes) <= limitBytes;
  }

  // Get upgrade suggestions
  getUpgradeSuggestion(requestedFeature: string): string {
    const currentTier = this.subscription.tier;

    if (currentTier === 'lite') {
      return 'Upgrade to Pro to unlock advanced modules and automation';
    } else if (currentTier === 'pro') {
      return 'Upgrade to Enterprise to unlock AI-powered features';
    }

    return '';
  }
}
```

### 4. React Hooks for Tier Checks (`src/lib/tiers/hooks.ts`)

```typescript
'use client';

import { useContext, createContext } from 'react';
import { Subscription } from '../types/subscription';
import { TierPermissions } from './permissions';

const SubscriptionContext = createContext<Subscription | null>(null);

export function useSubscription() {
  const subscription = useContext(SubscriptionContext);
  if (!subscription) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return subscription;
}

export function useTierPermissions() {
  const subscription = useSubscription();
  return new TierPermissions(subscription);
}

export function useFeatureAccess(feature: string) {
  const permissions = useTierPermissions();
  return permissions.hasFeature(feature as any);
}

// Usage in components:
// const canUseAdvancedDashboards = useFeatureAccess('advancedDashboards');
// const canCreateProgram = useTierPermissions().canCreateProgram();
```

### 5. UI Components for Tier Restrictions

```typescript
// src/components/TierGate.tsx
'use client';

import { useTierPermissions } from '@/lib/tiers/hooks';
import { Lock } from 'lucide-react';

interface TierGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function TierGate({ feature, children, fallback }: TierGateProps) {
  const permissions = useTierPermissions();
  const hasAccess = permissions.hasFeature(feature as any);

  if (!hasAccess) {
    return fallback || (
      <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center">
        <Lock className="mx-auto mb-3 text-gray-400" size={32} />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Upgrade Required
        </h3>
        <p className="text-gray-600 mb-4">
          This feature is available in Pro and Enterprise tiers.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Upgrade Now
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

// Usage:
// <TierGate feature="advancedDashboards">
//   <AdvancedDashboard />
// </TierGate>
```

### 6. Route Protection Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TIER_PROTECTED_ROUTES = {
  '/dashboard/executive': ['pro', 'enterprise'],
  '/dashboard/risk-heatmap': ['pro', 'enterprise'],
  '/regulatory-intelligence': ['enterprise'],
  '/predictive-compliance': ['enterprise'],
  '/builder': ['enterprise'],
  '/admin': ['enterprise'],
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if route requires tier protection
  const requiredTiers = TIER_PROTECTED_ROUTES[pathname];
  if (!requiredTiers) {
    return NextResponse.next();
  }

  // Get user's subscription tier (from session/cookie/header)
  const userTier = request.cookies.get('subscription_tier')?.value || 'lite';

  // Check if user has access
  if (!requiredTiers.includes(userTier)) {
    return NextResponse.redirect(new URL('/upgrade', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/regulatory-intelligence',
    '/predictive-compliance',
    '/builder',
    '/admin',
  ],
};
```

### 7. Database Schema Additions

```sql
-- Add to your database schema

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('lite', 'pro', 'enterprise')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'trial', 'expired', 'cancelled')),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  trial_ends_at TIMESTAMP,

  -- Usage tracking
  current_programs INTEGER DEFAULT 0,
  current_users INTEGER DEFAULT 0,
  current_requirements INTEGER DEFAULT 0,
  current_controls INTEGER DEFAULT 0,
  current_evidence INTEGER DEFAULT 0,
  current_tests_this_year INTEGER DEFAULT 0,
  storage_used_gb DECIMAL(10,2) DEFAULT 0,

  -- Add-ons
  extra_programs INTEGER DEFAULT 0,
  extra_storage INTEGER DEFAULT 0,
  extra_users INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id),
  event_type VARCHAR(50) NOT NULL, -- 'program_created', 'user_added', etc.
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  delta INTEGER DEFAULT 1, -- +1 for creation, -1 for deletion
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trigger to update usage counts
CREATE OR REPLACE FUNCTION update_subscription_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the appropriate counter based on event_type
  -- This is a simplified example
  UPDATE subscriptions
  SET current_programs = current_programs + NEW.delta
  WHERE id = NEW.subscription_id
  AND NEW.resource_type = 'program';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER usage_event_trigger
AFTER INSERT ON usage_events
FOR EACH ROW
EXECUTE FUNCTION update_subscription_usage();
```

### 8. API Endpoints for Tier Management

```typescript
// app/api/subscription/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { TierPermissions } from '@/lib/tiers/permissions';

export async function POST(request: NextRequest) {
  const { action, resourceType } = await request.json();

  // Get subscription from database
  const subscription = await getSubscription(request);
  const permissions = new TierPermissions(subscription);

  let canPerform = false;

  switch (action) {
    case 'create_program':
      canPerform = permissions.canCreateProgram();
      break;
    case 'add_user':
      canPerform = permissions.canAddUser();
      break;
    // Add more cases
  }

  return NextResponse.json({
    allowed: canPerform,
    tier: subscription.tier,
    limit: getTierLimit(subscription.tier, resourceType),
    current: subscription.currentUsage[resourceType],
  });
}
```

### 9. Usage Tracking Implementation

```typescript
// src/lib/utils/usage-tracker.ts
export class UsageTracker {
  static async trackCreation(
    subscriptionId: string,
    resourceType: 'program' | 'user' | 'requirement' | 'control' | 'evidence',
    resourceId: string
  ) {
    // Log usage event
    await db.usageEvents.create({
      subscriptionId,
      eventType: `${resourceType}_created`,
      resourceType,
      resourceId,
      delta: 1,
    });
  }

  static async trackDeletion(
    subscriptionId: string,
    resourceType: string,
    resourceId: string
  ) {
    await db.usageEvents.create({
      subscriptionId,
      eventType: `${resourceType}_deleted`,
      resourceType,
      resourceId,
      delta: -1,
    });
  }

  static async getCurrentUsage(subscriptionId: string) {
    const subscription = await db.subscriptions.findUnique({
      where: { id: subscriptionId },
    });
    return subscription.currentUsage;
  }
}
```

### 10. Upgrade Flow Implementation

```typescript
// src/components/UpgradeModal.tsx
'use client';

import { useState } from 'react';
import { useSubscription } from '@/lib/tiers/hooks';

export function UpgradeModal({ isOpen, onClose, requiredTier }) {
  const subscription = useSubscription();
  const [selectedTier, setSelectedTier] = useState(requiredTier);

  const handleUpgrade = async () => {
    // Call Stripe/payment API
    const response = await fetch('/api/subscription/upgrade', {
      method: 'POST',
      body: JSON.stringify({ newTier: selectedTier }),
    });

    if (response.ok) {
      window.location.href = response.url; // Redirect to Stripe checkout
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Upgrade Your Plan</h2>
      <p>You need {requiredTier} tier to access this feature.</p>

      <div className="tier-options">
        {/* Show tier comparison */}
      </div>

      <button onClick={handleUpgrade}>
        Upgrade to {selectedTier}
      </button>
    </Modal>
  );
}
```

---

## 🎯 Implementation Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Create tier configuration files
- [ ] Define subscription types
- [ ] Set up database schema
- [ ] Implement permission checking utilities

### Phase 2: UI Integration (Week 3-4)
- [ ] Create TierGate component
- [ ] Add upgrade prompts throughout UI
- [ ] Implement usage tracking
- [ ] Add tier badges to navigation

### Phase 3: Enforcement (Week 5-6)
- [ ] Add route protection middleware
- [ ] Implement API tier checks
- [ ] Add creation limits
- [ ] Test all tier restrictions

### Phase 4: Billing Integration (Week 7-8)
- [ ] Integrate Stripe/payment provider
- [ ] Implement upgrade flow
- [ ] Add downgrade handling
- [ ] Set up webhooks for subscription changes

### Phase 5: Analytics & Monitoring (Week 9-10)
- [ ] Track feature usage by tier
- [ ] Monitor upgrade conversion rates
- [ ] Implement usage alerts
- [ ] Create admin dashboard for tier management

---

## 📊 Testing Strategy

### Unit Tests
```typescript
describe('TierPermissions', () => {
  it('should allow program creation for lite tier within limits', () => {
    const subscription = createMockSubscription('lite', { programs: 0 });
    const permissions = new TierPermissions(subscription);
    expect(permissions.canCreateProgram()).toBe(true);
  });

  it('should block program creation for lite tier at limit', () => {
    const subscription = createMockSubscription('lite', { programs: 1 });
    const permissions = new TierPermissions(subscription);
    expect(permissions.canCreateProgram()).toBe(false);
  });
});
```

### Integration Tests
- Test upgrade flow end-to-end
- Verify tier restrictions on all protected routes
- Test usage tracking accuracy
- Verify billing webhook handling

---

## 🚀 Deployment Considerations

1. **Feature Flags**: Use feature flags to gradually roll out tier restrictions
2. **Grandfather Existing Users**: Consider grandfathering existing users on old pricing
3. **Grace Period**: Provide grace period when users exceed limits
4. **Clear Communication**: Show clear upgrade prompts with value proposition
5. **Analytics**: Track which features drive upgrades

---

**Last Updated:** March 2026
**Version:** 1.0

