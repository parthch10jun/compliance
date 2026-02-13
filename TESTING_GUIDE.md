# Testing Guide - Program Linking Workflow

## 🎯 Overview

This guide provides step-by-step instructions for testing the Program Linking Workflow functionality.

**Last Updated**: January 1, 2026

---

## 🚀 Getting Started

### Prerequisites
1. Development server running: `npm run dev`
2. Browser open at: `http://localhost:3000`
3. No console errors on page load

### Test Environment
- **Browser**: Chrome/Firefox/Safari (latest)
- **Screen Size**: Desktop (1920x1080 recommended)
- **Network**: Local development

---

## 📋 Test Scenarios

### Test 1: Link Framework to Program

**Objective**: Verify users can link regulatory frameworks to compliance programs

**Steps**:
1. Navigate to any program detail page (e.g., `/programs/pgm-001`)
2. Click the **"Link Framework"** button (cyan, top right)
3. Verify modal opens with "Link to Regulation" title
4. **Step 1 - Select Authority**:
   - Verify authority cards display (RBI, ISO, EU, SDAIA, etc.)
   - Click on **"RBI"** authority
   - Verify navigation to Step 2
5. **Step 2 - Select Framework**:
   - Verify framework list displays
   - Use search box to filter frameworks
   - Click on a framework card
   - Verify checkmark appears on selected framework
   - Verify framework metadata shows (requirements, obligations, controls count)
6. Click **"Link Framework"** button
7. Verify modal closes
8. Check browser console for success message

**Expected Results**:
- ✅ Modal opens smoothly with animation
- ✅ Step indicator shows current step
- ✅ Authority selection works
- ✅ Framework search filters correctly
- ✅ Framework selection highlights properly
- ✅ Link button is disabled until framework selected
- ✅ Modal closes on successful link
- ✅ Console shows: `Linked [Framework Name] to [Program Name]`

---

### Test 2: Add Requirement to Program

**Objective**: Verify users can add requirements via import or creation

**Steps - Import Mode**:
1. Navigate to program detail page
2. Scroll to **Requirements** section
3. Click **"+ Add"** button (amber)
4. Verify modal opens
5. Click **"Import from Library"** option
6. Verify search box appears
7. Search for "MFA" or "encryption"
8. Select 2-3 requirements using checkboxes
9. Verify selection count updates
10. Click **"Import X Requirements"** button
11. Verify modal closes

**Steps - Create Mode**:
1. Open Add Requirement modal
2. Click **"Create New Requirement"** option
3. Fill in form:
   - Code: `REQ-TEST-001`
   - Title: `Test Requirement`
   - Description: `This is a test requirement`
   - Section: `Section 5.1`
   - Category: Select from dropdown
   - Priority: Select from dropdown
4. Click **"Create Requirement"** button
5. Verify modal closes

**Expected Results**:
- ✅ Modal opens with mode selection
- ✅ Import mode shows searchable requirement list
- ✅ Multi-select works with checkboxes
- ✅ Selection count updates correctly
- ✅ Create mode shows form with all fields
- ✅ Form validation works (required fields)
- ✅ Console shows: `Added requirement: {id, title, type}`

---

### Test 3: Map Control to Requirement

**Objective**: Verify users can map controls to requirements

**Steps - Select Existing**:
1. Navigate to program detail page
2. Find a requirement card
3. Click **"Map Control"** button (green)
4. Verify modal opens with "Map Controls" title
5. Verify **"Select Existing"** tab is active
6. Search for controls (e.g., "MFA", "encryption")
7. Select 2-3 controls using checkboxes
8. Verify selection count updates
9. Click **"Map Controls"** button
10. Verify modal closes

**Steps - Create New**:
1. Open Map Control modal
2. Click **"Create New"** tab
3. Fill in form:
   - Code: `CTRL-TEST-001`
   - Name: `Test Control`
   - Description: `Test control description`
   - Category: Select from dropdown
   - Type: Select from dropdown
   - Automation Level: Select from dropdown
4. Click **"Create & Map"** button
5. Verify modal closes

**Expected Results**:
- ✅ Modal opens from requirement card
- ✅ Tab switching works (Select/Create)
- ✅ Search filters controls correctly
- ✅ Multi-select works properly
- ✅ Control effectiveness badges display
- ✅ Create form validates required fields
- ✅ Console shows: `Mapped controls: [array of IDs]`

---

### Test 4: Modal Interactions

**Objective**: Verify modal behavior and interactions

**Steps**:
1. Open any modal (Link Framework, Add Requirement, Map Control)
2. Test the following:
   - Click outside modal → Should NOT close
   - Click X button → Should close
   - Press ESC key → Should close
   - Click Cancel button → Should close
   - Verify backdrop blur effect
   - Verify modal animation (fade-in-up)
3. Open modal, navigate through steps
4. Click "Back" button (if multi-step)
5. Verify returns to previous step
6. Verify state is preserved

**Expected Results**:
- ✅ Modal closes only via X, ESC, or Cancel
- ✅ Backdrop prevents interaction with page
- ✅ Animations are smooth
- ✅ Back navigation works in multi-step modals
- ✅ Form state persists during navigation

---

### Test 5: Responsive Design

**Objective**: Verify modals work on different screen sizes

**Steps**:
1. Open browser DevTools
2. Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
3. Test at different breakpoints:
   - Mobile: 375px width
   - Tablet: 768px width
   - Desktop: 1920px width
4. Open each modal at each breakpoint
5. Verify layout adapts properly

**Expected Results**:
- ✅ Modals are readable at all sizes
- ✅ Buttons don't overflow
- ✅ Text wraps appropriately
- ✅ Scrolling works when content overflows
- ✅ Touch targets are adequate on mobile

---

## 🐛 Common Issues & Solutions

### Issue 1: Modal doesn't open
**Solution**: Check browser console for errors. Verify modal state is being set correctly.

### Issue 2: Search doesn't filter
**Solution**: Verify search query state is updating. Check filter logic in component.

### Issue 3: Selection doesn't persist
**Solution**: Verify selected items state is managed correctly. Check if state resets on re-render.

### Issue 4: Modal doesn't close
**Solution**: Verify onClose callback is passed and called correctly.

---

## ✅ Acceptance Criteria

All tests pass when:
- [ ] All modals open and close correctly
- [ ] Search and filter functionality works
- [ ] Multi-select works with visual feedback
- [ ] Form validation prevents invalid submissions
- [ ] Console shows expected success messages
- [ ] No console errors or warnings
- [ ] Animations are smooth (60fps)
- [ ] Responsive design works on all breakpoints
- [ ] Keyboard navigation works (Tab, Enter, ESC)
- [ ] Accessibility: Screen readers can navigate modals

---

## 📊 Test Coverage Summary

| Feature | Test Coverage | Status |
|---------|--------------|--------|
| Link Framework Modal | Manual | ✅ Ready |
| Add Requirement Modal | Manual | ✅ Ready |
| Map Control Modal | Manual | ✅ Ready |
| Add Test Modal | Manual | ✅ Ready |
| Upload Evidence Modal | Manual | ✅ Ready |
| Execute Test Modal | Manual | ✅ Ready |

---

## 🔄 Next Steps

1. **Automated Testing**: Write Cypress/Playwright tests for all workflows
2. **Unit Tests**: Add Jest tests for modal components
3. **Integration Tests**: Test API integration when backend is ready
4. **Performance Testing**: Measure modal render times
5. **Accessibility Testing**: Run axe-core or WAVE tools

---

**For Questions**: Contact development team or refer to `PROGRAM_LINKING_WORKFLOW.md`

