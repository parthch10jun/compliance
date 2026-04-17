# 🏗️ ERM Module Architecture - ISO 31000 Based

> **Complete frontend architecture for Enterprise Risk Management based on ISO 31000**

---

## 📚 **ERM Study - What is ERM?**

### **ISO 31000 Risk Management Framework:**

ERM follows the **ISO 31000** standard with these key phases:

```
1. Establish Context      → Setup & Configuration
2. Risk Assessment         → Identify, Analyze, Evaluate
   ├─ Identify Risk       → Risk Register
   ├─ Analyze Risk        → Likelihood & Consequence
   └─ Evaluate Risk       → Risk Rating & Prioritization
3. Risk Treatment          → Mitigation Plans & Controls
4. Monitor & Review        → KRIs, Dashboards, Reports
5. Communication           → Reporting & Collaboration
```

---

## 🎯 **ERM Core Modules (Like Compliance Structure)**

### **Comparison with Compliance:**

| Compliance Module | ERM Module Equivalent | Purpose |
|-------------------|----------------------|---------|
| **Authorities** | **Risk Frameworks** | ISO 31000, COSO ERM, etc. |
| **Programs** | **Risk Universes** | Collections of related risks |
| **Frameworks** | **Risk Categories** | Risk taxonomy & classification |
| **Requirements** | **Risk Events** | Individual risk records |
| **Controls** | **Risk Treatments** | Mitigation actions & controls |
| **Evidence** | **Risk Indicators (KRIs)** | Monitoring & measurement |

---

## 🗂️ **Proposed ERM Module Structure**

Based on your requirements and ISO 31000:

### **1. Context & Setup (Establish Context)**
```
📁 /erm/context
├── Organization Structure    RM_EC_01
├── Objectives               RM_EC_02
├── Risk Categories          RM_EC_03
├── Risk Matrices            RM_EC_04
├── Assessment Methods       RM_EC_05
└── Treatment Options        RM_EC_06
```

### **2. Risk Register (Identify Risk)**
```
📁 /erm/risks
├── Risk Register            RM_IR_01-14
│   ├── Risk ID & Description
│   ├── Risk Owner           RM_IR_03
│   ├── Risk Contact         RM_IR_02
│   ├── Categories           RM_IR_04
│   ├── Business Units       RM_IR_05, IR_06
│   ├── Projects             RM_IR_07
│   ├── Locations            RM_IR_08
│   ├── Sources (Bow-tie)    RM_IR_09
│   ├── Events (Bow-tie)     RM_IR_10
│   └── Consequences         RM_IR_11, IR_12
```

### **3. Risk Assessment (Analyze & Evaluate)**
```
📁 /erm/assessments
├── Assessment Campaigns     RM_AR_01, AR_02
├── Likelihood Rating        RM_AR_15, AR_19
├── Consequence Rating       RM_AR_16, AR_18
├── Risk Calculation         RM_AR_17, AR_20
├── Inherent vs Residual
├── Loss Data                RM_AR_05-14
└── Risk Heat Map
```

### **4. Risk Treatment (Treat Risk)**
```
📁 /erm/treatments
├── Treatment Plans          RM_EC_06
├── Treatment Controls
├── Action Items
├── Assignments
└── Progress Tracking
```

### **5. Monitoring & KRIs (Monitor & Review)**
```
📁 /erm/monitoring
├── Key Risk Indicators
├── Risk Dashboards
├── Trend Analysis
├── Alerts & Notifications
└── Executive Reports
```

### **6. Library & Configuration**
```
📁 /erm/library
├── Risk Frameworks          (ISO 31000, COSO, etc.)
├── Risk Matrices Library
├── Templates
└── Reference Documents
```

---

## 📋 **Requirements Mapping to Modules**

### **Phase 1: Establish Context**
```
Module: /erm/context

Pages:
├── Organization Structure    [RM_EC_01]
│   ├── Legal Entities
│   ├── Business Units
│   ├── Departments
│   ├── Functions
│   ├── Projects
│   └── Locations
│
├── Objectives                [RM_EC_02]
│   ├── Strategic Objectives
│   ├── Operational Objectives
│   └── Objective Hierarchy
│
├── Risk Categories           [RM_EC_03]
│   ├── Category Management
│   ├── Sub-categories
│   └── Category Relationships
│
├── Risk Matrices             [RM_EC_04]
│   ├── Likelihood Scales (1-5, Low-High, etc.)
│   ├── Consequence Scales
│   ├── Matrix Configuration (5x5, 4x4, etc.)
│   └── Threshold Definitions
│
├── Assessment Methods        [RM_EC_05]
│   ├── Qualitative
│   ├── Quantitative
│   ├── Semi-Quantitative
│   ├── Bow-tie Analysis
│   └── Business Unit Aggregation
│
└── Treatment Options         [RM_EC_06]
    ├── Avoid, Prevent, Detect, Mitigate
    ├── Treatment Measures
    └── Control Library
```

### **Phase 2: Risk Register (Identify)**
```
Module: /erm/risks

Main Page: Risk Register Table
├── Columns:
│   ├── Risk ID               [RM_IR_01]
│   ├── Risk Title
│   ├── Description
│   ├── Owner                 [RM_IR_03]
│   ├── Contact               [RM_IR_02]
│   ├── Category              [RM_IR_04]
│   ├── Business Unit         [RM_IR_05]
│   ├── Project               [RM_IR_07]
│   ├── Location              [RM_IR_08]
│   ├── Inherent Risk Rating
│   ├── Residual Risk Rating
│   └── Status
│
└── Features:
    ├── Multi-level hierarchy [RM_IR_06]
    ├── Roll-up/Drill-down
    ├── Filtering & Sorting
    └── Bulk Actions

Risk Detail View:
├── Basic Information
├── Bow-tie Diagram          [RM_IR_09-11]
│   ├── Sources/Causes
│   ├── Risk Event
│   ├── Consequences
│   └── Controls (Preventive/Detective)
├── Consequence Dimensions   [RM_IR_12]
│   ├── Financial
│   ├── Health & Safety
│   ├── Environmental
│   ├── Operational
│   └── Reputational
└── Related Objectives       [RM_IR_13]
```

---

## 🎨 **Page Structure (Matching Compliance)**

### **Navigation Structure:**
```
ERM Dashboard (/)
├── Context
│   ├── Organization         /erm/organization
│   ├── Objectives           /erm/objectives
│   ├── Risk Categories      /erm/categories
│   ├── Risk Matrices        /erm/matrices
│   └── Assessment Methods   /erm/methods
│
├── Risk Management
│   ├── Risk Register        /erm/risk-register  ⭐ Main
│   ├── Assessments          /erm/assessments
│   ├── Treatments           /erm/treatments
│   └── Action Items         /erm/actions
│
├── Analysis
│   ├── Risk Heat Map        /erm/heat-map
│   ├── Trend Analysis       /erm/trends
│   ├── Loss Data            /erm/loss-data
│   └── Reports              /erm/reports
│
├── Monitoring
│   ├── KRIs                 /erm/kris
│   ├── Dashboards           /erm/dashboards
│   └── Alerts               /erm/alerts
│
└── Library
    ├── Frameworks           /erm/library/frameworks
    ├── Templates            /erm/library/templates
    └── Documents            /erm/library/documents
```

---

## 🔄 **Data Model (Frontend)**

### **Core Entities:**

```typescript
// Risk Entity
interface Risk {
  id: string;                    // RM_IR_01
  title: string;
  description: string;
  owner: User;                   // RM_IR_03
  contact: User;                 // RM_IR_02
  categories: Category[];        // RM_IR_04
  businessUnits: OrgUnit[];      // RM_IR_05
  projects: Project[];           // RM_IR_07
  locations: Location[];         // RM_IR_08
  
  // Bow-tie
  sources: RiskSource[];         // RM_IR_09
  event: RiskEvent;              // RM_IR_10
  consequences: Consequence[];   // RM_IR_11
  
  // Assessment
  inherentLikelihood: Rating;
  inherentConsequence: Rating;
  inherentRating: RiskRating;
  residualLikelihood: Rating;
  residualConsequence: Rating;
  residualRating: RiskRating;
  
  // Treatment
  treatments: Treatment[];
  controls: Control[];
  
  status: 'identified' | 'assessed' | 'treated' | 'monitored';
  createdAt: Date;
  updatedAt: Date;
}

// Organization Structure
interface OrgUnit {              // RM_EC_01
  id: string;
  name: string;
  type: 'entity' | 'business_unit' | 'department' | 'function';
  parent?: OrgUnit;
  children: OrgUnit[];
  objectives: Objective[];
}

// Risk Category
interface Category {             // RM_EC_03
  id: string;
  name: string;
  parent?: Category;
  subcategories: Category[];
}

// Risk Matrix
interface RiskMatrix {           // RM_EC_04
  id: string;
  name: string;
  likelihoodScale: Scale;
  consequenceScale: Scale;
  cells: MatrixCell[][];
}

// Assessment Campaign
interface AssessmentCampaign {   // RM_AR_01
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed';
  risks: Risk[];
  participants: User[];
}
```

---

**Next:** Shall I build Phase 1 with the Risk Register page? 🚀
