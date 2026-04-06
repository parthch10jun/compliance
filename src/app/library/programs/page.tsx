'use client';

import { useState, useMemo } from 'react';
import {
  Search, Grid3X3, List, Download, ChevronRight, BookOpen,
  Star, Users, Calendar, Shield, FileText, Tag, Eye,
  Building2, Globe, ArrowUpRight, Filter, X, MapPin, Briefcase, Target,
  CheckCircle2, Package, Layers, ChevronDown, ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { programTemplates } from '@/lib/data/program-library';
import { PageHeader, SearchFilterBar } from '@/components';
import { ProgramTemplate } from '@/lib/types/compliance';
import soc2Framework from '@/lib/data/soc2-framework';
import rbiITGovernance from '@/lib/data/rbi-it-governance';
import dpdpITFramework from '@/lib/data/dpdp-act-2023';
import oilGasStandards from '@/lib/data/oil-gas-standards';
import iso27001Framework from '@/lib/data/iso27001-framework';
import npciTpap from '@/lib/data/npci-tpap';
import { soc1Requirements } from '@/lib/data/soc1-requirements';
import { soc1Controls } from '@/lib/data/soc1-controls';
import { iso27701Requirements } from '@/lib/data/iso27701-requirements';
import { iso27701Controls } from '@/lib/data/iso27701-controls';
import { cbuaeRequirements, cbuaeControls } from '@/lib/data/cbuae-comprehensive';

type ViewMode = 'authorities' | 'programs';

// Authority metadata
const AUTHORITY_METADATA: Record<string, any> = {
  'CBUAE': {
    name: 'CBUAE',
    fullName: 'Central Bank of UAE',
    description: 'Banking and financial services regulation for the United Arab Emirates',
    type: 'Regulator',
    country: 'UAE',
    icon: '🏦',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-50'
  },
  'RBI': {
    name: 'RBI',
    fullName: 'Reserve Bank of India',
    description: 'Central banking and financial regulation for India',
    type: 'Regulator',
    country: 'India',
    icon: '🏛️',
    color: 'from-orange-500 to-red-600',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-50'
  },
  'ISO': {
    name: 'ISO',
    fullName: 'International Organization for Standardization',
    description: 'International standards for quality, security, and management systems',
    type: 'Standards Body',
    country: 'International',
    icon: '🌐',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50'
  },
  'AICPA': {
    name: 'AICPA',
    fullName: 'American Institute of CPAs',
    description: 'Professional standards for audit and assurance services',
    type: 'Standards Body',
    country: 'USA',
    icon: '📊',
    color: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-500',
    bgColor: 'bg-violet-50'
  },
  'NIST': {
    name: 'NIST',
    fullName: 'National Institute of Standards and Technology',
    description: 'US government cybersecurity and technology standards',
    type: 'Standards Body',
    country: 'USA',
    icon: '🇺🇸',
    color: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-600',
    bgColor: 'bg-blue-50'
  },
  'NPCI': {
    name: 'NPCI',
    fullName: 'National Payments Corporation of India',
    description: 'Digital payments infrastructure and UPI governance',
    type: 'Regulator',
    country: 'India',
    icon: '💳',
    color: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-500',
    bgColor: 'bg-pink-50'
  },
  'SEBI': {
    name: 'SEBI',
    fullName: 'Securities and Exchange Board of India',
    description: 'Capital markets and listed entity regulation in India',
    type: 'Regulator',
    country: 'India',
    icon: '📈',
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500',
    bgColor: 'bg-cyan-50'
  },
  'MCA': {
    name: 'MCA',
    fullName: 'Ministry of Corporate Affairs (India)',
    description: 'Corporate governance and companies law in India',
    type: 'Regulator',
    country: 'India',
    icon: '🏢',
    color: 'from-indigo-500 to-violet-600',
    borderColor: 'border-indigo-500',
    bgColor: 'bg-indigo-50'
  },
  'SEC': {
    name: 'SEC',
    fullName: 'Securities and Exchange Commission (USA)',
    description: 'US securities regulation and SOX compliance',
    type: 'Regulator',
    country: 'USA',
    icon: '🏛️',
    color: 'from-slate-600 to-gray-700',
    borderColor: 'border-slate-600',
    bgColor: 'bg-slate-50'
  },
  'OSHA': {
    name: 'OSHA',
    fullName: 'Occupational Safety and Health Administration',
    description: 'Workplace safety standards for oil & gas industry',
    type: 'Regulator',
    country: 'USA',
    icon: '⚠️',
    color: 'from-yellow-500 to-orange-600',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-50'
  },
};

const categories = ['All', 'Regulatory', 'Standard', 'Framework', 'Industry'];

// Extract unique filters from templates
const getAllCountries = () => {
  const countries = new Set<string>();
  programTemplates.forEach(t => {
    t.applicableTo.forEach(item => {
      // Common countries/regions
      const countryKeywords = ['UAE', 'India', 'USA', 'International', 'UK', 'EU', 'Singapore', 'Australia', 'Canada'];
      if (countryKeywords.some(c => item.includes(c))) {
        countries.add(item);
      }
    });
    // Also check tags for country/region info
    t.tags.forEach(tag => {
      const countryKeywords = ['UAE', 'India', 'USA', 'International', 'UK', 'EU', 'Singapore', 'Australia', 'Canada'];
      if (countryKeywords.some(c => tag.includes(c))) {
        countries.add(tag);
      }
    });
  });
  return ['All', ...Array.from(countries).sort()];
};

const getAllIndustries = () => {
  const industries = new Set<string>();
  programTemplates.forEach(t => {
    t.applicableTo.forEach(item => {
      // Common industries
      const industryKeywords = ['Banking', 'Financial', 'FinTech', 'Oil & Gas', 'Healthcare', 'Technology', 'Service', 'Payment', 'Insurance', 'NBFC', 'All Industries'];
      if (industryKeywords.some(i => item.includes(i))) {
        industries.add(item);
      }
    });
  });
  return ['All', ...Array.from(industries).sort()];
};

const getAllDomains = () => {
  const domains = new Set<string>();
  programTemplates.forEach(t => {
    t.tags.forEach(tag => {
      // Domain/topic keywords
      const domainKeywords = ['Cyber Security', 'Privacy', 'Data Protection', 'Governance', 'Risk', 'Compliance', 'Quality', 'Information Security', 'IT', 'Financial Controls', 'Audit', 'Open Banking', 'Payments'];
      if (domainKeywords.some(d => tag.includes(d))) {
        domains.add(tag);
      }
    });
  });
  return ['All', ...Array.from(domains).sort()];
};

export default function ProgramLibraryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [country, setCountry] = useState('All');
  const [industry, setIndustry] = useState('All');
  const [domain, setDomain] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('authorities');
  const [gridMode, setGridMode] = useState<'grid' | 'list'>('grid');
  const [selectedAuthority, setSelectedAuthority] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedAuthorities, setExpandedAuthorities] = useState<Set<string>>(new Set());

  // Hierarchical drill-down states
  const [expandedTemplates, setExpandedTemplates] = useState<Set<string>>(new Set());
  const [expandedRequirements, setExpandedRequirements] = useState<Set<string>>(new Set());

  const countries = getAllCountries();
  const industries = getAllIndustries();
  const domains = getAllDomains();

  // Toggle authority expansion
  const toggleAuthority = (authorityId: string) => {
    const newExpanded = new Set(expandedAuthorities);
    if (newExpanded.has(authorityId)) {
      newExpanded.delete(authorityId);
    } else {
      newExpanded.add(authorityId);
    }
    setExpandedAuthorities(newExpanded);
  };

  // Toggle template expansion (show/hide requirements)
  const toggleTemplate = (templateId: string) => {
    const newExpanded = new Set(expandedTemplates);
    if (newExpanded.has(templateId)) {
      newExpanded.delete(templateId);
    } else {
      newExpanded.add(templateId);
    }
    setExpandedTemplates(newExpanded);
  };

  // Toggle requirement expansion (show/hide controls)
  const toggleRequirement = (requirementId: string) => {
    const newExpanded = new Set(expandedRequirements);
    if (newExpanded.has(requirementId)) {
      newExpanded.delete(requirementId);
    } else {
      newExpanded.add(requirementId);
    }
    setExpandedRequirements(newExpanded);
  };

  // Get requirements for a specific template
  const getTemplateRequirements = (templateId: string) => {
    // First check if it's a CBUAE template
    if (templateId.startsWith('tpl-cbuae-')) {
      return cbuaeRequirements.filter((r: any) => r.programId === templateId) || [];
    }

    // Map template IDs to their requirement datasets
    const requirementMap: Record<string, any[]> = {
      // SOC frameworks
      'tpl-soc2-type2': soc2Framework.requirements || [],
      'tpl-soc1-type2': soc1Requirements || [],

      // RBI frameworks
      'tpl-rbi-itgov-2023': rbiITGovernance.requirements || [],

      // India frameworks
      'tpl-dpdp-2023': dpdpITFramework.requirements || [],

      // ISO standards
      'tpl-iso27001': iso27001Framework.requirements || [],
      'tpl-iso27701': iso27701Requirements || [],

      // Oil & Gas standards
      'tpl-osha-2024': oilGasStandards.requirements?.filter((r: any) => r.programId === 'tpl-osha-2024') || [],
      'tpl-epa-2024': oilGasStandards.requirements?.filter((r: any) => r.programId === 'tpl-epa-2024') || [],
      'tpl-iso9001-2015': oilGasStandards.requirements?.filter((r: any) => r.programId === 'tpl-iso9001-2015') || [],

      // NPCI
      'tpl-npci-tpap': npciTpap.requirements || [],
    };
    return requirementMap[templateId] || [];
  };

  // Get controls for a specific requirement
  const getRequirementControls = (templateId: string, requirementId: string) => {
    // First check if it's a CBUAE template
    if (templateId.startsWith('tpl-cbuae-')) {
      return cbuaeControls.filter((c: any) =>
        c.programId === templateId && c.linkedRequirementIds?.includes(requirementId)
      ) || [];
    }

    // Map template IDs to their control datasets
    const controlMap: Record<string, any[]> = {
      // SOC frameworks
      'tpl-soc2-type2': soc2Framework.controls || [],
      'tpl-soc1-type2': soc1Controls || [],

      // India frameworks
      'tpl-dpdp-2023': dpdpITFramework.controls || [],

      // ISO standards
      'tpl-iso27001': iso27001Framework.controls || [],
      'tpl-iso27701': iso27701Controls || [],

      // Oil & Gas standards
      'tpl-osha-2024': oilGasStandards.controls?.filter((c: any) => c.linkedProgramIds?.includes('tpl-osha-2024')) || [],
      'tpl-epa-2024': oilGasStandards.controls?.filter((c: any) => c.linkedProgramIds?.includes('tpl-epa-2024')) || [],
      'tpl-iso9001-2015': oilGasStandards.controls?.filter((c: any) => c.linkedProgramIds?.includes('tpl-iso9001-2015')) || [],

      // NPCI
      'tpl-npci-tpap': npciTpap.controls || [],

      // RBI - no controls yet
      'tpl-rbi-itgov-2023': [],
    };

    const templateControls = controlMap[templateId] || [];

    // Filter controls that are linked to this requirement
    return templateControls.filter(control =>
      control.linkedRequirementIds?.includes(requirementId)
    );
  };

  // Group templates by authority
  const authorityGroups = useMemo(() => {
    const groups = new Map<string, any>();

    programTemplates.forEach(template => {
      // Identify primary authority from tags or publisher
      const authorityTag = template.tags.find(t =>
        Object.keys(AUTHORITY_METADATA).includes(t)
      );

      const authority = authorityTag || template.publisher.split(' ')[0] || 'Other';

      if (!groups.has(authority)) {
        const metadata = AUTHORITY_METADATA[authority] || {
          name: authority,
          fullName: template.publisher,
          description: `${template.publisher} frameworks and standards`,
          type: template.category === 'Regulatory' ? 'Regulator' : 'Standards Body',
          country: template.applicableTo[0] || 'International',
          icon: '📋',
          color: 'from-gray-500 to-slate-600',
          borderColor: 'border-gray-500',
          bgColor: 'bg-gray-50'
        };

        groups.set(authority, {
          id: authority,
          ...metadata,
          templates: [],
          totalRequirements: 0,
          totalObligations: 0,
          totalControls: 0
        });
      }

      const group = groups.get(authority)!;
      group.templates.push(template);
      group.totalRequirements += template.requirementCount;
      group.totalObligations += template.obligationCount;
      group.totalControls += template.controlCount;
    });

    return Array.from(groups.values()).sort((a, b) =>
      b.templates.length - a.templates.length
    );
  }, []);

  // Filter authorities or templates based on view mode
  const filteredAuthorityGroups = useMemo(() => {
    return authorityGroups.filter(group => {
      const matchesSearch =
        group.name.toLowerCase().includes(search.toLowerCase()) ||
        group.fullName.toLowerCase().includes(search.toLowerCase()) ||
        group.description.toLowerCase().includes(search.toLowerCase()) ||
        group.templates.some((t: any) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
        );

      const matchesCountry = country === 'All' || group.country.includes(country);

      return matchesSearch && matchesCountry;
    });
  }, [authorityGroups, search, country]);

  const filteredTemplates = useMemo(() => {
    const templates = selectedAuthority
      ? authorityGroups.find(g => g.id === selectedAuthority)?.templates || []
      : programTemplates;

    return templates.filter((t: any) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === 'All' || t.category === category;

      const matchesCountry = country === 'All' ||
        t.applicableTo.some((item: string) => item.includes(country)) ||
        t.tags.some((tag: string) => tag.includes(country));

      const matchesIndustry = industry === 'All' ||
        t.applicableTo.some((item: string) => item.includes(industry));

      const matchesDomain = domain === 'All' ||
        t.tags.some((tag: string) => tag.includes(domain));

      return matchesSearch && matchesCategory && matchesCountry && matchesIndustry && matchesDomain;
    });
  }, [selectedAuthority, authorityGroups, search, category, country, industry, domain]);

  const selectedProgram = selectedTemplate 
    ? programTemplates.find(t => t.id === selectedTemplate) 
    : null;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Regulatory': return 'bg-rose-500/10 text-rose-600 border-rose-200';
      case 'Standard': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'Framework': return 'bg-violet-500/10 text-violet-600 border-violet-200';
      case 'Industry': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* Main Content */}
      <div className={clsx(
        "flex flex-col transition-all duration-300 ease-out",
        selectedTemplate ? "flex-[0_0_58%]" : "flex-1"
      )}>
        <PageHeader
          data-tour="library-header"
          title="Program Library"
          description="Browse by authority or explore individual frameworks"
        />

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Primary Filters Row */}
          <div className="flex items-center gap-4" data-tour="library-filters">
            {/* View Mode Toggle */}
            <div className="flex gap-1 p-1 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
              <button
                onClick={() => {
                  setViewMode('authorities');
                  setSelectedAuthority(null);
                  setSelectedTemplate(null);
                  setExpandedAuthorities(new Set());
                }}
                className={clsx(
                  'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-all font-medium',
                  viewMode === 'authorities'
                    ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                )}
              >
                <Layers size={16} />
                Authorities
              </button>
              <button
                onClick={() => {
                  setViewMode('programs');
                  setSelectedAuthority(null);
                  setSelectedTemplate(null);
                  setExpandedAuthorities(new Set());
                }}
                className={clsx(
                  'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-all font-medium',
                  viewMode === 'programs'
                    ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                )}
              >
                <Package size={16} />
                All Programs
              </button>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <input
                type="text"
                placeholder={viewMode === 'authorities' ? 'Search authorities...' : 'Search programs...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-tour="library-search"
                className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50"
              />
            </div>

            {viewMode === 'programs' && (
              <div className="flex gap-1 p-1 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={clsx(
                      'px-3 py-1.5 text-sm rounded-md transition-all font-medium',
                      category === cat
                        ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                        : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all',
                showFilters || country !== 'All' || industry !== 'All' || domain !== 'All'
                  ? 'bg-cyan-50 border-cyan-500 text-cyan-700'
                  : 'border-[var(--border)] text-[var(--foreground-muted)] hover:border-cyan-300'
              )}
            >
              <Filter size={16} />
              <span className="text-sm font-medium">Filters</span>
              {(country !== 'All' || industry !== 'All' || domain !== 'All') && (
                <span className="bg-cyan-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {[country, industry, domain].filter(f => f !== 'All').length}
                </span>
              )}
            </button>
            <div className="flex gap-1 p-1 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
              <button
                onClick={() => setGridMode('grid')}
                className={clsx('p-2 rounded-md', gridMode === 'grid' ? 'bg-[var(--background)] shadow-sm' : 'text-[var(--foreground-muted)]')}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setGridMode('list')}
                className={clsx('p-2 rounded-md', gridMode === 'list' ? 'bg-[var(--background)] shadow-sm' : 'text-[var(--foreground-muted)]')}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-5 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Filter size={16} className="text-cyan-600" />
                  Advanced Filters
                </h3>
                <button
                  onClick={() => {
                    setCountry('All');
                    setIndustry('All');
                    setDomain('All');
                  }}
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
                >
                  <X size={14} />
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Country Filter */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                    <MapPin size={14} className="text-cyan-600" />
                    Country / Region
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-cyan-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  >
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Industry Filter */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                    <Briefcase size={14} className="text-violet-600" />
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-violet-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  >
                    {industries.map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>

                {/* Domain Filter */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                    <Target size={14} className="text-emerald-600" />
                    Domain / Topic
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {domains.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(country !== 'All' || industry !== 'All' || domain !== 'All') && (
                <div className="mt-4 pt-4 border-t border-cyan-200">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-600 font-medium">Active:</span>
                    {country !== 'All' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-md">
                        <MapPin size={12} />
                        {country}
                        <button onClick={() => setCountry('All')} className="hover:text-cyan-900">
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {industry !== 'All' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-md">
                        <Briefcase size={12} />
                        {industry}
                        <button onClick={() => setIndustry('All')} className="hover:text-violet-900">
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {domain !== 'All' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-md">
                        <Target size={12} />
                        {domain}
                        <button onClick={() => setDomain('All')} className="hover:text-emerald-900">
                          <X size={12} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)]">
            <span>
              {viewMode === 'authorities' ? (
                <>
                  Showing <span className="font-semibold text-[var(--foreground)]">{filteredAuthorityGroups.length}</span> authorities
                </>
              ) : (
                <>
                  Showing <span className="font-semibold text-[var(--foreground)]">{filteredTemplates.length}</span> of {programTemplates.length} programs
                </>
              )}
            </span>
            {selectedAuthority && (
              <button
                onClick={() => setSelectedAuthority(null)}
                className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-medium"
              >
                <X size={14} />
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Authority Grid - When in authorities view mode */}
        {viewMode === 'authorities' && !selectedAuthority && (
          <div className="flex-1 overflow-auto pr-2">
            <div className={clsx(
              gridMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4'
                : 'flex flex-col gap-3 pb-4'
            )}>
              {filteredAuthorityGroups.map((authority) => {
                const isExpanded = expandedAuthorities.has(authority.id);
                return (
                <div
                  key={authority.id}
                  className="bg-[var(--background)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-cyan-500/50"
                >
                  {/* Authority Header - Clickable */}
                  <div
                    onClick={() => {
                      // In grid mode: navigate to authority view
                      // In list mode: toggle expansion
                      if (gridMode === 'grid') {
                        setSelectedAuthority(authority.id);
                      } else {
                        toggleAuthority(authority.id);
                      }
                    }}
                    className="group p-6 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`text-3xl`}>
                          {authority.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-[var(--foreground)] group-hover:text-cyan-600 transition-colors">
                            {authority.name}
                          </h3>
                          <p className="text-xs text-[var(--foreground-muted)]">{authority.fullName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {gridMode === 'grid' ? (
                          <ChevronRight className="text-[var(--foreground-muted)] group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" size={20} />
                        ) : isExpanded ? (
                          <ChevronUp className="text-cyan-600" size={20} />
                        ) : (
                          <ChevronDown className="text-[var(--foreground-muted)] group-hover:text-cyan-600 transition-all" size={20} />
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[var(--foreground-muted)] mb-4 line-clamp-2">
                      {authority.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 mb-4 text-xs">
                      <span className={`px-2 py-1 rounded-full ${authority.bgColor} text-gray-700 font-medium`}>
                        {authority.type}
                      </span>
                      <span className="flex items-center gap-1 text-[var(--foreground-muted)]">
                        <Globe size={12} />
                        {authority.country}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--border)]">
                      <div>
                        <div className="text-xs text-[var(--foreground-muted)] mb-1">Programs</div>
                        <div className="text-lg font-bold text-[var(--foreground)]">{authority.templates.length}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[var(--foreground-muted)] mb-1">Requirements</div>
                        <div className="text-lg font-bold text-cyan-600">{authority.totalRequirements}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[var(--foreground-muted)] mb-1">Controls</div>
                        <div className="text-lg font-bold text-blue-600">{authority.totalControls}</div>
                      </div>
                    </div>

                    {/* Import All Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement import all for authority
                        alert(`Import all ${authority.templates.length} programs from ${authority.name}`);
                      }}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Download size={16} />
                      Import All Programs
                    </button>
                  </div>

                  {/* Expanded Programs List - Only in list mode */}
                  {isExpanded && gridMode === 'list' && (
                    <div className="border-t border-[var(--border)] bg-[var(--background-secondary)] animate-in slide-in-from-top-2 duration-200">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-[var(--foreground)]">
                            {authority.templates.length} Program{authority.templates.length !== 1 ? 's' : ''}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Import all ${authority.templates.length} programs`);
                            }}
                            className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
                          >
                            <Download size={14} />
                            Import All
                          </button>
                        </div>
                        <div className="space-y-2">
                          {authority.templates.map((template: any) => (
                            <div
                              key={template.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTemplate(template.id);
                              }}
                              className="group/program bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 cursor-pointer hover:border-cyan-500/50 hover:shadow-sm transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Shield size={14} className="text-cyan-600" />
                                    <h5 className="text-sm font-medium text-[var(--foreground)] group-hover/program:text-cyan-600 transition-colors">
                                      {template.name}
                                    </h5>
                                  </div>
                                  <p className="text-xs text-[var(--foreground-muted)] line-clamp-1 mb-2">
                                    {template.description}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-[var(--foreground-muted)]">
                                    <span className="flex items-center gap-1">
                                      <FileText size={12} />
                                      {template.requirementCount} Req
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Shield size={12} />
                                      {template.controlCount} Ctrl
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(template.category)}`}>
                                      {template.category}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert(`Import ${template.name}`);
                                  }}
                                  className="ml-3 px-3 py-1.5 bg-cyan-600 text-white text-xs rounded-md hover:bg-cyan-700 transition-colors opacity-0 group-hover/program:opacity-100"
                                >
                                  Import
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
              })}
            </div>
          </div>
        )}

        {/* Template Grid - When in programs view mode OR when authority is selected */}
        {(viewMode === 'programs' || selectedAuthority) && (
          <div className="flex-1 overflow-auto pr-2">
            {selectedAuthority && (
              <div className="mb-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{authorityGroups.find(g => g.id === selectedAuthority)?.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {authorityGroups.find(g => g.id === selectedAuthority)?.fullName}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {filteredTemplates.length} programs available
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // TODO: Implement import all for this authority
                      alert(`Import all programs from ${selectedAuthority}`);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors"
                  >
                    <Download size={16} />
                    Import All
                  </button>
                </div>
              </div>
            )}
            <div className={clsx(
              gridMode === 'grid'
                ? 'grid gap-4 pb-4'
                : 'flex flex-col gap-3 pb-4',
              gridMode === 'grid' && !selectedTemplate && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
              gridMode === 'grid' && selectedTemplate && 'grid-cols-1 lg:grid-cols-2'
            )}>
              {filteredTemplates.map((template: ProgramTemplate) => {
              const isSelected = selectedTemplate === template.id;
              const isSoc2 = template.id === 'tpl-soc2-type2';
              const isExpanded = expandedTemplates.has(template.id);
              const requirements = getTemplateRequirements(template.id);

              return (
              <div
                key={template.id}
                data-tour={isSoc2 ? 'soc2-template-card' : undefined}
                className={clsx(
                  'group bg-[var(--background)] border rounded-xl overflow-hidden transition-all duration-200',
                  isSelected
                    ? 'border-cyan-500/50 shadow-md'
                    : 'border-[var(--border)] hover:shadow-md hover:border-cyan-500/30'
                )}
              >
                {/* Template Header */}
                <div
                  onClick={() => setSelectedTemplate(template.id)}
                  className="p-5 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                        <Shield size={20} className="text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)] group-hover:text-cyan-600 transition-colors">
                          {template.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                          <span>{template.publisher}</span>
                          <span>•</span>
                          <span>v{template.version}</span>
                        </div>
                      </div>
                    </div>
                    <span className={clsx('px-2 py-1 text-xs font-medium rounded-full border', getCategoryColor(template.category))}>
                      {template.category}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--foreground-muted)] mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)] mb-4">
                    <span className="flex items-center gap-1">
                      <FileText size={14} />
                      {template.requirementCount} Requirements
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield size={14} />
                      {template.controlCount} Controls
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {template.popularity} imports
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {template.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded-md">
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-xs bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded-md">
                        +{template.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTemplate(template.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-cyan-600 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp size={14} />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} />
                        View {requirements.length} Requirements
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Requirements & Controls */}
                {isExpanded && requirements.length > 0 && (
                  <div className="border-t border-[var(--border)] bg-[var(--background-secondary)] animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                      {requirements.map((req: any) => {
                        const reqExpanded = expandedRequirements.has(req.id);
                        const reqControls = getRequirementControls(template.id, req.id);

                        return (
                          <div key={req.id} className="bg-[var(--background)] border border-[var(--border)] rounded-lg overflow-hidden">
                            {/* Requirement Header */}
                            <div
                              onClick={() => toggleRequirement(req.id)}
                              className="p-3 cursor-pointer hover:bg-[var(--background-secondary)] transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <FileText size={14} className="text-cyan-600 flex-shrink-0" />
                                    <span className="text-xs font-mono text-[var(--foreground-muted)]">{req.code}</span>
                                    <span className="text-xs font-semibold text-[var(--foreground)]">
                                      {req.title}
                                    </span>
                                  </div>
                                  <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 ml-6">
                                    {req.description}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                    {reqControls.length} controls
                                  </span>
                                  {reqExpanded ? (
                                    <ChevronUp size={16} className="text-[var(--foreground-muted)]" />
                                  ) : (
                                    <ChevronDown size={16} className="text-[var(--foreground-muted)]" />
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Expanded Controls */}
                            {reqExpanded && reqControls.length > 0 && (
                              <div className="border-t border-[var(--border)] bg-[var(--background-secondary)] animate-in slide-in-from-top-2 duration-200">
                                <div className="p-3 space-y-2">
                                  {reqControls.map((control: any) => (
                                    <div key={control.id} className="bg-[var(--background)] border border-[var(--border)] rounded p-2.5">
                                      <div className="flex items-start gap-2">
                                        <Shield size={12} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-[var(--foreground-muted)]">{control.code}</span>
                                            <span className="text-xs font-medium text-[var(--foreground)]">{control.name}</span>
                                          </div>
                                          <p className="text-xs text-[var(--foreground-muted)] line-clamp-1">
                                            {control.description}
                                          </p>
                                          <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-xs px-1.5 py-0.5 rounded bg-violet-50 text-violet-700">
                                              {control.type}
                                            </span>
                                            <span className="text-xs px-1.5 py-0.5 rounded bg-slate-50 text-slate-700">
                                              {control.frequency}
                                            </span>
                                            <span className="text-xs text-[var(--foreground-muted)]">
                                              Owner: {control.owner}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
            })}
          </div>
        </div>
        )}
      </div>

      {/* Preview Panel */}
      {selectedProgram && (
        <div className="flex-[0_0_40%] bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Template Preview</h2>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="p-2 hover:bg-[var(--background-secondary)] rounded-lg text-[var(--foreground-muted)]"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-auto space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Shield size={28} className="text-cyan-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">{selectedProgram.name}</h3>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">
                  {selectedProgram.publisher} • Version {selectedProgram.version}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">Description</h4>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                {selectedProgram.longDescription || selectedProgram.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[var(--background-secondary)] rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-600">{selectedProgram.requirementCount}</div>
                <div className="text-xs text-[var(--foreground-muted)]">Requirements</div>
              </div>
              <div className="bg-[var(--background-secondary)] rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-emerald-600">{selectedProgram.obligationCount}</div>
                <div className="text-xs text-[var(--foreground-muted)]">Obligations</div>
              </div>
              <div className="bg-[var(--background-secondary)] rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedProgram.controlCount}</div>
                <div className="text-xs text-[var(--foreground-muted)]">Controls</div>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Key Features</h4>
              <ul className="space-y-2">
                {selectedProgram.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[var(--foreground-muted)]">
                    <ChevronRight size={16} className="text-cyan-500 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Applicable To */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Applicable To</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProgram.applicableTo.map((item, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded-full border border-[var(--border)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Authority Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProgram.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs bg-cyan-500/10 text-cyan-600 rounded-full border border-cyan-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--foreground-muted)]">Last Updated</span>
                <p className="font-medium text-[var(--foreground)]">{selectedProgram.lastUpdated}</p>
              </div>
              <div>
                <span className="text-[var(--foreground-muted)]">Times Imported</span>
                <p className="font-medium text-[var(--foreground)]">{selectedProgram.popularity}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[var(--border)] mt-4 flex gap-3">
            <button
              data-tour="import-soc2-button"
              className="flex-1 px-4 py-2.5 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Import to My Programs
            </button>
            <Link
              href={`/library/programs/${selectedProgram.id}`}
              data-tour="view-soc2-detail"
              className="px-4 py-2.5 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--background-secondary)] transition-colors flex items-center gap-2"
            >
              <Eye size={18} />
              Full View
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
