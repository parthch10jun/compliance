# Quick Start Guide - Compliance Management System

## 🚀 Getting Started in 5 Minutes

This guide will get you up and running with the Compliance Management System.

---

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended

---

## ⚡ Quick Setup

### 1. Clone & Install

```bash
# Navigate to project directory
cd Compliance-Instance-V1.0

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Open Browser

Navigate to: **http://localhost:3000**

You should see the compliance dashboard!

---

## 🗺️ Navigation Guide

### Main Navigation (Left Sidebar)

1. **Dashboard** - Overview and metrics
2. **Compliance** - Programs, requirements, obligations
3. **Controls** - Control library and testing
4. **Library** - Frameworks, risks, policies
5. **Admin** - Settings and configuration

### Quick Access (Top Bar)

- **Search Icon** - Global search (or press `/`)
- **Command Palette** - Quick actions (Cmd/Ctrl + K)
- **Notifications** - Alerts and updates
- **User Menu** - Profile and settings

---

## 🎯 Key Features to Try

### 1. View a Compliance Program

```
1. Click "Compliance" in sidebar
2. Click "Programs"
3. Click on "RBI IT Governance" (pgm-001)
4. Explore the program details
```

**What you'll see**:
- Compliance score and metrics
- Requirements and obligations
- Linked controls and tests
- Risk ratings

### 2. Link a Framework to a Program

```
1. On program detail page
2. Click "Link Framework" (cyan button, top right)
3. Select an authority (e.g., "RBI")
4. Select a framework
5. Click "Link Framework"
```

**Result**: Framework linked to program (console message)

### 3. Add a Requirement

```
1. On program detail page
2. Scroll to "Requirements" section
3. Click "+ Add" (amber button)
4. Choose "Import from Library" or "Create New"
5. Complete the workflow
```

**Result**: Requirement added (console message)

### 4. Map a Control to Requirement

```
1. Find a requirement card
2. Click "Map Control" (green button)
3. Search and select controls
4. Click "Map Controls"
```

**Result**: Controls mapped (console message)

---

## 📁 Project Structure

```
Compliance-Instance-V1.0/
├── src/
│   ├── app/                    # Pages (Next.js App Router)
│   │   ├── programs/          # Program management
│   │   ├── requirements/      # Requirements
│   │   ├── obligations/       # Obligations
│   │   ├── controls/          # Controls
│   │   ├── tests/             # Tests
│   │   └── library/           # Library pages
│   ├── components/            # React components
│   │   ├── LinkFrameworkModal.tsx
│   │   ├── AddRequirementModal.tsx
│   │   ├── MapControlModal.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── data/              # Mock data
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Utilities
│   └── styles/                # Global styles
├── public/                    # Static assets
└── Documentation files (.md)
```

---

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Useful during development
npm run dev -- --turbo    # Use Turbopack (faster)
```

---

## 🎨 Customization

### Change Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: #3B82F6;        /* Blue */
  --success: #10B981;        /* Green */
  --warning: #F59E0B;        /* Amber */
  --error: #EF4444;          /* Red */
}
```

### Add Mock Data

Edit files in `src/lib/data/`:
- `mock-data.ts` - Programs, assessments, issues
- `requirements-obligations.ts` - Requirements and obligations
- `controls.ts` - Controls
- `risks.ts` - Risks and risk-control links
- `control-tests.ts` - Tests
- `evidence.ts` - Evidence

---

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### TypeScript Errors

```bash
# Check TypeScript
npx tsc --noEmit

# Fix common issues
npm run lint -- --fix
```

---

## 📚 Learn More

### Documentation
- **PROGRAM_LINKING_WORKFLOW.md** - Workflow details
- **TESTING_GUIDE.md** - How to test features
- **PROJECT_STATUS_SUMMARY.md** - Project overview
- **FUTURE_ENHANCEMENTS_ROADMAP.md** - Upcoming features

### Key Concepts

1. **Programs**: Compliance programs (e.g., ISO 27001, GDPR)
2. **Requirements**: Continuous compliance mandates
3. **Obligations**: Time-bound compliance actions
4. **Controls**: Security/compliance controls
5. **Tests**: Control effectiveness tests
6. **Evidence**: Supporting documentation
7. **Risks**: Risk register and assessments

### Traceability Chain

```
Authority → Framework → Program → Requirement/Obligation → 
Control → Test → Evidence
```

---

## 🎓 Next Steps

### For Developers

1. **Explore the codebase**: Start with `src/app/programs/[id]/page.tsx`
2. **Understand the data model**: Check `src/lib/types/compliance.ts`
3. **Review components**: Look at modal components in `src/components/`
4. **Read documentation**: Go through all .md files

### For Product Owners

1. **Test the workflows**: Follow `TESTING_GUIDE.md`
2. **Review features**: Check `PROJECT_STATUS_SUMMARY.md`
3. **Plan next phase**: See `FUTURE_ENHANCEMENTS_ROADMAP.md`
4. **Provide feedback**: Document requirements for backend integration

---

## 💡 Tips & Tricks

### Keyboard Shortcuts

- **`/`** - Open command palette
- **`Cmd/Ctrl + K`** - Open command palette
- **`G` then `H`** - Go to home
- **`G` then `P`** - Go to programs
- **`ESC`** - Close modals

### Development Tips

1. **Hot Reload**: Changes auto-refresh in browser
2. **Console Logs**: Check browser console for debug info
3. **React DevTools**: Install for component inspection
4. **TypeScript**: Hover over variables for type info

---

## 📞 Need Help?

- **Documentation**: Check all .md files in project root
- **Code Comments**: Most components have inline comments
- **Console**: Check browser console for errors/warnings
- **Build Output**: Check terminal for build errors

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Dev server starts without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] Navigation works (sidebar, top bar)
- [ ] Program detail page loads
- [ ] Modals open and close
- [ ] No console errors
- [ ] Search works
- [ ] Command palette opens (Cmd/Ctrl + K)

---

**You're all set! Start exploring the Compliance Management System! 🎉**

