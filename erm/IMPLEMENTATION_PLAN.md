# 🚀 ERM Implementation Plan

> **Phased approach to building the ERM module following ISO 31000**

---

## 🎯 **Implementation Strategy**

### **Approach:**
- ✅ Build frontend-only (matching Compliance approach)
- ✅ Use mock data initially
- ✅ Follow exact design system from Compliance
- ✅ Implement ISO 31000 workflow
- ✅ Support all Critical requirements first

---

## 📅 **Phase 1: Foundation & Risk Register** (Week 1)

### **Priority:** Critical Requirements Only

**Deliverables:**
1. **Risk Register** (`/erm/risk-register`)
   - Table with vertical borders (matching Compliance vendors page)
   - Columns: ID, Title, Owner, Category, Business Unit, Inherent Rating, Residual Rating, Status
   - Sorting, filtering, search
   - Mock data: 50+ risks

2. **Risk Detail Modal**
   - Basic info (ID, title, description, owner)
   - Category assignment [RM_IR_04]
   - Business unit assignment [RM_IR_05]
   - Project assignment [RM_IR_07]
   - Location assignment [RM_IR_08]

3. **Organization Structure** (`/erm/organization`)
   - Tree view of org structure [RM_EC_01]
   - Legal entities, business units, departments
   - Hierarchy visualization

4. **Risk Categories** (`/erm/categories`)
   - Category management [RM_EC_03]
   - Sub-categories
   - Card grid view (like Compliance authorities)

**Requirements Covered:**
- RM_EC_01: Organization structure ✅
- RM_EC_03: Risk categories ✅
- RM_IR_01: Risk attributes ✅
- RM_IR_02: Risk contact ✅
- RM_IR_03: Risk owner ✅
- RM_IR_04: Category assignment ✅
- RM_IR_05: Business unit assignment ✅
- RM_IR_06: Multi-level registers ✅
- RM_IR_07: Project assignment ✅
- RM_IR_08: Location assignment ✅

---

## 📅 **Phase 2: Risk Assessment** (Week 2)

**Deliverables:**
1. **Risk Matrices** (`/erm/matrices`)
   - 5x5 matrix configuration [RM_EC_04]
   - Likelihood scales (1-5, Low-High)
   - Consequence scales (1-5, Insignificant-Catastrophic)
   - Visual heat map representation

2. **Assessment Methods** (`/erm/methods`)
   - Method configuration [RM_EC_05]
   - Qualitative/Quantitative/Semi-quantitative
   - Bow-tie analysis support

3. **Risk Assessment Page** (in Risk Detail)
   - Inherent risk assessment [RM_AR_15, AR_16]
   - Residual risk assessment
   - Likelihood rating
   - Consequence rating
   - Automatic risk rating calculation [RM_AR_20]

4. **Assessment Campaigns** (`/erm/campaigns`)
   - Create/manage campaigns [RM_AR_01]
   - Campaign lifecycle tracking
   - Separate campaigns [RM_AR_02]

**Requirements Covered:**
- RM_EC_04: Risk matrices ✅
- RM_EC_05: Assessment methods ✅
- RM_AR_01: Assessment campaigns ✅
- RM_AR_02: Separate campaigns ✅
- RM_AR_15: Likelihood estimates ✅
- RM_AR_16: Consequence estimates ✅
- RM_AR_17: Rating calculation ✅
- RM_AR_18: Multiple consequence scales ✅
- RM_AR_19: Multiple likelihood scales ✅
- RM_AR_20: Risk rating calculation ✅

---

## 📅 **Phase 3: Bow-tie & Consequences** (Week 3)

**Deliverables:**
1. **Bow-tie Diagram** (in Risk Detail)
   - Visual bow-tie editor [RM_IR_09-11]
   - Risk sources/causes (left side)
   - Risk event (center)
   - Consequences (right side)
   - Preventive controls (left barriers)
   - Detective controls (right barriers)

2. **Consequence Dimensions**
   - Multi-dimensional consequences [RM_IR_12]
   - Financial impact
   - Health & Safety impact
   - Environmental impact
   - Operational impact
   - Reputational impact
   - Aggregated consequence rating [RM_AR_01]

3. **Objectives Linking**
   - Connect consequences to objectives [RM_IR_13]
   - Objective impact visualization

**Requirements Covered:**
- RM_IR_09: Risk sources ✅
- RM_IR_10: Risk events ✅
- RM_IR_11: Consequences ✅
- RM_IR_12: Multi-dimensional consequences ✅
- RM_IR_13: Objective linkage ✅
- RM_AR_01: Consequence aggregation ✅

---

## 📅 **Phase 4: Risk Treatment** (Week 4)

**Deliverables:**
1. **Treatment Options** (`/erm/treatments`)
   - Treatment library [RM_EC_06]
   - Avoid, prevent, detect, mitigate, accept
   - Treatment measures catalog

2. **Treatment Plans** (in Risk Detail)
   - Assign treatments to risks
   - Treatment effectiveness
   - Residual risk calculation
   - Action item tracking

3. **Controls Library**
   - Reusable controls
   - Control effectiveness ratings
   - Link to treatments

**Requirements Covered:**
- RM_EC_06: Treatment options ✅

---

## 📅 **Phase 5: Monitoring & Reports** (Future)

**Deliverables:**
1. **Risk Heat Map** (`/erm/heat-map`)
   - Interactive 5x5 matrix
   - Drill down by business unit
   - Filter by category

2. **KRI Dashboard** (`/erm/kris`)
   - Key Risk Indicators
   - Trend charts
   - Threshold alerts

3. **Reports** (`/erm/reports`)
   - Executive risk report
   - Risk register export
   - Assessment reports

---

## 🎨 **Design Consistency Checklist**

**Every Page Must Have:**
- ✅ Page header with `text-h1` title and `text-p2` description
- ✅ Cards with `rounded-lg` and `border-[var(--border)]`
- ✅ Tables with vertical borders (matching vendors page)
- ✅ Scorecards with `p-4`, `text-2xl` numbers, `w-9 h-9` icons
- ✅ Typography: `text-p2` (14px), `text-p3` (12px)
- ✅ Indigo color scheme (#6366F1)
- ✅ Hover states with `card-hover` class
- ✅ Spacing: `gap-4` for grids, `mb-8` for sections

---

## 📊 **Mock Data Requirements**

### **For Phase 1:**
```typescript
// 50+ Risks
risks.ts: [
  {
    id: 'RSK-001',
    title: 'Cybersecurity breach',
    owner: 'John Smith (CISO)',
    category: 'Cybersecurity',
    businessUnit: 'IT Department',
    inherentRating: 'Critical',
    residualRating: 'High',
    status: 'Treated'
  },
  // ... 49 more
]

// 20+ Categories
categories.ts: [
  { id: '1', name: 'Cybersecurity', count: 34 },
  { id: '2', name: 'Operational', count: 28 },
  // ... 18 more
]

// Organization structure
orgStructure.ts: {
  entities: [
    {
      id: '1',
      name: 'Ascent Corp',
      type: 'Legal Entity',
      children: [
        { name: 'North America', type: 'Business Unit' },
        { name: 'APAC', type: 'Business Unit' }
      ]
    }
  ]
}
```

---

## 🚀 **Next Steps**

**Immediate Action:**
1. Build Risk Register page (`/erm/risk-register`)
2. Create mock data (50 risks)
3. Implement table with sorting/filtering
4. Add risk detail modal

**Priority Order:**
1. ✅ Risk Register (Core)
2. ✅ Organization Structure
3. ✅ Risk Categories
4. ✅ Risk Matrices
5. ✅ Assessment Campaigns

---

**Shall I start with Phase 1: Risk Register?** 🎯
