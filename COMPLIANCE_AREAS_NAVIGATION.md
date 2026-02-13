# RBI IT Governance - Compliance Areas Navigation

## Navigation Flow

```
Authorities Page
    ↓
Reserve Bank of India (RBI)
    ↓
Programs
    ↓
RBI IT Governance, Risk, Controls & Assurance Practices
    ↓
COMPLIANCE AREAS (NEW SECTION!)
```

## What You'll See

### Compliance Areas Section (Grid View)

The program detail page now displays **6 Compliance Areas** in a 2-column grid:

#### 1. IT Governance (Chapter 2)
- **Priority**: Critical
- **Requirements**: 15
- **Controls**: 28
- **Avg Score**: ~90%
- **Description**: Establishment of IT governance framework, committees, policies, and oversight mechanisms

#### 2. IT Risk Management (Chapter 3)
- **Priority**: Critical
- **Requirements**: 12
- **Controls**: 22
- **Avg Score**: ~87%
- **Description**: Comprehensive IT risk identification, assessment, mitigation, and monitoring

#### 3. Cybersecurity (Chapter 4)
- **Priority**: Critical
- **Requirements**: 18
- **Controls**: 38
- **Avg Score**: ~91%
- **Description**: Cybersecurity framework, CISO, SOC, access controls, and incident response

#### 4. IT Operations and Resilience (Chapter 5)
- **Priority**: Critical
- **Requirements**: 10
- **Controls**: 20
- **Avg Score**: ~91%
- **Description**: Business continuity, disaster recovery, backup, and resilience management

#### 5. IT Audit and Assurance (Chapter 6)
- **Priority**: High
- **Requirements**: 8
- **Controls**: 13
- **Avg Score**: ~93%
- **Description**: IT audit framework, internal/external audits, and compliance monitoring

#### 6. Preliminary (Chapter 1)
- **Priority**: Medium
- **Requirements**: 3
- **Controls**: 2
- **Avg Score**: ~95%
- **Description**: Applicability, definitions, and scope of the framework

---

## How Requirements Are Tagged

Each of the 66 requirements is tagged with:

1. **Category** - Maps to compliance area name (e.g., "IT Governance", "Cybersecurity")
2. **Section** - Chapter reference (e.g., "Chapter 2 - IT Governance")
3. **Tags** - Includes RBI, Regulator, India, and specific topic tags

### Example Requirement Tagging:

```typescript
{
  id: 'rbi-itgov-req-032',
  code: 'RBI-IT-032',
  title: 'Chief Information Security Officer (CISO) Appointment',
  category: 'Cybersecurity',  // ← Maps to Compliance Area
  section: 'Chapter 4 - Cybersecurity',  // ← Chapter reference
  tags: ['RBI', 'Regulator', 'India', 'Cybersecurity', 'CISO', 'Governance'],
  riskRating: 'Critical',
  status: 'Compliant',
  complianceScore: 100,
  controlCount: 3,
}
```

---

## Filtering and Grouping

### In the Program Detail View:
- **Compliance Areas** are displayed as cards showing aggregate metrics
- Click on any area to see its requirements (future enhancement)
- Each area shows its average compliance score

### In the Requirements List:
- Filter by **Category** to see requirements for a specific compliance area
- Filter by **Section** to see requirements from a specific chapter
- Filter by **Tags** to narrow down by topic (CISO, SOC, BCP, etc.)

---

## Data Structure

### Compliance Areas Array:
```typescript
export const rbiComplianceAreas = [
  {
    id: 'CA-001',
    name: 'IT Governance',
    description: '...',
    chapter: 'Chapter 2',
    priority: 'Critical',
    requirementsCount: 15,
    controlsCount: 28
  },
  // ... 5 more areas
];
```

### Requirements Mapping:
- Each requirement has `category: 'IT Governance'` matching the compliance area name
- Each requirement has `section: 'Chapter 2 - IT Governance'` for chapter reference
- Requirements are automatically grouped by their category field

---

## Benefits

✅ **Clear Structure** - See the 6 major compliance areas at a glance
✅ **Progress Tracking** - Monitor compliance score per area
✅ **Risk Prioritization** - Identify critical vs. high vs. medium priority areas
✅ **Scope Understanding** - Know how many requirements and controls per area
✅ **Chapter Mapping** - Direct reference to RBI Master Direction chapters

---

## Next Steps

1. **Navigate to**: http://localhost:3004/library/programs
2. **Click on**: "RBI IT Governance, Risk, Controls & Assurance Practices"
3. **Scroll down** to see the new "Compliance Areas" section
4. **View** the 6 compliance areas with their metrics
5. **Scroll further** to see individual requirements

The compliance areas provide a high-level overview before diving into the detailed requirements!

