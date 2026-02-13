'use client';

import { useState } from 'react';
import { TrendingUp, Shield, FileText, Maximize2, Minimize2 } from 'lucide-react';

interface ComplianceArea {
  name: string;
  coverage: number;
  color: string;
  requirements: number;
  controls: number;
}

interface ComplianceAreaCoverage3DProps {
  areas: ComplianceArea[];
}

export function ComplianceAreaCoverage3D({ areas }: ComplianceAreaCoverage3DProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Calculate total for percentages
  const total = areas.reduce((sum, area) => sum + area.coverage, 0);

  // Calculate angles for pie slices
  let currentAngle = -90; // Start from top
  const slices = areas.map((area, index) => {
    const percentage = (area.coverage / total) * 100;
    const angle = (area.coverage / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    return {
      ...area,
      percentage,
      startAngle,
      endAngle,
      index
    };
  });

  // Get selected or hovered area
  const activeArea = selectedIndex !== null
    ? areas[selectedIndex]
    : hoveredIndex !== null
    ? areas[hoveredIndex]
    : null;

  return (
    <div className={`bg-white rounded-xl border border-[var(--border)] overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
        <div>
          <h3 className="text-h4 font-bold text-[var(--foreground)]">Compliance Area Coverage</h3>
          <p className="text-p3 text-[var(--foreground-muted)] mt-1">Interactive breakdown of coverage across compliance areas</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 size={18} className="text-[var(--foreground-muted)]" />
            ) : (
              <Maximize2 size={18} className="text-[var(--foreground-muted)]" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`grid ${isFullscreen ? 'grid-cols-2' : 'lg:grid-cols-2'} gap-8 p-8`}>
        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          <div className="relative" style={{ width: '320px', height: '320px' }}>
            <svg viewBox="0 0 200 200" className="transform -rotate-90">
              {slices.map((slice, index) => {
                const isHovered = hoveredIndex === index;
                const isSelected = selectedIndex === index;
                const isActive = isHovered || isSelected;

                // Calculate path for pie slice
                const startAngleRad = (slice.startAngle * Math.PI) / 180;
                const endAngleRad = (slice.endAngle * Math.PI) / 180;
                const radius = isActive ? 95 : 90;
                const innerRadius = 0;

                const x1 = 100 + radius * Math.cos(startAngleRad);
                const y1 = 100 + radius * Math.sin(startAngleRad);
                const x2 = 100 + radius * Math.cos(endAngleRad);
                const y2 = 100 + radius * Math.sin(endAngleRad);

                const largeArc = slice.endAngle - slice.startAngle > 180 ? 1 : 0;

                const pathData = [
                  `M 100 100`,
                  `L ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                  `Z`
                ].join(' ');

                return (
                  <g key={index}>
                    {/* Shadow */}
                    {isActive && (
                      <path
                        d={pathData}
                        fill="rgba(0,0,0,0.1)"
                        transform="translate(2, 2)"
                      />
                    )}
                    {/* Slice */}
                    <path
                      d={pathData}
                      fill={slice.color}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-300"
                      style={{
                        filter: isActive ? 'brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                        opacity: hoveredIndex !== null && !isActive ? 0.6 : 1
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                    />
                  </g>
                );
              })}

              {/* Center circle for donut effect */}
              <circle cx="100" cy="100" r="50" fill="white" />

              {/* Center text */}
              <text
                x="100"
                y="95"
                textAnchor="middle"
                className="text-2xl font-bold fill-[var(--foreground)]"
                transform="rotate(90 100 100)"
              >
                {activeArea ? `${activeArea.coverage}%` : `${Math.round(areas.reduce((sum, a) => sum + a.coverage, 0) / areas.length)}%`}
              </text>
              <text
                x="100"
                y="110"
                textAnchor="middle"
                className="text-xs fill-[var(--foreground-muted)]"
                transform="rotate(90 100 100)"
              >
                {activeArea ? activeArea.name : 'Avg Coverage'}
              </text>
            </svg>
          </div>
        </div>

        {/* Stats & Legend */}
        <div className="flex flex-col justify-center space-y-4">
          {/* Active Area Details */}
          {activeArea && (
            <div className="mb-4 p-4 bg-gradient-to-br from-[var(--primary-lightest)] to-white rounded-xl border border-[var(--primary)]/20">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activeArea.color }}
                />
                <h4 className="text-h5 font-bold text-[var(--foreground)]">{activeArea.name}</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-[var(--foreground-muted)] mb-1">Coverage</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-[var(--primary)]">{activeArea.coverage}%</p>
                    <TrendingUp size={16} className="text-emerald-600" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--foreground-muted)] mb-1">Requirements</p>
                  <div className="flex items-center gap-1">
                    <FileText size={14} className="text-[var(--foreground-muted)]" />
                    <p className="text-xl font-semibold text-[var(--foreground)]">{activeArea.requirements}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--foreground-muted)] mb-1">Controls</p>
                  <div className="flex items-center gap-1">
                    <Shield size={14} className="text-[var(--foreground-muted)]" />
                    <p className="text-xl font-semibold text-[var(--foreground)]">{activeArea.controls}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Areas List */}
          <div className="space-y-2">
            {slices.map((slice, index) => (
              <button
                key={index}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  hoveredIndex === index || selectedIndex === index
                    ? 'bg-[var(--background-secondary)] shadow-sm'
                    : 'hover:bg-[var(--background-secondary)]/50'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-p3 font-medium text-[var(--foreground)] truncate">{slice.name}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {slice.requirements} req • {slice.controls} ctrl
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: slice.color }}>{slice.coverage}%</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{slice.percentage.toFixed(1)}% of total</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

