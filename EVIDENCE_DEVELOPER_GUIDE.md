# Evidence Management - Developer Guide

## 📁 File Structure

```
src/
├── components/
│   ├── EditEvidenceModal.tsx          # Edit evidence metadata
│   ├── ReviewEvidenceModal.tsx        # Review and approve/reject evidence
│   ├── UploadEvidenceModal.tsx        # Upload new evidence (existing)
│   └── index.ts                       # Component exports
├── app/
│   └── evidence/
│       ├── page.tsx                   # Evidence library (grid/list view)
│       └── [id]/
│           └── page.tsx               # Evidence detail page
└── lib/
    └── data/
        └── evidence.ts                # Evidence data structure
```

---

## 🧩 Component API Reference

### 1. EditEvidenceModal

**Purpose**: Edit evidence metadata and properties

**Props**:
```typescript
interface EditEvidenceModalProps {
  isOpen: boolean;                     // Modal visibility
  onClose: () => void;                 // Close handler
  evidence?: {                         // Evidence to edit
    id: string;
    code: string;
    name: string;
    description: string;
    type: string;
    status: string;
    validationStatus: string;
    expiresAt?: string;
    reminderDays: number;
    tags: string[];
    notes: string;
  };
  onSave?: (evidence: EvidenceFormData) => void;  // Save handler
}
```

**Usage**:
```tsx
import { EditEvidenceModal } from '@/components';

const [showEditModal, setShowEditModal] = useState(false);
const [selectedEvidence, setSelectedEvidence] = useState(null);

<EditEvidenceModal
  isOpen={showEditModal}
  onClose={() => setShowEditModal(false)}
  evidence={selectedEvidence}
  onSave={(updatedEvidence) => {
    console.log('Updated:', updatedEvidence);
    // Update evidence in database
    setShowEditModal(false);
  }}
/>
```

**Features**:
- Pre-populated form with existing data
- Form validation (code, name, description required)
- Evidence type selection (8 types)
- Status selection (5 statuses)
- Validation status selection (4 statuses)
- Expiry date picker
- Reminder days configuration
- Tags management (add/remove)
- Notes field

**Evidence Types**:
- Document, Screenshot, Report, Log, Certificate, Policy, Procedure, Other

**Statuses**:
- Draft, Pending Review, Approved, Rejected, Expired

**Validation Statuses**:
- Not Reviewed, Sufficient, Insufficient, Needs Update

---

### 2. ReviewEvidenceModal

**Purpose**: Review and approve/reject evidence

**Props**:
```typescript
interface ReviewEvidenceModalProps {
  isOpen: boolean;                     // Modal visibility
  onClose: () => void;                 // Close handler
  evidence?: {                         // Evidence to review
    id: string;
    code: string;
    name: string;
    description: string;
    fileName: string;
    uploadedBy: string;
    uploadedAt: string;
  };
  onReview?: (review: {                // Review handler
    evidenceId: string;
    decision: 'Approve' | 'Reject';
    validationStatus: string;
    comments: string;
  }) => void;
}
```

**Usage**:
```tsx
import { ReviewEvidenceModal } from '@/components';

const [showReviewModal, setShowReviewModal] = useState(false);

<ReviewEvidenceModal
  isOpen={showReviewModal}
  onClose={() => setShowReviewModal(false)}
  evidence={evidenceItem}
  onReview={(review) => {
    console.log('Review:', review);
    // Update evidence status in database
    setShowReviewModal(false);
  }}
/>
```

**Features**:
- Evidence summary display
- Approve/Reject decision buttons
- Validation status selection (for approved evidence)
- Required review comments
- Form validation
- Dynamic button styling based on decision

**Validation Statuses** (for approved evidence):
- Sufficient, Insufficient, Needs Update

---

## 🔄 Integration Examples

### Example 1: Evidence Library with Edit

```tsx
// src/app/evidence/page.tsx
'use client';

import { useState } from 'react';
import { EditEvidenceModal } from '@/components';

export default function EvidencePage() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  return (
    <div>
      {/* Evidence Grid */}
      <div className="grid grid-cols-4 gap-4">
        {evidence.map(ev => (
          <div key={ev.id} className="relative group">
            <Link href={`/evidence/${ev.id}`}>
              {/* Evidence Card Content */}
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                setSelectedEvidence(ev);
                setShowEditModal(true);
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
            >
              <Edit size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <EditEvidenceModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEvidence(null);
        }}
        evidence={selectedEvidence}
        onSave={(updated) => {
          // Update evidence
          setShowEditModal(false);
        }}
      />
    </div>
  );
}
```

### Example 2: Evidence Detail with Review

```tsx
// src/app/evidence/[id]/page.tsx
'use client';

import { useState } from 'react';
import { ReviewEvidenceModal } from '@/components';

export default function EvidenceDetailPage({ params }) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const evidenceItem = evidence.find(e => e.id === params.id);

  return (
    <div>
      {/* Evidence Details */}
      <div className="p-6">
        <h1>{evidenceItem.name}</h1>
        
        {/* Review Button (for pending evidence) */}
        {evidenceItem.status === 'Pending Review' && (
          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
          >
            Review Evidence
          </button>
        )}
      </div>

      {/* Review Modal */}
      <ReviewEvidenceModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        evidence={evidenceItem}
        onReview={(review) => {
          console.log('Review:', review);
          // Update evidence status
          setShowReviewModal(false);
        }}
      />
    </div>
  );
}
```

---

## 🎨 Styling Guidelines

### Color Scheme
- **Edit Modal**: Rose/Pink (#E11D48)
- **Review Modal**: Emerald/Green (#10B981)
- **Upload Modal**: Rose/Pink (#E11D48)

### Status Colors
```css
Approved:       #10B981 (Emerald)
Pending Review: #F59E0B (Amber)
Rejected:       #EF4444 (Red)
Expired:        #6B7280 (Gray)
Draft:          #3B82F6 (Blue)
```

### Validation Status Colors
```css
Sufficient:     #10B981 (Emerald)
Insufficient:   #EF4444 (Red)
Needs Update:   #F59E0B (Amber)
Not Reviewed:   #6B7280 (Gray)
```

---

## 🔧 Backend Integration Points

### 1. Update Evidence Metadata
```typescript
// API endpoint: PUT /api/evidence/:id
async function updateEvidence(evidenceId: string, data: EvidenceFormData) {
  const response = await fetch(`/api/evidence/${evidenceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

### 2. Review Evidence
```typescript
// API endpoint: POST /api/evidence/:id/review
async function reviewEvidence(evidenceId: string, review: ReviewData) {
  const response = await fetch(`/api/evidence/${evidenceId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  return response.json();
}
```

---

## ✅ Testing Checklist

### EditEvidenceModal
- [ ] Modal opens with pre-populated data
- [ ] Form validation works (required fields)
- [ ] Evidence type selection works
- [ ] Status selection works
- [ ] Validation status selection works
- [ ] Expiry date picker works
- [ ] Reminder days input works
- [ ] Tags can be added
- [ ] Tags can be removed
- [ ] Notes field works
- [ ] Save button triggers onSave callback
- [ ] Cancel button closes modal
- [ ] Modal closes after save

### ReviewEvidenceModal
- [ ] Modal opens with evidence summary
- [ ] Approve button selects approve decision
- [ ] Reject button selects reject decision
- [ ] Validation status shown only for approve
- [ ] Comments field is required
- [ ] Form validation works
- [ ] Submit button disabled without decision
- [ ] Submit button triggers onReview callback
- [ ] Cancel button closes modal
- [ ] Modal closes after review

### Evidence Library
- [ ] Edit icon appears on hover (grid view)
- [ ] Edit icon appears on hover (list view)
- [ ] Edit icon opens EditEvidenceModal
- [ ] Evidence card click navigates to detail page
- [ ] Evidence row click navigates to detail page
- [ ] View icon navigates to detail page (list view)

### Evidence Detail Page
- [ ] Edit button opens EditEvidenceModal
- [ ] Review button opens ReviewEvidenceModal (pending only)
- [ ] Review button hidden for non-pending evidence
- [ ] All evidence details displayed correctly
- [ ] Version history displayed
- [ ] Linked items displayed

---

## 🚀 Future Enhancements

1. **Bulk Operations**: Edit/review multiple evidence items
2. **Advanced Filters**: Filter by type, status, validation status
3. **Evidence Templates**: Pre-configured evidence types
4. **Automated Reminders**: Email notifications for expiring evidence
5. **Evidence Comparison**: Compare versions side-by-side
6. **Evidence Analytics**: Usage statistics and trends
7. **Evidence Workflow**: Custom approval workflows
8. **Evidence Archival**: Archive old evidence versions

---

**Developer Guide Complete! 🎉**

For questions or issues, refer to the main documentation: `EVIDENCE_MANAGEMENT_WORKFLOW.md`

