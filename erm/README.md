# 🟪 Enterprise Risk Management (ERM) Module

> **Indigo-themed risk management module integrated with Compliance Instance**

---

## 🎨 **Color Scheme - Indigo**

```css
Primary:    #6366F1  (Indigo-500)
Hover:      #4F46E5  (Indigo-600)
Light:      #A5B4FC  (Indigo-300)
Lightest:   #E0E7FF  (Indigo-100)
```

**Why Indigo?**
- ✅ Strategic, analytical, enterprise-level thinking
- ✅ Distinct from Compliance (Teal)
- ✅ Professional and modern
- ✅ Perfect for C-suite risk dashboards

---

## 📁 **Structure**

```
erm/
├── app/
│   └── page.tsx              # Main ERM dashboard
├── components/              # ERM-specific components (future)
├── lib/                     # Utilities and services
├── styles/
│   └── erm-theme.css        # Indigo color scheme
└── README.md               # This file
```

**Integration:**
- Lives in main Compliance project at `/erm`
- Accessed via sidebar link with Indigo gradient button
- Shares design system with Compliance (typography, spacing, patterns)

---

## 🚀 **Features**

### **Dashboard (Initial)**
- ✅ Key Metrics Cards
  - Total Risks: 127
  - Critical Risks: 8
  - Active Mitigations: 94
  - Risk Score: 6.2

- ✅ Risk Distribution by Severity
  - Visual progress bars
  - Critical, High, Medium, Low breakdown

- ✅ Top Risk Categories
  - Cybersecurity
  - Operational
  - Financial
  - Compliance
  - Strategic

- ✅ Recent Risk Activities
  - New risks
  - Mitigations
  - Assessments

---

## 🎯 **Access**

### **From Compliance App:**
1. Look at left sidebar (bottom)
2. Click **"Risk Management"** button (Indigo gradient)
3. Opens `/erm` dashboard

### **Direct URL:**
```
http://localhost:3006/erm
```

---

## 🎨 **Design Consistency**

### **Same as Compliance:**
- ✅ Typography (Outfit font, same sizes)
- ✅ Spacing system (p-6, gap-6, etc.)
- ✅ Border radius (rounded-xl)
- ✅ Hover states and transitions
- ✅ Card layouts
- ✅ Table patterns (when added)

### **Different:**
- 🟪 Primary color (Indigo instead of Teal)
- 🟪 Gradient backgrounds (Indigo gradients)
- 🟪 Icon badge colors

---

## 🔮 **Future Enhancements**

### **Phase 1 (Next):**
- [ ] Risk Register table (with vertical borders!)
- [ ] Risk details modal
- [ ] Risk creation form
- [ ] Filters by severity/category

### **Phase 2:**
- [ ] Risk assessment workflows
- [ ] Mitigation tracking
- [ ] Heat map visualization
- [ ] Risk appetite dashboard

### **Phase 3:**
- [ ] Integration with Compliance controls
- [ ] Automated risk scoring
- [ ] Predictive risk analytics
- [ ] Board-ready risk reports

---

## 📊 **Color Usage Guide**

### **Risk Severity:**
```css
Critical:  #DC2626  (Red-600)
High:      #F59E0B  (Amber-500)
Medium:    #EAB308  (Yellow-500)
Low:       #10B981  (Green-500)
```

### **Status:**
```css
Active:     #10B981  (Green)
Pending:    #F59E0B  (Amber)
Overdue:    #DC2626  (Red)
Mitigated:  #3B82F6  (Blue)
```

### **Categories:**
```css
Cybersecurity:  Indigo
Operational:    Blue
Financial:      Green
Compliance:     Purple
Strategic:      Amber
```

---

## 🔗 **Links to Compliance**

### **Shared Resources:**
- Uses same `globals.css` for base styles
- Uses same components (when applicable)
- Same sidebar navigation wrapper
- Same topbar

### **Independent:**
- Own color scheme (`erm-theme.css`)
- Own pages and routes
- Own data models (future)
- Can be deployed separately later

---

## 📝 **Notes**

- **Current Status:** Initial dashboard with mock data
- **Integration:** Fully integrated with Compliance sidebar
- **Theme:** Indigo (#6366F1) - professional and distinct
- **Next Steps:** Build risk register table and forms

---

**Created:** 2026-04-09  
**Version:** 1.0 (Initial)  
**Theme:** Indigo  
**Status:** 🟢 Live and accessible
