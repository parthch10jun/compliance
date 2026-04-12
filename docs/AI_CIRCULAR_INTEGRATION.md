# 🤖 AI Circular Intelligence Integration

> **Integration of Ascent AI Service for Regulatory Circular Breakdown**

---

## 📋 **Overview**

This integration connects your Regulatory Intelligence page to the Ascent AI Service, enabling automated extraction of compliance action items from regulatory circular PDFs.

### **What It Does:**
1. ✅ Upload regulatory circular PDFs (RBI, SEBI, MCA, etc.)
2. ✅ AI extracts action items with:
   - Title & Description
   - Deadline dates
   - Reference sections
   - Criticality level (Critical/High/Medium/Low)
   - Confidence scores
3. ✅ Displays extracted items in an elegant, organized view
4. ✅ Provides summary statistics by criticality

---

## 🎯 **API Details**

### **Endpoint:**
```
POST https://ai-service.ascentbusiness.com/grc/api/v1/regulatory-intelligence/circular-extractor/extract
```

### **Request:**
```bash
curl --location 'https://ai-service.ascentbusiness.com/grc/api/v1/regulatory-intelligence/circular-extractor/extract' \
--header 'Accept: application/json' \
--form 'file=@"/path/to/regulatory_circular.pdf";type=application/pdf'
```

### **Response Structure:**
```typescript
{
  success: boolean;
  circularTitle?: string;
  publishDate?: string;
  source?: string;
  actionItems: [
    {
      title: string;
      description: string;
      deadline: string;
      referenceSection: string;
      criticality: 'Critical' | 'High' | 'Medium' | 'Low';
      confidenceScore: number; // 0-100
    }
  ];
  metadata?: {
    totalPages?: number;
    processingTime?: number;
  };
}
```

---

## 📁 **Files Created**

### **1. API Service** (`src/lib/services/regulatory-ai.ts`)
**Purpose:** Handles API communication with AI service

**Key Functions:**
- `extractCircularActionItems(file: File)` - Uploads PDF and gets AI analysis
- `validateCircularPDF(file: File)` - Validates file before upload
  - Checks file type (PDF only)
  - Validates size (max 10MB)
  - Ensures file has content

**Usage:**
```typescript
import { extractCircularActionItems } from '@/lib/services/regulatory-ai';

const result = await extractCircularActionItems(pdfFile);
if (result.success) {
  console.log('Extracted', result.actionItems.length, 'action items');
}
```

---

### **2. Upload Component** (`src/components/CircularUpload.tsx`)
**Purpose:** Elegant drag-and-drop PDF upload interface

**Features:**
- ✨ Drag & drop or click to upload
- ✨ File validation with user-friendly error messages
- ✨ Loading state with AI animation
- ✨ Success/error feedback
- ✨ Beautiful gradient styling

**Props:**
```typescript
interface CircularUploadProps {
  onExtractComplete: (actionItems: ActionItem[], metadata?: any) => void;
}
```

**Visual States:**
1. **Empty** - Drag & drop area with upload icon
2. **File Selected** - Shows file name, size, extract button
3. **Extracting** - Loading spinner with "Analyzing with AI..." message
4. **Success** - Green success message, option to upload another
5. **Error** - Red error message with details

---

### **3. Display Component** (`src/components/ExtractedActionItems.tsx`)
**Purpose:** Beautiful display of extracted action items

**Features:**
- ✨ Gradient header with total count
- ✨ Color-coded criticality badges
- ✨ Confidence score with progress bar
- ✨ Deadline and reference section display
- ✨ Summary statistics by criticality level

**Props:**
```typescript
interface ExtractedActionItemsProps {
  actionItems: ActionItem[];
  metadata?: {
    totalPages?: number;
    processingTime?: number;
  };
}
```

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Gradient Header                             │
│ "Extracted Action Items - 5 identified"     │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ [CRITICAL] Action Item #1        95%        │
│ ───────────────────────────────────────────│
│ Description text here...                    │
│ 📅 Deadline: Dec 31, 2024  #Section 4.2    │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ Summary Stats:                              │
│ Critical: 2  High: 1  Medium: 1  Low: 1    │
└─────────────────────────────────────────────┘
```

---

### **4. Page Integration** (`src/app/regulatory-intelligence/page.tsx`)
**Purpose:** Integrates AI extraction into Regulatory Intelligence page

**Changes Made:**
1. Added imports for new components
2. Added state for extracted actions
3. Added `CircularUpload` component at top of page
4. Conditionally displays `ExtractedActionItems` when available

**Flow:**
```
User uploads PDF
     ↓
CircularUpload validates & uploads
     ↓
AI Service processes
     ↓
ExtractedActionItems displays results
     ↓
User can upload another circular
```

---

## 🎨 **Visual Design**

### **Color Coding by Criticality:**

| Criticality | Background | Text | Border |
|------------|------------|------|--------|
| **Critical** | `bg-red-100` | `text-red-800` | `border-red-300` |
| **High** | `bg-orange-100` | `text-orange-800` | `border-orange-300` |
| **Medium** | `bg-yellow-100` | `text-yellow-800` | `border-yellow-300` |
| **Low** | `bg-blue-100` | `text-blue-800` | `border-blue-300` |

### **Confidence Score Colors:**

| Range | Color | Meaning |
|-------|-------|---------|
| 90-100% | Green | High confidence |
| 70-89% | Yellow | Moderate confidence |
| <70% | Orange | Low confidence - review needed |

---

## 🚀 **Testing the Integration**

### **Step 1: Start Development Server**
```bash
npm run dev
# or
yarn dev
```

### **Step 2: Navigate to Regulatory Intelligence**
```
http://localhost:3000/regulatory-intelligence
```

### **Step 3: Upload a Test PDF**
1. Look for "AI Circular Analyzer" card at top
2. Drag & drop a regulatory circular PDF
3. Click "Extract Action Items"
4. Wait for AI processing (few seconds)
5. See extracted items displayed below

### **Step 4: Verify Results**
- ✅ Action items displayed with correct criticality
- ✅ Deadlines formatted properly
- ✅ Confidence scores shown
- ✅ Summary stats accurate
- ✅ Can upload another circular

---

## 🐛 **Error Handling**

### **File Validation Errors:**
```
❌ Only PDF files are supported
❌ File size must be less than 10MB
❌ File is empty
```

### **API Errors:**
```
❌ AI Service error: [HTTP status]
❌ Failed to process circular. Please try again.
❌ No action items found in the circular
```

### **Network Errors:**
```
❌ Failed to connect to AI service
❌ Request timeout
```

**All errors display in a red error box with icon and message.**

---

## 📊 **Example Workflow**

### **User Story:**
> "As a compliance officer, I receive an RBI circular PDF via email. I want to quickly understand what actions I need to take and by when."

### **Solution:**
1. Open Regulatory Intelligence page
2. Upload the RBI circular PDF
3. AI extracts:
   - "Update fraud reporting process" - Critical, Deadline: Jan 15
   - "Revise board meeting frequency" - Medium, Deadline: Mar 1
   - "File annual compliance report" - High, Deadline: Dec 31
4. Review action items sorted by criticality
5. Create tasks in compliance system
6. Track deadlines

---

## 🔧 **Customization Options**

### **Change API Endpoint:**
```typescript
// src/lib/services/regulatory-ai.ts
const AI_SERVICE_BASE_URL = 'https://your-custom-domain.com';
```

### **Add Authentication:**
```typescript
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${YOUR_API_KEY}`,
  },
  body: formData,
});
```

### **Change File Size Limit:**
```typescript
// src/lib/services/regulatory-ai.ts
const maxSize = 20 * 1024 * 1024; // 20MB instead of 10MB
```

---

## 🎯 **Future Enhancements**

### **Planned:**
- [ ] Save extracted action items to database
- [ ] Auto-create tasks from action items
- [ ] Link action items to affected controls
- [ ] Track implementation status
- [ ] Email notifications for deadlines
- [ ] Batch upload multiple circulars

### **Possible:**
- [ ] Support for other file types (Word, HTML)
- [ ] Manual editing of extracted items
- [ ] Export to CSV/Excel
- [ ] Integration with calendar
- [ ] Compliance dashboard widget

---

## 📞 **Support**

**AI Service Contact:** Nitiraj Singh  
**API Documentation:** [Contact AI team for detailed docs]  
**Integration Issues:** Check browser console for detailed errors

---

**Last Updated:** 2026-04-09  
**Integration Version:** 1.0  
**Status:** ✅ Production Ready
