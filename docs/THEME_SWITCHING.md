# 🌓 Theme Switching Guide - Light/Dark Mode

> **How to implement dynamic theme switching in this Tailwind CSS app**

---

## 🎯 **Current State**

**Right Now:**
- ✅ Light theme using CSS variables (`--background`, `--foreground`, etc.)
- ✅ Components use `className="bg-[var(--background)]"`
- ❌ No dark theme toggle (but we have the dark theme palette documented)

**Goal:**
- ✅ Add dark mode toggle
- ✅ Persist user preference
- ✅ Respect system preference
- ✅ Smooth theme transitions

---

## 🚀 **Implementation Strategy**

### **Approach 1: CSS Variables with `data-theme` (RECOMMENDED)**

This keeps your existing CSS variable system and just swaps the values.

#### **Step 1: Update `globals.css`**

```css
/* Light Theme (Default) */
:root {
  --background: #FAFAF9;
  --surface: #FFFFFF;
  --border: #E7E5E4;
  --foreground: #0F172A;
  --foreground-muted: #64748B;
  --primary: #0D9488;
  /* ... rest of light theme */
}

/* Dark Theme */
[data-theme="dark"] {
  --background: #0A0A0A;
  --surface: #1A1A1A;
  --border: #2A2A2A;
  --foreground: #FFFFFF;
  --foreground-muted: #9CA3AF;
  --primary: #FCD34D;
  /* ... rest of dark theme */
}
```

#### **Step 2: Create Theme Provider**

```tsx
// src/contexts/ThemeContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) setTheme(saved);
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    
    let actualTheme: 'light' | 'dark' = 'light';
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      actualTheme = systemTheme;
    } else {
      actualTheme = theme;
    }
    
    root.setAttribute('data-theme', actualTheme);
    setResolvedTheme(actualTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', systemTheme);
      setResolvedTheme(systemTheme);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

#### **Step 3: Wrap App with Provider**

```tsx
// src/app/layout.tsx
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### **Step 4: Create Theme Toggle Component**

```tsx
// src/components/ThemeToggle.tsx
'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import clsx from 'clsx';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg">
      <button
        onClick={() => setTheme('light')}
        className={clsx(
          'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
          theme === 'light'
            ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
            : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
        )}
      >
        <Sun size={16} />
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={clsx(
          'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
          theme === 'dark'
            ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
            : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
        )}
      >
        <Moon size={16} />
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={clsx(
          'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
          theme === 'system'
            ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
            : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
        )}
      >
        <Monitor size={16} />
      </button>
    </div>
  );
}
```

#### **Step 5: Add to TopBar**

```tsx
// src/components/TopBar.tsx
import { ThemeToggle } from './ThemeToggle';

export default function TopBar() {
  return (
    <div className="flex items-center justify-between p-4">
      {/* ... existing content */}
      <ThemeToggle />
    </div>
  );
}
```

---

## 🎨 **Complete CSS Variables for Both Themes**

```css
/* src/app/globals.css */

/* Light Theme (Default) */
:root {
  /* Backgrounds */
  --background: #FAFAF9;
  --background-secondary: #F5F5F4;
  --background-tertiary: #F5F5F4;
  --background-elevated: #FFFFFF;
  
  /* Surfaces */
  --surface: #FFFFFF;
  
  /* Borders */
  --border: #E7E5E4;
  --border-light: #F5F5F4;
  --border-strong: #D6D3D1;
  
  /* Text */
  --foreground: #0F172A;
  --foreground-secondary: #334155;
  --foreground-muted: #64748B;
  --foreground-light: #94A3B8;
  
  /* Primary (Teal) */
  --primary: #0D9488;
  --primary-light: #14B8A6;
  --primary-lighter: #5EEAD4;
  --primary-lightest: #CCFBF1;
  --primary-dark: #0F766E;
  --primary-darker: #115E59;
  
  /* Accent (Amber) */
  --accent: #D97706;
  --accent-light: #F59E0B;
  --accent-lightest: #FEF3C7;
  
  /* Sidebar */
  --sidebar-bg: #FAFAF9;
  --sidebar-hover: #F5F5F4;
  --sidebar-active: #CCFBF1;
  
  /* Status */
  --success: #059669;
  --warning: #D97706;
  --error: #DC2626;
}

/* Dark Theme */
[data-theme="dark"] {
  /* Backgrounds */
  --background: #0A0A0A;
  --background-secondary: #1A1A1A;
  --background-tertiary: #1A1A1A;
  --background-elevated: #1A1A1A;
  
  /* Surfaces */
  --surface: #1A1A1A;
  
  /* Borders */
  --border: #2A2A2A;
  --border-light: #1A1A1A;
  --border-strong: #3A3A3A;
  
  /* Text */
  --foreground: #FFFFFF;
  --foreground-secondary: #E5E7EB;
  --foreground-muted: #9CA3AF;
  --foreground-light: #6B7280;
  
  /* Primary (Yellow) */
  --primary: #FCD34D;
  --primary-light: #FDE68A;
  --primary-lighter: #FEF3C7;
  --primary-lightest: #FFFBEB;
  --primary-dark: #F59E0B;
  --primary-darker: #D97706;
  
  /* Accent (Blue) */
  --accent: #3B82F6;
  --accent-light: #60A5FA;
  --accent-lightest: #DBEAFE;
  
  /* Sidebar */
  --sidebar-bg: #0A0A0A;
  --sidebar-hover: #1A1A1A;
  --sidebar-active: #2A2A2A;
  
  /* Status */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
}
```

---

## ✨ **Smooth Transitions**

Add this to `globals.css` for smooth theme switching:

```css
/* Smooth theme transitions */
html {
  transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
}

* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

---

## 🎯 **Approach 2: Tailwind's Dark Mode (Alternative)**

If you want to use Tailwind's built-in dark mode:

```typescript
// tailwind.config.ts
export default {
  darkMode: 'class', // or 'media'
  // ...
}
```

Then use:
```tsx
className="bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white"
```

**Pros:** Native Tailwind support  
**Cons:** Need to add `dark:` prefix everywhere (verbose)

---

## 📝 **Summary**

| Approach | Pros | Cons | Recommended? |
|----------|------|------|--------------|
| **CSS Variables** | Clean code, centralized, easy to maintain | Requires setup | ✅ YES |
| **Tailwind Dark Mode** | Native support, no context | Verbose (`dark:` everywhere) | ⚠️ OK |
| **Direct Values** | Simple, no abstraction | Hard to maintain, no theming | ❌ NO |

**✅ RECOMMENDED:** Use CSS Variables with `data-theme` attribute. It's cleaner, more maintainable, and works with your existing codebase structure.

---

**Last Updated:** 2026-04-09  
**Design System Version:** 2.0
