# 🎭 Demo Wizard - Interactive Product Tour System

## Overview

The **Demo Wizard** is an elegant, story-driven interactive tour system that guides users through the Ascent Compliance platform. Inspired by enterprise onboarding experiences like Notion, Linear, and Figma, it provides:

- ✨ **Spotlight Effects** - Highlights specific UI elements with animated focus
- 🎯 **Animated Arrows** - Dynamic arrows pointing to important features
- 💬 **Story Cards** - Beautiful tooltip cards with narrative explanations
- 📊 **Progress Tracking** - Visual progress bar showing tour completion
- 🚀 **Smart Navigation** - Auto-scroll and auto-route to different pages
- 🎨 **Smooth Animations** - Fade-ins, slide-ins, pulse effects
- 📚 **Multiple Tours** - Different tours for different modules
- ⏭️ **User Controls** - Skip, replay, and navigate through tours

---

## 🏗️ Architecture

### Components

```
src/
├── contexts/
│   └── DemoWizardContext.tsx       # State management for demo tours
├── components/
│   ├── DemoWizard.tsx              # Main wizard overlay component
│   └── DemoWizardLauncher.tsx      # Floating button & tour selector
└── lib/demo/
    └── tours.ts                     # Tour configurations
```

### Key Files

1. **DemoWizardContext.tsx** - React Context for managing tour state
2. **DemoWizard.tsx** - Renders spotlight, tooltips, and navigation
3. **DemoWizardLauncher.tsx** - Floating button to launch tours
4. **tours.ts** - Tour definitions and configurations

---

## 🚀 Usage

### Launching a Tour

The Demo Wizard automatically appears as a **floating button** in the bottom-right corner of the screen.

1. Click the **sparkle button** (✨) in the bottom-right
2. Select a tour from the modal
3. Follow the guided steps

### Available Tours

| Tour | Category | Duration | Steps |
|------|----------|----------|-------|
| **Welcome to Ascent Compliance** | Getting Started | 3 min | 5 |
| **Understanding Programs** | Programs | 4 min | 4 |
| **Managing Requirements** | Requirements | 5 min | 4 |
| **Control Management** | Controls | 6 min | 3 |

---

## 🎨 Creating New Tours

### 1. Define Tour Configuration

Add a new tour to `src/lib/demo/tours.ts`:

```typescript
{
  id: 'my-custom-tour',
  name: 'My Custom Tour',
  description: 'Learn about custom features',
  category: 'workflows',
  estimatedTime: '4 min',
  icon: '🎯',
  steps: [
    {
      id: 'step-1',
      title: 'Welcome!',
      description: 'This is the first step of your tour.',
      targetSelector: '[data-tour="my-element"]',
      position: 'bottom',
      arrowPosition: 'top',
      route: '/my-page',
    },
    // Add more steps...
  ],
}
```

### 2. Add data-tour Attributes

Add `data-tour` attributes to elements you want to highlight:

```tsx
<div data-tour="my-element">
  This element will be highlighted during the tour
</div>
```

### 3. Step Configuration Options

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique step identifier |
| `title` | string | Step title shown in tooltip |
| `description` | string | Step description/explanation |
| `targetSelector` | string | CSS selector for element to highlight |
| `position` | string | Tooltip position: 'top', 'bottom', 'left', 'right', 'center' |
| `arrowPosition` | string | Arrow direction: 'top', 'bottom', 'left', 'right' |
| `route` | string | Navigate to this route before showing step |
| `action` | function | Optional action to perform |
| `waitForElement` | boolean | Wait for element to appear |
| `highlightPadding` | number | Padding around highlighted element |
| `tooltipWidth` | number | Custom tooltip width |

---

## 🎯 Tour Categories

Tours are organized into categories:

- **getting-started** 🚀 - Onboarding and platform overview
- **programs** 📋 - Program management features
- **requirements** 📄 - Requirements tracking
- **controls** 🛡️ - Control management
- **workflows** 🔄 - Workflow automation
- **advanced** ⚡ - Advanced features

---

## 🎨 Customization

### Styling

The Demo Wizard uses CSS variables from your theme:

```css
--primary              /* Primary color for highlights */
--primary-light        /* Light variant */
--primary-dark         /* Dark variant */
--foreground           /* Text color */
--foreground-muted     /* Muted text */
```

### Animations

Custom animations are defined in `globals.css`:

- `animate-pulse-slow` - Slow pulsing effect for highlights
- `fade-in` - Fade in animation
- `slide-in-from-bottom-4` - Slide up animation

---

## 📊 Programmatic Control

### Using the Hook

```typescript
import { useDemoWizard } from '@/contexts/DemoWizardContext';

function MyComponent() {
  const {
    isActive,
    currentTour,
    currentStepIndex,
    startTour,
    nextStep,
    previousStep,
    skipTour,
    progress,
  } = useDemoWizard();

  // Start a specific tour
  const handleStartTour = () => {
    const tour = getTourById('getting-started');
    if (tour) startTour(tour);
  };

  return (
    <button onClick={handleStartTour}>
      Start Tour
    </button>
  );
}
```

---

## 🔧 Advanced Features

### Auto-Navigation

Tours can automatically navigate between pages:

```typescript
{
  id: 'navigate-step',
  title: 'Programs Page',
  description: 'Let\'s explore the programs page',
  targetSelector: '[data-tour="programs-header"]',
  position: 'bottom',
  route: '/programs', // Automatically navigates here
}
```

### Conditional Steps

Wait for elements to appear before showing step:

```typescript
{
  id: 'wait-step',
  title: 'Dynamic Content',
  description: 'This waits for the element to load',
  targetSelector: '[data-tour="dynamic-element"]',
  position: 'right',
  waitForElement: true, // Retries until element is found
}
```

### Custom Actions

Execute custom code during a step:

```typescript
{
  id: 'action-step',
  title: 'Interactive Step',
  description: 'This step performs an action',
  targetSelector: '[data-tour="button"]',
  position: 'bottom',
  action: () => {
    // Custom logic here
    console.log('Step action executed!');
  },
}
```

---

## 🎯 Best Practices

1. **Keep steps focused** - Each step should explain one concept
2. **Use clear language** - Write conversational, friendly descriptions
3. **Add visual cues** - Use arrows to point to specific elements
4. **Test navigation** - Ensure routes work correctly
5. **Optimize timing** - Don't make tours too long (5-7 steps ideal)
6. **Add data-tour attributes** - Mark all important UI elements
7. **Test on different screens** - Ensure tooltips fit on mobile

---

## 🚀 Future Enhancements

- [ ] **Tour Analytics** - Track completion rates
- [ ] **User Preferences** - Remember completed tours
- [ ] **Interactive Hotspots** - Click to reveal more info
- [ ] **Video Integration** - Embed videos in tour steps
- [ ] **Branching Tours** - Different paths based on user choices
- [ ] **Confetti Effects** - Celebrate tour completion
- [ ] **Voice Narration** - Optional audio guide
- [ ] **Multi-language Support** - Internationalization

---

## 📝 Example: Complete Tour

```typescript
{
  id: 'complete-example',
  name: 'Complete Example Tour',
  description: 'A full example showing all features',
  category: 'getting-started',
  estimatedTime: '5 min',
  icon: '🎓',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome! 👋',
      description: 'Let\'s explore the platform together.',
      targetSelector: 'body',
      position: 'center',
    },
    {
      id: 'dashboard',
      title: 'Your Dashboard',
      description: 'This is your compliance command center.',
      targetSelector: '[data-tour="compliance-score"]',
      position: 'bottom',
      arrowPosition: 'top',
      route: '/',
    },
    {
      id: 'navigation',
      title: 'Navigate Easily',
      description: 'Use the sidebar to access all modules.',
      targetSelector: 'aside',
      position: 'right',
      arrowPosition: 'left',
      highlightPadding: 12,
    },
  ],
}
```

---

## 🎉 Enjoy the Demo Wizard!

The Demo Wizard makes onboarding delightful and helps users discover features naturally. Happy touring! ✨

