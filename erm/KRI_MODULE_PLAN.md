# 📊 KRI (Key Risk Indicators) Module Plan

## 🎯 **Objective**

Build a comprehensive KRI monitoring and tracking system that provides:
- Real-time risk indicator tracking
- Threshold alerts and breach detection
- Trend analysis and visualization
- Executive dashboard for risk oversight
- Integration with risk register

---

## 📋 **Key Features**

### **1. KRI Dashboard** (`/erm/kris`)

**Purpose:** Central hub for monitoring all key risk indicators

**Components:**

#### **A. Summary Cards:**
```
┌──────────────────────────────────────────────────────┐
│ Total KRIs: 24      Active: 20      Breached: 4     │
│ On Track: 16        Warning: 0       Critical: 4    │
└──────────────────────────────────────────────────────┘
```

#### **B. KRI Table:**
| KRI ID | Name | Category | Current Value | Threshold | Status | Trend | Owner |
|--------|------|----------|---------------|-----------|--------|-------|-------|
| KRI-001 | Incident Rate | Cyber | 12 | ≤10 | 🔴 Breach | ↑ | CISO |
| KRI-002 | System Uptime | Ops | 99.5% | ≥99% | 🟢 OK | → | CTO |

**Status Colors:**
- 🟢 Green: Within threshold
- 🟡 Yellow: Approaching threshold (80-100%)
- 🔴 Red: Breached threshold

**Trend Indicators:**
- ↑ Increasing (getting worse)
- ↓ Decreasing (getting better)
- → Stable

#### **C. Filters:**
- By Category (Cybersecurity, Operational, Financial, etc.)
- By Status (All, Breached, Warning, OK)
- By Owner
- By Risk (linked risks)

---

### **2. KRI Detail View** (`/erm/kris/[id]`)

**Components:**

#### **A. KRI Information:**
- Name and description
- Category and subcategory
- Linked risks
- Owner and responsible party
- Measurement frequency
- Data source

#### **B. Threshold Configuration:**
- Green zone (acceptable)
- Yellow zone (warning)
- Red zone (breach)
- Visual threshold bars

#### **C. Historical Trend Chart:**
```
KRI Trend (Last 12 Months)
     Breach →  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Warning → ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Safe →    ●━━━━━━━━━━━━━━●━━━━●━━━━●━━━━━━
               Jan  Feb  Mar  Apr  May  Jun
```

#### **D. Recent Measurements:**
```
Date         Value    Status    Notes
2024-04-14   12       🔴 Breach  3 incidents detected
2024-04-07   8        🟢 OK      Normal operations
2024-03-31   9        🟢 OK      -
```

---

### **3. KRI Creation/Edit Form**

**Fields:**

**Basic Information:**
- KRI Name (e.g., "Cybersecurity Incident Rate")
- Description
- Category (dropdown)
- Owner (user selector)

**Measurement:**
- Unit of measure (%, count, currency, ratio)
- Direction (Higher is better / Lower is better)
- Measurement frequency (Daily, Weekly, Monthly, Quarterly)
- Data source

**Thresholds:**
- Green threshold (safe zone)
- Yellow threshold (warning zone)
- Red threshold (breach zone)
- Visual threshold editor

**Risk Linkage:**
- Link to related risks (multi-select)
- Impact on risk rating

---

### **4. KRI Data Entry**

**Quick Entry Form:**
- Select KRI
- Enter current value
- Date/time (auto-filled)
- Notes (optional)
- Attach evidence

**Bulk Upload:**
- CSV import
- Excel import
- API integration (future)

---

## 📊 **Mock Data Structure**

```typescript
interface KRI {
  id: string;
  name: string;
  description: string;
  category: string;
  owner: string;
  unit: string; // '%', 'count', 'USD', 'ratio'
  direction: 'higher_better' | 'lower_better';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  
  // Thresholds
  greenThreshold: number;
  yellowThreshold: number;
  redThreshold: number;
  
  // Current Status
  currentValue: number;
  previousValue: number;
  status: 'ok' | 'warning' | 'breach';
  trend: 'up' | 'down' | 'stable';
  
  // Linkage
  linkedRisks: string[]; // Risk IDs
  
  // History
  measurements: KRIMeasurement[];
}

interface KRIMeasurement {
  id: string;
  kriId: string;
  value: number;
  date: string;
  notes?: string;
  recordedBy: string;
  evidence?: string[];
}
```

---

## 🎨 **UI Components**

### **Status Badge:**
```tsx
// Green
<span className="px-2 py-1 bg-green-100 text-green-700 rounded">OK</span>

// Yellow
<span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Warning</span>

// Red
<span className="px-2 py-1 bg-red-100 text-red-700 rounded">Breach</span>
```

### **Trend Icon:**
```tsx
// Up (bad for "lower is better")
<TrendingUp className="text-red-600" />

// Down (good for "lower is better")
<TrendingDown className="text-green-600" />

// Stable
<Minus className="text-gray-600" />
```

### **Threshold Visualizer:**
```tsx
<div className="h-8 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200">
  <div className="h-full bg-blue-600" style={{ width: '75%' }}>
    Current: 75%
  </div>
</div>
```

---

## 🔔 **Integration with Notifications**

**Auto-trigger alerts when:**
- KRI breaches threshold (RED zone)
- KRI enters warning zone (YELLOW zone)
- KRI trend worsens for 3+ consecutive periods
- No measurement recorded within expected frequency

**Notification Types:**
- Email to KRI owner
- In-app alert
- Dashboard highlight

---

## 📈 **Analytics & Reporting**

**KRI Performance Report:**
- % KRIs on track
- Breach history
- Trend analysis
- Category breakdown

**Executive Summary:**
- Top 5 breached KRIs
- Improvement recommendations
- Risk correlation analysis

---

## 🚀 **Implementation Phases**

### **Phase 1: Core KRI Module** (Today)
- ✅ KRI Dashboard
- ✅ KRI Table with filters
- ✅ Status badges and trend indicators
- ✅ Mock data (24 KRIs)

### **Phase 2: Detail View & Forms** (Next)
- ✅ KRI detail page
- ✅ Historical trend chart
- ✅ Threshold configuration
- ✅ Data entry form

### **Phase 3: Integration** (Future)
- ✅ Link to Risk Register
- ✅ Notification triggers
- ✅ Dashboard widgets
- ✅ Export/reporting

---

## 📋 **Sample KRIs**

**Cybersecurity:**
- Incident count per month
- Mean time to detect (MTTD)
- Patch compliance %
- Phishing click rate

**Operational:**
- System uptime %
- Incident resolution time
- Process defect rate
- Supplier delivery delays

**Financial:**
- Credit default rate
- Liquidity ratio
- Revenue variance
- Budget overrun %

**Compliance:**
- Policy acknowledgment rate
- Audit finding count
- Training completion %
- Regulatory breach count

---

**Status:** 📋 **READY TO BUILD!**
**Priority:** 🔥 **HIGH - Critical for monitoring**
**Estimated Time:** 2-3 hours
