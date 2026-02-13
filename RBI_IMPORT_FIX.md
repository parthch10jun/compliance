# RBI IT Governance Import Fix - Complete ✅

## Problem Identified
When importing the RBI IT Governance template from the Program Library to "My Programs", the requirement counts and data were mismatched because:

1. **Template ID Mismatch**: Old program referenced `tpl-rbi-itgov` but new template is `tpl-rbi-itgov-2023`
2. **Requirement Counts Wrong**: Old program showed 45 requirements, but new framework has 66 requirements
3. **Requirements Not Linked**: Requirements were only linked to template ID, not to the imported program ID (`pgm-001`)

## Solution Implemented

### 1. Updated Program in My Programs (`mock-data.ts`)

**Before:**
```typescript
{
  id: 'pgm-001',
  name: 'RBI IT Governance',
  sourceTemplateId: 'tpl-rbi-itgov',  // ❌ Old template ID
  requirementCount: 45,                // ❌ Wrong count
  obligationCount: 8,                  // ❌ Wrong count
  controls: 38,                        // ❌ Wrong count
}
```

**After:**
```typescript
{
  id: 'pgm-001',
  name: 'RBI IT Governance, Risk, Controls & Assurance Practices',
  sourceTemplateId: 'tpl-rbi-itgov-2023',  // ✅ Correct template ID
  requirementCount: 66,                     // ✅ Correct count
  obligationCount: 24,                      // ✅ Correct count
  controls: 123,                            // ✅ Correct count
}
```

### 2. Created Imported Requirements (`requirements-obligations.ts`)

Added a mapping that creates duplicate requirements linked to the imported program:

```typescript
// Template requirements (for library view)
...rbiITGovernance.requirements  // programId: 'tpl-rbi-itgov-2023'

// Imported program requirements (for My Programs view)
const importedRBIRequirements = rbiITGovernance.requirements.map(req => ({
  ...req,
  programId: 'pgm-001',  // ✅ Link to imported program
  programName: 'RBI IT Governance, Risk, Controls & Assurance Practices'
}));
```

### 3. Updated Compliance Areas Display (`programs/[id]/page.tsx`)

Made compliance areas visible for both template and imported program:

```typescript
// Show compliance areas for both template and imported programs
{(program.id === 'tpl-rbi-itgov-2023' || 
  program.sourceTemplateId === 'tpl-rbi-itgov-2023') && 
  rbiITGovernance.complianceAreas && (
  // ... compliance areas grid
)}
```

## Result

### In Program Library (`/library/programs`)
- **Template**: RBI IT Governance, Risk, Controls & Assurance Practices
- **ID**: `tpl-rbi-itgov-2023`
- **Requirements**: 66 (linked to template ID)
- **Obligations**: 24
- **Controls**: 123

### In My Programs (`/programs`)
- **Program**: RBI IT Governance, Risk, Controls & Assurance Practices
- **ID**: `pgm-001`
- **Source Template**: `tpl-rbi-itgov-2023`
- **Requirements**: 66 (linked to program ID `pgm-001`)
- **Obligations**: 24
- **Controls**: 123
- **Compliance Areas**: ✅ Visible (6 areas)

## Testing

1. ✅ Navigate to `/library/programs` → Click RBI IT Governance → See 66 requirements
2. ✅ Navigate to `/programs` → Click RBI IT Governance → See 66 requirements
3. ✅ Both views show compliance areas section
4. ✅ Requirement counts match in both views
5. ✅ All 66 requirements are properly tagged with compliance areas

## Data Flow

```
Program Library Template (tpl-rbi-itgov-2023)
    ↓
[Import Action]
    ↓
My Programs (pgm-001)
    ↓
Requirements Duplicated with New Program ID
    ↓
Both Template and Program Show Same Data
```

## Files Modified

1. **src/lib/data/mock-data.ts** - Updated pgm-001 program details
2. **src/lib/data/requirements-obligations.ts** - Added imported requirements mapping
3. **src/app/programs/[id]/page.tsx** - Updated compliance areas condition

## Status
✅ **FIXED AND TESTED**

The RBI IT Governance framework now works correctly in both:
- Program Library (template view)
- My Programs (imported program view)

All 66 requirements, 24 obligations, and 123 controls are properly linked and displayed!

