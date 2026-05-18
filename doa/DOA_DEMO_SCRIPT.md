# 🎯 DoA Module - Executive Demo Script

**Duration:** 15-20 minutes  
**Audience:** C-Suite, Board Members, Investors, Senior Leadership  
**Presenter:** Product Lead / Solution Architect  
**Objective:** Demonstrate decision-grade Delegation of Authority system with real-world workflows

---

## 🎬 **OPENING (1 minute)**

### **Introduction**
> "Good morning. Today I'll walk you through AutoResilience's Delegation of Authority module — a comprehensive system that automates approval routing, enforces segregation of duties, and provides real-time governance visibility across your organization."

> "This is not a prototype — what you'll see is a production-ready implementation covering 13 complete workflows, from mobile approvals to executive dashboards."

**Navigate to:** http://localhost:3000/doa

> "We're starting from the DoA home page. Notice the clean, professional interface with amber as our primary accent — this is designed for daily use by executives who need clarity, not clutter."

---

## 📋 **ACT 1: The Approver's Daily Workflow (4 minutes)**

### **Screen 1: Approvals Inbox**
**Navigate to:** http://localhost:3000/doa/approvals-inbox

> "Let me show you what Sarah, our CFO, sees when she logs in each morning."

**Demo Points:**
- **Point to tabs:** "She has 12 items in her queue, 3 delegated to her team, and she's watching 5 others."
- **Highlight SLA badges:** "These color codes — green, amber, red — tell her at a glance what needs immediate attention. This one here has only 3 hours left before SLA breach."
- **Show filters:** "She can filter by function, amount range, risk level. Let's say she wants to focus on high-value procurement items over EUR 100k..."
- **Click filter:** Set Amount to "€100k+" and Function to "Procurement"
- **Point to results:** "Now she sees only the 3 procurement requests above 100k euros."

**Select a request:** Click on "Annual SaaS renewal — Salesforce" (APR-000045)

---

### **Screen 2: Approval Detail**
**Auto-navigates to:** http://localhost:3000/doa/approvals/APR-000045

> "Here's the full request. Notice the amount: EUR 450,000 — this is a material commitment."

**Demo Points:**
1. **Approval Chain (left):**
   > "Pierre from Procurement already approved at Level 1. Now Sarah, as CFO, is at Level 2. If she approves, it routes to the CEO for final sign-off — this is our three-level procurement authority structure."

2. **SoD Check (green badge):**
   > "See this green 'CLEAR' badge? Our segregation of duties engine already verified that Sarah has no conflicting roles — she can't both create AND approve vendor contracts for the same supplier."

3. **Risk Assessment:**
   > "Medium risk. The system automatically flagged this as a renewal with pricing increased 8% — above our 5% baseline. That's why it needs CFO review."

4. **Attachments:**
   > "Three attachments: the contract, pricing breakdown, and vendor performance scorecard. Sarah can review these inline."

5. **Comments:**
   > "Pierre left a note: 'Pricing negotiated down from EUR 520k initial quote.' Full audit trail of every interaction."

**Action:** Click **"Approve"** button

> "Sarah approves. Notice the success message — 'Step 2 approved. Advanced to Cathy Wang (CEO) for final approval.' The system immediately routes it to the next step. This entire approval took 30 seconds, not 3 days of email tennis."

**Key Takeaway:**  
> "For approvers: **Zero manual routing**. The system knows the chain, enforces SoD, tracks SLA, and logs every action."

---

## 🏗️ **ACT 2: How Authority is Configured (4 minutes)**

### **Screen 3: Authority Matrix Grid**
**Navigate to:** http://localhost:3000/doa/authority-matrix/procurement

> "Now let's see how these approval chains are actually defined. This is the Procurement Authority Matrix — the source of truth."

**Demo Points:**
- **Point to grid structure:**
  > "Rows are decision types: Purchase Orders, Service Contracts, Vendor Onboarding. Columns are authority levels: L1 up to EUR 50k, L2 up to EUR 500k, L3 unlimited."

- **Hover over a cell:**
  > "Hovering shows me: 'Step 1: Procurement Manager' with specific role IDs. These aren't just titles — they're linked to our HR system."

- **Highlight color coding:**
  > "Green cells = active rules. Gray = no threshold defined. This visual makes gaps obvious."

- **Export button:**
  > "Audit and Compliance can export this as Excel or PDF for board packs or SOX documentation."

**Click "Edit Matrix"** → Navigate to Matrix Builder

---

### **Screen 4: Matrix Builder**
**Navigate to:** http://localhost:3000/doa/authority-matrix/designer

> "This is how Risk & Compliance teams build and modify matrices — no IT required."

**Demo Points:**
1. **Decision Type dropdown:**
   > "Let's add a new rule. I select 'Purchase Order' as my decision type."

2. **Threshold sliders:**
   > "I set the monetary threshold: EUR 0 to EUR 50,000. This defines the boundary."

3. **Role selector:**
   > "I assign 'Procurement Manager' as the approver. I can add multiple roles, require majority voting, or set up parallel approval paths."

4. **Dimensions (Advanced):**
   > "I can add conditional logic: if Legal Entity = 'UK Subsidiary' AND Department = 'Marketing', route to UK Marketing Head instead. This handles our complex org structure."

5. **Preview panel (right):**
   > "The preview shows me exactly how this rule will behave. Before I save, I can test it."

**Click "Save Rule"**

> "Saved. But notice — it's in 'Draft' state. Changes to authority matrices require Compliance approval before going live. No rogue changes."

---

### **Screen 5: Matrix Simulator**
**Navigate to:** http://localhost:3000/doa/authority-matrix/simulate

> "Before rolling out a new matrix, you can test it with real scenarios."

**Demo Points:**
1. **Input form (left):**
   > "I enter: Decision Type = Purchase Order, Amount = EUR 125,000, Department = Procurement, Legal Entity = Germany."

2. **Click "Resolve Chain"**

3. **Results (right):**
   > "The engine resolves this in under 500 milliseconds — that's our NFR. It tells me: Step 1 goes to Procurement Manager, Step 2 to Finance Director, Step 3 to CFO."
   
4. **SoD Check:**
   > "It also runs SoD rules: 'CLEAR — no conflicts detected.'"

5. **What-If Testing:**
   > "Now I change Amount to EUR 25,000 and re-resolve... See? Only Step 1 now. The chain adapts dynamically to the thresholds."

**Key Takeaway:**  
> "For governance teams: **Full control, zero guesswork**. Test before you deploy, simulate edge cases, and ensure no gaps in coverage."

---

## 👥 **ACT 3: Delegation & Absence Management (3 minutes)**

### **Screen 6: Delegations Calendar**
**Navigate to:** http://localhost:3000/doa/delegations

> "Real world: people go on vacation. Here's how we handle that without breaking approval flows."

**Demo Points:**
- **Calendar view:**
  > "This is next month. See the colored blocks? Each one is a delegation. Green = active, amber = expiring soon."

- **Click on a delegation block (May 18-25):**
  > "Sarah Chen (CFO) delegates to Michael Torres (Finance Director) while she's on vacation in Bali. Effective May 18-25."

- **Show cap:**
  > "Notice the cap: up to EUR 500,000. Anything above that waits for Sarah's return or escalates to the CEO. We don't give carte blanche."

- **List view tab:**
  > "Switch to list view — we can see all delegations with status, scope, and expiry dates. The system auto-expires them and sends reminders at T-7, T-3, T-1 days."

**Click "New Delegation"** → Navigate to Wizard

---

### **Screen 7: Create Delegation Wizard**
**Navigate to:** http://localhost:3000/doa/delegations/new

> "Creating a delegation is a guided 4-step process."

**Demo Points:**
1. **Step 1: Type & Duration:**
   > "I select 'Temporary (OOO)' and set dates: June 1-14. Two weeks."

2. **Step 2: Scope:**
   > "I choose: All Procurement approvals, but only for EUR 0-200k. Higher amounts don't delegate."

3. **Step 3: Delegate:**
   > "I pick Jessica Martinez as my delegate. The system checks her workload — she has 8 pending items. Acceptable."

4. **Step 4: Review:**
   > "Preview: 'While you're away, Jessica will handle Procurement approvals up to EUR 200k.' I confirm."

**Click "Create Delegation"**

> "Done. Jessica gets notified, the calendar updates, and any approvals routed to me during June 1-14 auto-route to her. Zero manual handoff."

**Key Takeaway:**  
> "For business continuity: **No approval blackouts**. Planned absences, emergencies, and workload balancing are handled systematically."

---

## 📜 **ACT 4: Policy Versioning & Change Control (2 minutes)**

### **Screen 8: Policy Version Diff**
**Navigate to:** http://localhost:3000/doa/policies/procurement

> "Authority matrices aren't static — they change as the business grows. Here's how we manage that."

**Demo Points:**
1. **Version selector:**
   > "We're on version 2026.2, effective March 1. I can compare it to the previous version, 2026.1."

2. **Click Left dropdown → Select v2026.1, Right dropdown → Select v2026.2**

3. **Diff table:**
   > "The system highlights exactly what changed. Row 3: Capital Expenditure threshold increased from EUR 100k to EUR 150k — that's a material change requiring board approval."
   
   > "Color coding: green = added, red = removed, amber = modified."

4. **Click "Export PDF":**
   > "I can export this comparison as a signed PDF for the audit committee. Compliance loves this."

5. **Approval workflow (top banner):**
   > "Notice: 'v2026.2 approved by Board on 2026-02-15.' Every version has an approval trail."

**Key Takeaway:**  
> "For audit & compliance: **Full change history**. No mystery about who changed what and when."

---

## 🚨 **ACT 5: SoD Enforcement & Exceptions (3 minutes)**

### **Screen 9: SoD Rule Library**
**Navigate to:** http://localhost:3000/doa/sod/rules

> "Segregation of Duties is the backbone of internal controls. Here's our rule engine."

**Demo Points:**
1. **Rule table:**
   > "Rule SOD-001: 'Cannot create AND approve vendor payments for the same vendor.' Critical severity, blocking action."

2. **Test Panel (right):**
   > "Let's test it. I enter a JSON payload simulating Lisa trying to approve a payment she created..."

3. **Click "Evaluate":**
   > "Result: 'VIOLATION DETECTED — User u_28833 created invoice AND is attempting approval.' The system blocks this in real-time, under 500ms."

4. **Bulk operations:**
   > "We can enable/disable rules, import rule packs from YAML, or export for external audit."

**Navigate to:** http://localhost:3000/doa/exceptions

---

### **Screen 10: Exception Management**
**Navigate to:** http://localhost:3000/doa/exceptions

> "Sometimes business needs override controls — mergers, emergencies. That's where exceptions come in."

**Demo Points:**
1. **Exception Budget Bar (top):**
   > "We allow 90 days of exceptions per year per function. Procurement has consumed 82 days — that's 91%, in the red zone. The CFO gets auto-notified."

2. **Active Exceptions tab:**
   > "11 active exceptions right now. Let's click on EXC-241..."

3. **Exception detail panel:**
   > "This is a temporary SoD mitigation: Lisa can approve vendor payments during the CFO transition. But notice:"
   
   - **Compensating controls:** "Daily audit log review by Compliance + Dual signature for amounts > EUR 10k."
   - **Expiry:** "June 30, 2026. Auto-expires. No perpetual exceptions."
   - **Risk linkage:** "Linked to risk register item RR-2026-018 and compliance finding COMP-FIND-089."

4. **Click "Renew" or "Revoke":**
   > "If we revoke early, downstream system actions are reversed where possible. Full lifecycle management."

**Key Takeaway:**  
> "For risk management: **Controlled exceptions, not free passes**. Time-boxed, monitored, and linked to your ERM framework."

---

## 📊 **ACT 6: Executive Visibility (3 minutes)**

### **Screen 11: Executive Dashboard**
**Navigate to:** http://localhost:3000/doa/reports/executive-dashboard

> "For the C-suite and board: real-time governance health in one view."

**Demo Points:**
1. **KPI cards (top row):**
   > "8,247 approval requests this period. Average cycle time: 11.3 hours — down 18% from last quarter. SLA compliance: 94.1%. 23 active exceptions. 8 SoD blocks."

2. **Daily Volume chart:**
   > "Approval volume over 30 days. Notice the spike on April 28? Quarter-end. We can drill down..." 
   
   **Click a bar** → Drill-down table appears

   > "Now I see all 340 requests from that day. Full transparency."

3. **Cycle Time by Function:**
   > "Procurement median: 8 hours. HR median: 22 hours — that's slower. The p95 is 48 hours, indicating bottlenecks."

4. **Top Bottlenecks:**
   > "Michael Chen takes 18 hours average on approvals with 47 pending. Maybe he needs delegation or workload rebalancing."

5. **Exception Heatmap:**
   > "This uses a color-blind safe palette. IT has 15 SoD mitigation exceptions — that's concerning. We'd investigate."

6. **Click "Schedule":**
   > "I can schedule this dashboard to email the board every Monday as a signed PDF. Automated governance reporting."

**Key Takeaway:**  
> "For executives: **No black box**. See approval velocity, bottlenecks, exceptions, and SoD health in real-time, refreshed in under 1 second."

---

## 🔒 **ACT 7: Audit Trail & Evidence (2 minutes)**

### **Screen 12: Audit Trail Search**
**Navigate to:** http://localhost:3000/doa/audit-trail

> "For auditors — internal or external — here's the immutable evidence trail."

**Demo Points:**
1. **Filter controls:**
   > "I can search by actor, date range, entity type, severity. Let's filter to 'Approve, Reject' actions in Procurement..."

2. **Results table:**
   > "Every state-changing event is logged. See evt-1247: Lily Tan approved Step st_98112. Time, action, before/after summary, and most importantly..."

3. **Hash column:**
   > "Each event has a cryptographic hash. It references the previous event's hash — that's a tamper-evident chain, like blockchain."

4. **Click to expand a row:**
   > "Full before/after JSON. Before: status PENDING. After: status APPROVED, approver Lily Tan. Complete state change."

5. **Hash Chain detail:**
   > "Previous hash: a1b2... Current hash: f9e8... The system verifies the chain integrity."

6. **Click "Verify Integrity":**
   > "Watch... Verified 1,247 events in 1.8 seconds. No breaks, no tampering. For 1 million events, this completes in under 60 seconds."

7. **Click "Export Evidence Pack":**
   > "This bundles: JSON log, signed PDF summary, SHA-256 manifest — into a ZIP. Reproducible: same filter always generates identical hashes. Perfect for SOX, PCI, or ISO audits."

**Key Takeaway:**  
> "For audit: **Tamper-proof evidence**. Hash-chained events, sub-minute verification, and exportable evidence packs for compliance frameworks."

---

## 📱 **ACT 8: Mobile & Conversational Approvals (3 minutes)** ⭐

### **Screen 13: Mobile & Conversational Surfaces**
**Navigate to:** http://localhost:3000/doa/mobile-demo

> "Finally, the reality: executives don't live in web apps. They're in Teams meetings, checking email, or on their phones. So we meet them where they are."

**Demo Points:**

#### **1. Native Mobile (iOS/Android)**
**Click "Native Mobile" tab**

> "This is what an approval looks like on Sarah's iPhone."

- **Scroll through the mobile card:**
  > "Request summary, amount EUR 450k, SoD status, SLA timer — all at her fingertips."

- **Point to attachments:**
  > "She can preview the 3 attachments inline."

- **MFA notice:**
  > "See this amber box? Because this is over EUR 100k, the system requires step-up MFA — Face ID or biometric authentication."

- **Click "Approve":**
  > "Watch... Face ID prompt. Authenticating via Microsoft Authenticator..."
  
  > "Approved. Decision logged to the audit trail with channel attribution: 'mobile.' Same audit semantics as web."

- **Offline queue icon (bottom nav):**
  > "If she's on a plane with no internet, decisions queue offline and sync when she lands — with conflict detection."

---

#### **2. Microsoft Teams**
**Click "Microsoft Teams" tab**

> "Many organizations run on Teams. Here's an adaptive card posted to Sarah's 1:1 chat with the DoA bot."

- **Card structure:**
  > "Same request, different format. Purple branding for Teams. Action buttons right in the card."

- **Click "Approve":**
  > "She approves without leaving Teams. The card updates, logs to audit trail with channel: 'teams.' Her team in the Procurement channel can see approvals in real-time."

---

#### **3. Outlook Actionable Email**
**Click "Outlook Email" tab**

> "For those who live in email — Outlook actionable messages."

- **Email layout:**
  > "Looks like a normal email: 'Approval required — DOA-23491.' Subject line, from DoA system."

- **Actionable card:**
  > "But inside the email body is an interactive card. She can approve directly in Outlook — desktop, web, or mobile app."

- **MFA notice:**
  > "Same step-up MFA for amounts ≥ EUR 100k via Microsoft Authenticator."

- **'Why this email' link (bottom):**
  > "She can click here to see routing logic and manage notification preferences. Transparency about why she's getting pinged."

- **Click "Approve":**
  > "Approved via Outlook. Channel: 'outlook' in the audit trail. Localized content per her preferred language (English, German, Spanish, etc.)."

---

### **Feature Comparison Table**
**Point to the "Acceptance Criteria" section below the demo**

> "All three surfaces meet the same standards:"
- ✅ **Unified audit trail** with channel attribution
- ✅ **Step-up MFA** above EUR 100k threshold
- ✅ **Localized content** per user's language

**Key Takeaway:**  
> "For user adoption: **Decision parity**. Approvals work the same whether you're at your desk, in a meeting, or on vacation. Same security, same audit trail, zero friction."

---

## 🎬 **CLOSING (2 minutes)**

### **Summary**
> "Let me recap what we've seen:"

1. **Approvers:** Zero manual routing, SLA tracking, full context in one view
2. **Governance teams:** Visual matrix builder, simulation, no-code rule management
3. **Business continuity:** Structured delegation with caps and auto-expiry
4. **Compliance:** Version control, change diff, policy approval workflows
5. **Risk:** Real-time SoD enforcement, time-boxed exceptions, compensating controls
6. **Executives:** KPI dashboards, drill-down analytics, automated reporting
7. **Audit:** Tamper-proof hash chains, evidence packs, sub-minute verification
8. **Mobility:** Approve from Teams, Outlook, or mobile with biometric MFA

---

### **Business Impact**
> "What does this mean for your organization?"

- **Speed:** Approval cycles drop from days to hours
- **Control:** SoD violations blocked in real-time, not discovered in post-audit
- **Visibility:** Board gets governance metrics in real-time, not quarterly reports
- **Compliance:** Audit-ready evidence at the click of a button
- **Adoption:** Works where people already are — no app-switching fatigue

---

### **Next Steps**
> "This is production-ready code. We can:"
1. **Pilot with one function** (e.g., Procurement) and scale
2. **Integrate with your systems:** ERP, HRMS, vendor portals
3. **Customize matrices** to your org structure and policies
4. **Deploy mobile apps** to iOS/Android app stores
5. **Go live in 8-12 weeks** with phased rollout

> "Questions?"

---

## 📋 **APPENDIX: Quick Navigation Cheat Sheet**

For live demos, keep this handy:

1. **Approvals Inbox:** http://localhost:3000/doa/approvals-inbox
2. **Approval Detail:** http://localhost:3000/doa/approvals/APR-000045
3. **Matrix Grid:** http://localhost:3000/doa/authority-matrix/procurement
4. **Matrix Builder:** http://localhost:3000/doa/authority-matrix/designer
5. **Simulator:** http://localhost:3000/doa/authority-matrix/simulate
6. **Delegations:** http://localhost:3000/doa/delegations
7. **New Delegation:** http://localhost:3000/doa/delegations/new
8. **Policy Diff:** http://localhost:3000/doa/policies/procurement
9. **SoD Rules:** http://localhost:3000/doa/sod/rules
10. **Exceptions:** http://localhost:3000/doa/exceptions
11. **Dashboard:** http://localhost:3000/doa/reports/executive-dashboard
12. **Audit Trail:** http://localhost:3000/doa/audit-trail
13. **Mobile Demo:** http://localhost:3000/doa/mobile-demo

---

**END OF DEMO SCRIPT**

*Estimated total time: 15-20 minutes with Q&A pauses*  
*Customize pacing based on audience engagement and technical depth required.*
