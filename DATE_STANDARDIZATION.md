# Date Format Standardization

## Overview
All dates throughout the application now use standardized formatting utilities to ensure consistency.

## Standard Date Formats

### 1. **Standard Format** (Default)
- **Format**: `MMM DD, YYYY`
- **Example**: `Dec 23, 2024`
- **Usage**: Default format for most date displays
- **Function**: `formatDate(dateString)`

### 2. **Short Format**
- **Format**: `MMM DD`
- **Example**: `Dec 23`
- **Usage**: When year is implied or space is limited (tables, cards)
- **Function**: `formatDateShort(dateString)`

### 3. **Long Format**
- **Format**: `MMMM DD, YYYY`
- **Example**: `December 23, 2024`
- **Usage**: Formal contexts, headers, important dates
- **Function**: `formatDateLong(dateString)`

### 4. **Date Range Format**
- **Format**: Smart formatting based on dates
  - Same month: `Dec 23 - 31, 2024`
  - Same year: `Dec 23 - Jan 15, 2024`
  - Different years: `Dec 23, 2024 - Jan 15, 2025`
- **Function**: `formatDateRange(startDate, endDate)`

### 5. **ISO Format** (Data Storage)
- **Format**: `YYYY-MM-DD`
- **Example**: `2024-12-23`
- **Usage**: Internal data storage, API calls, database
- **Function**: `getCurrentDateISO()`

## Utility Functions

All date utilities are located in `src/lib/utils/date-formatter.ts`

### Formatting Functions

```typescript
import { formatDate, formatDateShort, formatDateLong, formatDateRange } from '@/lib/utils';

// Standard format
formatDate('2024-12-23') // "Dec 23, 2024"

// Short format
formatDateShort('2024-12-23') // "Dec 23"

// Long format
formatDateLong('2024-12-23') // "December 23, 2024"

// Date range
formatDateRange('2024-12-23', '2024-12-31') // "Dec 23 - 31, 2024"
```

### Helper Functions

```typescript
import { getDaysBetween, isOverdue, formatRelativeTime } from '@/lib/utils';

// Calculate days between dates
getDaysBetween('2024-12-01', '2024-12-23') // 22

// Check if date is overdue
isOverdue('2024-12-20') // true (if today is after Dec 20)

// Relative time
formatRelativeTime('2024-12-25') // "in 2 days" or "2 days ago"
```

## Updated Pages

### ✅ Fully Updated
1. **Controls** (`src/app/controls/page.tsx`)
   - Next test dates: `formatDateShort()`
   
2. **Tasks** (`src/app/tasks/page.tsx`)
   - Due dates: `formatDateShort()`
   
3. **Issues** (`src/app/issues/page.tsx`)
   - Due dates: `formatDateShort()`
   - Age calculation: `getDaysBetween()`
   - Overdue check: `isOverdue()`
   
4. **Assessments** (`src/app/assessments/page.tsx`)
   - Scheduled dates: `formatDate()`
   - Due dates: `formatDate()`
   - Completed dates: `formatDate()`
   - Overdue check: `isOverdue()`
   
5. **Library - Audits** (`src/app/library/audits/page.tsx`)
   - Date ranges: `formatDateRange()`
   
6. **Executive Dashboard** (`src/app/dashboard/executive/page.tsx`)
   - Assessment dates: `formatDate()`

### ⚠️ Needs Update
The following pages still have hardcoded date formatting and should be updated:

1. **Main Dashboard** (`src/app/page.tsx`)
   - Upcoming tests section (lines ~477-481)
   
2. **Programs** (`src/app/programs/page.tsx`)
   - Review dates in cards/tables
   
3. **Authorities** (`src/app/authorities/page.tsx`)
   - Created/updated dates
   
4. **Citations** (`src/app/citations/page.tsx`)
   - Review dates, obligation due dates
   
5. **Evidence** (`src/app/evidence/page.tsx`)
   - Upload dates, collection dates
   
6. **Tests** (`src/app/tests/page.tsx`)
   - Scheduled dates

## Migration Guide

### Before (Old Way)
```typescript
// ❌ Don't do this
{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
```

### After (New Way)
```typescript
// ✅ Do this instead
import { formatDateShort, formatDate } from '@/lib/utils';

{formatDateShort(date)}
{formatDate(date)}
```

### Benefits
1. **Consistency**: All dates look the same across the app
2. **Maintainability**: Change format in one place
3. **Type Safety**: TypeScript support
4. **Readability**: Clear function names
5. **Flexibility**: Easy to add new formats

## Data Storage Format

All dates in mock data and database should use **ISO format** (`YYYY-MM-DD`):

```typescript
// ✅ Correct
{
  scheduledDate: '2024-12-23',
  dueDate: '2025-01-15',
  createdAt: '2024-11-01'
}

// ❌ Incorrect
{
  scheduledDate: 'Dec 23, 2024',
  dueDate: '12/23/2024',
  createdAt: 'December 1, 2024'
}
```

## Testing

All date utilities include proper handling for:
- ISO date strings (`'2024-12-23'`)
- Date objects (`new Date()`)
- Edge cases (same month, same year, different years)
- Timezone considerations

## Next Steps

1. Update remaining pages to use date utilities
2. Update mock data to ensure all dates are in ISO format
3. Add date validation utilities if needed
4. Consider adding date picker components with standardized output

