'use client';

import { useState, useMemo } from 'react';
import { Risk } from '@/lib/types/compliance';
import { Target, Building2, Briefcase, Database, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

interface RiskMappingProps {
  risks: Risk[];
}

type MappingDimension = 'departments' | 'functions' | 'assets' | 'strategies';

interface MappingItem {
  name: string;
  risks: Risk[];
  avgResidualScore: number;
  maxResidualScore: number;
  riskCount: number;
}

export default function RiskMapping({ risks }: RiskMappingProps) {
  const [selectedDimension, setSelectedDimension] = useState<MappingDimension>('departments');

  // Calculate risk mappings for each dimension
  const mappings = useMemo(() => {
    const departmentMap = new Map<string, Risk[]>();
    const functionMap = new Map<string, Risk[]>();
    const assetMap = new Map<string, Risk[]>();
    const strategyMap = new Map<string, Risk[]>();

    risks.forEach(risk => {
      // Map by department
      if (!departmentMap.has(risk.department)) {
        departmentMap.set(risk.department, []);
      }
      departmentMap.get(risk.department)!.push(risk);

      // Map by functions
      risk.functions?.forEach(func => {
        if (!functionMap.has(func)) {
          functionMap.set(func, []);
        }
        functionMap.get(func)!.push(risk);
      });

      // Map by assets
      risk.assets?.forEach(asset => {
        if (!assetMap.has(asset)) {
          assetMap.set(asset, []);
        }
        assetMap.get(asset)!.push(risk);
      });

      // Map by strategies
      risk.strategies?.forEach(strategy => {
        if (!strategyMap.has(strategy)) {
          strategyMap.set(strategy, []);
        }
        strategyMap.get(strategy)!.push(risk);
      });
    });

    const createMappingItems = (map: Map<string, Risk[]>): MappingItem[] => {
      return Array.from(map.entries()).map(([name, risks]) => {
        const avgResidualScore = risks.reduce((sum, r) => sum + r.residualScore, 0) / risks.length;
        const maxResidualScore = Math.max(...risks.map(r => r.residualScore));
        return {
          name,
          risks,
          avgResidualScore,
          maxResidualScore,
          riskCount: risks.length
        };
      }).sort((a, b) => b.avgResidualScore - a.avgResidualScore);
    };

    return {
      departments: createMappingItems(departmentMap),
      functions: createMappingItems(functionMap),
      assets: createMappingItems(assetMap),
      strategies: createMappingItems(strategyMap)
    };
  }, [risks]);

  const currentMapping = mappings[selectedDimension];

  // Get color based on risk score (0-25 scale)
  const getColorFromScore = (score: number): string => {
    // Score ranges: 0-2 (Low), 3-7 (Medium), 8-14 (High), 15-25 (Critical)
    if (score >= 15) return '#dc2626'; // Critical - red-600
    if (score >= 8) return '#ea580c';  // High - orange-600
    if (score >= 3) return '#d97706';  // Medium - amber-600
    return '#16a34a';                   // Low - green-600
  };

  const dimensions = [
    { key: 'departments' as MappingDimension, label: 'Departments', icon: Building2 },
    { key: 'functions' as MappingDimension, label: 'Functions', icon: Briefcase },
    { key: 'assets' as MappingDimension, label: 'Assets', icon: Database },
    { key: 'strategies' as MappingDimension, label: 'Strategies', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* Dimension Selector */}
      <div className="flex items-center gap-3">
        {dimensions.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSelectedDimension(key)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-p2 transition-all duration-200',
              selectedDimension === key
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'bg-white border border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
            )}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Risk Spectrum Visualization */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-h4 font-bold text-[var(--foreground)] mb-1">
              Risk Distribution by {dimensions.find(d => d.key === selectedDimension)?.label}
            </h3>
            <p className="text-p3 text-[var(--foreground-muted)]">
              Showing {currentMapping.length} {selectedDimension} with {risks.length} total risks mapped
            </p>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 text-p3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#16a34a' }}></div>
              <span className="text-[var(--foreground-muted)]">Low (1-2)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#d97706' }}></div>
              <span className="text-[var(--foreground-muted)]">Medium (3-7)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ea580c' }}></div>
              <span className="text-[var(--foreground-muted)]">High (8-14)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#dc2626' }}></div>
              <span className="text-[var(--foreground-muted)]">Critical (15-25)</span>
            </div>
          </div>
        </div>

        {/* Spectrum Bars */}
        <div className="space-y-4">
          {currentMapping.map((item, index) => {
            const avgColor = getColorFromScore(item.avgResidualScore);
            const maxColor = getColorFromScore(item.maxResidualScore);

            // Calculate position on spectrum (0-100%)
            const avgPosition = (item.avgResidualScore / 25) * 100;
            const maxPosition = (item.maxResidualScore / 25) * 100;

            return (
              <div key={item.name} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-p2 font-semibold text-[var(--foreground)] min-w-[200px]">
                      {item.name}
                    </span>
                    <span className="text-p3 text-[var(--foreground-muted)]">
                      {item.riskCount} {item.riskCount === 1 ? 'risk' : 'risks'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-p3">
                    <div className="text-right">
                      <span className="text-[var(--foreground-muted)]">Avg: </span>
                      <span className="font-semibold" style={{ color: avgColor }}>
                        {item.avgResidualScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[var(--foreground-muted)]">Max: </span>
                      <span className="font-semibold" style={{ color: maxColor }}>
                        {item.maxResidualScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Spectrum Bar */}
                <div className="relative h-12 rounded-lg overflow-hidden bg-gradient-to-r from-green-100 via-amber-100 via-orange-100 to-red-100 border border-[var(--border)]">
                  {/* Background gradient spectrum */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-amber-500/10 via-orange-500/10 to-red-500/10"></div>

                  {/* Risk markers */}
                  <div className="absolute inset-0 flex items-center">
                    {/* Individual risk dots */}
                    {item.risks.map((risk, riskIndex) => {
                      const position = (risk.residualScore / 25) * 100;
                      const color = getColorFromScore(risk.residualScore);

                      return (
                        <div
                          key={risk.id}
                          className="absolute transform -translate-x-1/2 group/dot"
                          style={{ left: `${position}%` }}
                        >
                          <div
                            className="w-3 h-3 rounded-full border-2 border-white shadow-md transition-all duration-200 group-hover/dot:scale-150 group-hover/dot:z-10"
                            style={{ backgroundColor: color }}
                            title={`${risk.code}: ${risk.title} (Score: ${risk.residualScore})`}
                          ></div>

                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/dot:block z-20">
                            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                              <div className="font-semibold">{risk.code}</div>
                              <div className="text-gray-300 max-w-xs truncate">{risk.title}</div>
                              <div className="text-gray-400">Score: {risk.residualScore}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Scale markers */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1 text-xs text-[var(--foreground-muted)]">
                    <span>0</span>
                    <span className="opacity-50">5</span>
                    <span className="opacity-50">10</span>
                    <span className="opacity-50">15</span>
                    <span className="opacity-50">20</span>
                    <span>25</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {currentMapping.length === 0 && (
          <div className="text-center py-12 text-[var(--foreground-muted)]">
            <Target size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-p2">No risks mapped to {selectedDimension}</p>
            <p className="text-p3 mt-1">Add mapping data to risks to see the distribution</p>
          </div>
        )}
      </div>
    </div>
  );
}

