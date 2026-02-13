# [DEMO] PayMe India Demo Features

This folder contains demo-specific features for client demonstrations. All demo content is isolated and can be easily toggled on/off or removed entirely.

## 🎯 Purpose

Created for **PayMe India** compliance demo to showcase:
- NBFC compliance automation
- RBI & ISO playbooks
- Digital lending compliance
- DPDP Act implementation
- Real-world workflows

## 📁 Demo Files

```
src/lib/demo/
├── config.ts              # Demo configuration & feature flags
├── payme-program.ts       # 4 PayMe India compliance programs
├── payme-obligations.ts   # 8 realistic upcoming obligations
├── payme-requirements.ts  # 13 regulatory requirements
├── payme-controls.ts      # 18 implementing controls
├── playbooks.ts           # 4 compliance playbooks/workflows
├── index.ts               # Central export point
└── README.md              # This file
```

## 🎬 Demo Content

### 1. PayMe India Programs (4 programs)
- **NBFC Compliance Program** - RBI Scale-Based Regulation
- **Digital Lending Guidelines** - RBI Digital Lending compliance
- **Customer Data Protection** - DPDP Act 2023
- **ISO 27001:2022 ISMS** - Information Security

### 2. Demo Obligations (8 obligations)
- Q3 FY25 NBS Returns (Due: Jan 31, 2025)
- Annual IT Audit Report (Due: Apr 30, 2025)
- Data Breach Notification (Event-driven)
- Cyber Security Incident Reporting (Event-driven)
- Annual ISMS Review (Due: Feb 28, 2025)
- Quarterly LSP Review (Due: Feb 15, 2025)
- Semi-Annual Consent Audit (Due: Mar 31, 2025)
- Quarterly Board Meeting (Due: Apr 15, 2025)

### 3. Requirements (13 requirements)
- **NBFC Requirements (3)** - NBS Returns, IT Audit, Board Oversight
- **Digital Lending Requirements (3)** - LSP Oversight, KFS, Grievance Redressal
- **DPDP Requirements (3)** - Consent, Data Breach, Data Rights
- **ISO 27001 Requirements (4)** - ISMS Scope, Risk Assessment, Management Review

### 4. Controls (18 controls)
- **NBFC Controls (5)** - Automated reporting, audit tracking, board reviews
- **Digital Lending Controls (4)** - LSP management, KFS automation, grievance tracking
- **DPDP Controls (4)** - Consent platform, breach detection, rights portal
- **ISO 27001 Controls (3)** - ISMS documentation, risk assessment, management review

### 5. Compliance Playbooks (4 playbooks)
- **RBI NBFC Annual Compliance Calendar** - 22 steps, 68% complete
- **ISO 27001 Implementation Roadmap** - 12 steps, 75% complete
- **Digital Lending Fair Practices** - 10 steps, 85% complete
- **DPDP Customer Consent Management** - 14 steps, 70% complete

## 🔧 Configuration

### Enable/Disable Demo Mode

Edit `src/lib/demo/config.ts`:

```typescript
export const DEMO_MODE = {
  enabled: true,  // Set to false to disable all demo features
  
  features: {
    demoProgram: true,      // Show PayMe programs
    demoPlaybooks: true,    // Show playbooks
    demoDashboard: true,    // Show demo widgets
    demoData: true,         // Include demo obligations
    demoScenarios: true,    // Enable scenarios
  }
};
```

### Feature Flags

- `demoProgram` - Shows 4 PayMe India programs in "My Programs"
- `demoPlaybooks` - Shows 4 compliance playbooks in "/playbooks"
- `demoData` - Includes 8 demo obligations in obligations list
- `demoDashboard` - Shows demo-specific dashboard widgets
- `demoScenarios` - Enables demo scenarios (future)

## 🚀 Usage

### In Code

```typescript
import { isDemoEnabled, isDemoFeatureEnabled } from '@/lib/demo';

// Check if demo mode is enabled
if (isDemoEnabled()) {
  // Show demo features
}

// Check specific feature
if (isDemoFeatureEnabled('demoPlaybooks')) {
  // Show playbooks
}
```

### Demo Data

```typescript
import {
  paymePrograms,
  paymeObligations,
  paymeRequirements,
  paymeControls,
  demoPlaybooks
} from '@/lib/demo';

// Use in your components
const programs = isDemoFeatureEnabled('demoProgram')
  ? [...basePrograms, ...paymePrograms]
  : basePrograms;

const requirements = isDemoFeatureEnabled('demoData')
  ? [...baseRequirements, ...paymeRequirements]
  : baseRequirements;

const controls = isDemoFeatureEnabled('demoData')
  ? [...baseControls, ...paymeControls]
  : baseControls;
```

## 📊 Integration Points

Demo data is integrated into:

1. **src/lib/data/mock-data.ts**
   - Adds PayMe programs to "My Programs"
   - Conditional based on `isDemoFeatureEnabled('demoProgram')`

2. **src/lib/data/requirements-obligations.ts**
   - Adds PayMe obligations to obligations list
   - Adds PayMe requirements to requirements list
   - Conditional based on `isDemoFeatureEnabled('demoData')`

3. **src/lib/data/controls.ts**
   - Adds PayMe controls to controls library
   - Conditional based on `isDemoFeatureEnabled('demoData')`

4. **src/app/playbooks/page.tsx**
   - Shows compliance playbooks
   - Conditional based on `isDemoFeatureEnabled('demoPlaybooks')`

5. **src/components/Sidebar.tsx**
   - Adds "Playbooks" navigation link

## 🗑️ Removing Demo Features

### Option 1: Disable Demo Mode (Recommended)

Set `DEMO_MODE.enabled = false` in `src/lib/demo/config.ts`

This will:
- ✅ Hide all demo programs
- ✅ Hide all demo obligations
- ✅ Hide all playbooks
- ✅ Keep code intact for future use

### Option 2: Complete Removal

1. **Delete demo folder:**
   ```bash
   rm -rf src/lib/demo
   ```

2. **Remove demo imports from data files:**
   
   In `src/lib/data/mock-data.ts`:
   ```typescript
   // Remove this line:
   import { paymePrograms, isDemoFeatureEnabled } from '../demo';
   
   // Change this:
   export const programs: ComplianceProgram[] = isDemoFeatureEnabled('demoProgram') 
     ? [...basePrograms, ...paymePrograms]
     : basePrograms;
   
   // To this:
   export const programs: ComplianceProgram[] = basePrograms;
   ```
   
   In `src/lib/data/requirements-obligations.ts`:
   ```typescript
   // Remove this line:
   import { paymeObligations, isDemoFeatureEnabled } from '../demo';
   
   // Change obligations export similarly
   ```

3. **Remove playbooks pages:**
   ```bash
   rm -rf src/app/playbooks
   ```

4. **Remove playbooks link from sidebar:**
   
   In `src/components/Sidebar.tsx`, remove the playbooks NavItem

## 🎭 Demo Personas

- **Rajesh Kumar** - Head of Compliance
- **Priya Sharma** - Chief Information Security Officer
- **Anjali Verma** - Data Protection Officer
- **Vikram Malhotra** - Chief Financial Officer

## 📝 Demo Tags

All demo data is tagged with:
- `isDemo: true` property
- `demoClient: 'payme-india'` property
- `[DEMO]` prefix in comments
- `payme-india` tag in tags array

## 🔍 Finding Demo Code

Search for these markers:
- `[DEMO]` - Comments marking demo code
- `isDemo` - Demo data property
- `isDemoEnabled` - Demo feature checks
- `payme-india` - Client identifier

## ⚠️ Important Notes

1. **Demo data is isolated** - Won't affect production data
2. **Feature flags** - Easy to toggle on/off
3. **Tagged clearly** - Easy to identify and remove
4. **No database changes** - All in-memory data
5. **Client-specific** - Tailored for PayMe India

## 📞 Support

For questions about demo features, contact the development team.

---

**Created:** January 2025  
**Client:** PayMe India  
**Purpose:** Compliance Demo  
**Status:** Active

