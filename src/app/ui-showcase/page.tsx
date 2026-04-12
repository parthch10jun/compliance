'use client';

import { useState } from 'react';
import { Search, Command } from 'lucide-react';
import { DualSidebar } from '@/components/DualSidebar';

export default function UIShowcasePage() {
  const [showDualNav, setShowDualNav] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Show Dual Sidebar Demo */}
      {showDualNav && <DualSidebar />}

      <div className={showDualNav ? "ml-72" : "ml-0"}>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">UI Showcase</h1>
            <p className="text-gray-500">Demonstrating the beautiful, polished UI patterns</p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-6">
            {/* Command Palette */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">⌘K Command Palette</h2>
                <p className="text-sm text-gray-500">Press ⌘K (or Ctrl+K) to open the command palette with blurred backdrop</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#2A2A2A]">
                  <p className="text-xs font-mono text-gray-400 mb-2">Features:</p>
                  <ul className="text-sm space-y-2 text-gray-300">
                    <li>✓ Keyboard shortcut (⌘K)</li>
                    <li>✓ Blurred backdrop (backdrop-blur-sm)</li>
                    <li>✓ Dark theme (#1A1A1A)</li>
                    <li>✓ Search all pages</li>
                    <li>✓ Grouped navigation</li>
                    <li>✓ ESC to close</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
                    document.dispatchEvent(event);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg hover:bg-[#3A3A3A] transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-400" />
                  <span className="flex-1 text-left text-gray-400">Search...</span>
                  <kbd className="px-2 py-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-xs text-gray-400 font-mono">
                    ⌘K
                  </kbd>
                </button>
              </div>
            </div>

            {/* Dual Sidebar */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Dual Sidebar Navigation</h2>
                <p className="text-sm text-gray-500">Icon-only left sidebar that opens detailed right sidebar</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#2A2A2A]">
                  <p className="text-xs font-mono text-gray-400 mb-2">Features:</p>
                  <ul className="text-sm space-y-2 text-gray-300">
                    <li>✓ Left: Icon-only modules (64px)</li>
                    <li>✓ Right: Detailed pages (224px)</li>
                    <li>✓ Smooth slide-in animation</li>
                    <li>✓ Active state highlighting</li>
                    <li>✓ Collapsible design</li>
                    <li>✓ Color-coded modules</li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowDualNav(!showDualNav)}
                  className="w-full px-4 py-3 bg-[#FCD34D] text-black rounded-lg font-medium hover:bg-[#FCD34D]/90 transition-colors"
                >
                  {showDualNav ? 'Hide' : 'Show'} Dual Sidebar Demo
                </button>
              </div>
            </div>

            {/* Dark Table */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Polished Data Tables</h2>
                <p className="text-sm text-gray-500">Beautiful tables with hover states and subtle borders</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#0A0A0A] rounded-lg border border-[#2A2A2A]">
                  <p className="text-xs font-mono text-gray-400 mb-2">Features:</p>
                  <ul className="text-sm space-y-2 text-gray-300">
                    <li>✓ Subtle row separators (#2A2A2A)</li>
                    <li>✓ Hover effects (bg-surface/50)</li>
                    <li>✓ Status badges with colors</li>
                    <li>✓ Loading spinners</li>
                    <li>✓ Icon integration</li>
                    <li>✓ Pagination footer</li>
                  </ul>
                </div>

                <a
                  href="/vendors"
                  className="block w-full px-4 py-3 bg-[#2A2A2A] border border-[#3A3A3A] text-center rounded-lg hover:bg-[#3A3A3A] transition-colors"
                >
                  View Vendors Table Example →
                </a>
              </div>
            </div>

            {/* Color Palette */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Dark Theme Palette</h2>
                <p className="text-sm text-gray-500">Consistent, professional color scheme</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: '#0A0A0A' }}></div>
                  <div className="flex-1">
                    <p className="text-sm font-mono">#0A0A0A</p>
                    <p className="text-xs text-gray-500">Background</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}></div>
                  <div className="flex-1">
                    <p className="text-sm font-mono">#1A1A1A</p>
                    <p className="text-xs text-gray-500">Surface</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: '#2A2A2A' }}></div>
                  <div className="flex-1">
                    <p className="text-sm font-mono">#2A2A2A</p>
                    <p className="text-xs text-gray-500">Border</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: '#FCD34D' }}></div>
                  <div className="flex-1">
                    <p className="text-sm font-mono">#FCD34D</p>
                    <p className="text-xs text-gray-500">Accent Yellow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
