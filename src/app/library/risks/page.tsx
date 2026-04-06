'use client';

import { useState, useRef } from 'react';
import {
  Search, AlertTriangle, Plus, ArrowUpRight, ArrowDownRight, Minus,
  Download, Upload, FileSpreadsheet, Sparkles, Link2, X, ChevronDown,
  Database, Bot, FileText, Zap, CheckCircle2, AlertCircle
} from 'lucide-react';
import clsx from 'clsx';
import PageHeader from '@/components/PageHeader';

interface Risk {
  id: string;
  title: string;
  category: string;
  inherentRisk: 'Critical' | 'High' | 'Medium' | 'Low';
  residualRisk: 'Critical' | 'High' | 'Medium' | 'Low';
  owner: string;
  status: 'Open' | 'Mitigating' | 'Closed';
  trend: 'up' | 'down' | 'stable';
  description?: string;
}

// Comprehensive risk library with more risks
const risks: Risk[] = [
  // Cybersecurity Risks
  { id: '1', title: 'Data breach through third-party vendors', category: 'Cybersecurity', inherentRisk: 'Critical', residualRisk: 'High', owner: 'John D.', status: 'Mitigating', trend: 'down', description: 'Third-party vendor systems compromised leading to customer data exposure' },
  { id: '2', title: 'Ransomware attack on critical systems', category: 'Cybersecurity', inherentRisk: 'Critical', residualRisk: 'Medium', owner: 'John D.', status: 'Mitigating', trend: 'down', description: 'Malicious encryption of business-critical systems and data' },
  { id: '3', title: 'Phishing attacks targeting employees', category: 'Cybersecurity', inherentRisk: 'High', residualRisk: 'Medium', owner: 'John D.', status: 'Open', trend: 'stable', description: 'Social engineering attacks compromising user credentials' },
  { id: '4', title: 'Insider threat - privileged access misuse', category: 'Cybersecurity', inherentRisk: 'High', residualRisk: 'Medium', owner: 'John D.', status: 'Mitigating', trend: 'down', description: 'Employees with elevated privileges accessing unauthorized data' },
  { id: '5', title: 'DDoS attack on public-facing services', category: 'Cybersecurity', inherentRisk: 'High', residualRisk: 'Low', owner: 'John D.', status: 'Closed', trend: 'down', description: 'Distributed denial of service disrupting customer access' },
  { id: '6', title: 'Unpatched critical vulnerabilities', category: 'Cybersecurity', inherentRisk: 'High', residualRisk: 'Medium', owner: 'John D.', status: 'Open', trend: 'up', description: 'Known vulnerabilities in production systems not remediated timely' },
  { id: '7', title: 'Weak authentication mechanisms', category: 'Cybersecurity', inherentRisk: 'Medium', residualRisk: 'Low', owner: 'John D.', status: 'Closed', trend: 'down', description: 'Inadequate multi-factor authentication implementation' },
  { id: '8', title: 'Cloud misconfiguration exposing data', category: 'Cybersecurity', inherentRisk: 'Critical', residualRisk: 'High', owner: 'John D.', status: 'Mitigating', trend: 'down', description: 'Improperly configured cloud storage buckets publicly accessible' },

  // Regulatory & Compliance Risks
  { id: '9', title: 'Non-compliance with AML regulations', category: 'Regulatory', inherentRisk: 'High', residualRisk: 'Medium', owner: 'Sarah M.', status: 'Open', trend: 'stable', description: 'Gaps in anti-money laundering monitoring and reporting' },
  { id: '10', title: 'GDPR data subject rights violations', category: 'Regulatory', inherentRisk: 'High', residualRisk: 'Medium', owner: 'Sarah M.', status: 'Mitigating', trend: 'down', description: 'Failure to respond to data subject access requests within timeframes' },
  { id: '11', title: 'Regulatory reporting delays', category: 'Regulatory', inherentRisk: 'Medium', residualRisk: 'Medium', owner: 'Mike R.', status: 'Open', trend: 'up', description: 'Late submission of mandatory regulatory reports' },
  { id: '12', title: 'Cross-border data transfer violations', category: 'Regulatory', inherentRisk: 'High', residualRisk: 'Medium', owner: 'Sarah M.', status: 'Open', trend: 'stable', description: 'International data transfers without adequate safeguards' },
  { id: '13', title: 'SOX control deficiencies', category: 'Regulatory', inherentRisk: 'High', residualRisk: 'Low', owner: 'Sarah M.', status: 'Closed', trend: 'down', description: 'Material weaknesses in financial reporting controls' },
  { id: '14', title: 'PCI DSS compliance gaps', category: 'Regulatory', inherentRisk: 'Critical', residualRisk: 'Medium', owner: 'Sarah M.', status: 'Mitigating', trend: 'down', description: 'Payment card data handling not meeting PCI standards' },

  // Privacy Risks
  { id: '15', title: 'Customer data protection inadequacies', category: 'Privacy', inherentRisk: 'Medium', residualRisk: 'Low', owner: 'Lisa P.', status: 'Closed', trend: 'down', description: 'Insufficient encryption and access controls for PII' },
  { id: '16', title: 'Consent management failures', category: 'Privacy', inherentRisk: 'High', residualRisk: 'Medium', owner: 'Lisa P.', status: 'Open', trend: 'stable', description: 'Processing personal data without valid user consent' },
  { id: '17', title: 'Data retention policy violations', category: 'Privacy', inherentRisk: 'Medium', residualRisk: 'Low', owner: 'Lisa P.', status: 'Mitigating', trend: 'down', description: 'Retaining personal data beyond defined retention periods' },

  // Operational Risks
  { id: '18', title: 'Insider trading detection gaps', category: 'Operational', inherentRisk: 'High', residualRisk: 'Medium', owner: 'Ahmed K.', status: 'Mitigating', trend: 'down', description: 'Inadequate monitoring of employee trading activities' },
  { id: '19', title: 'Business continuity plan inadequacy', category: 'Operational', inherentRisk: 'Critical', residualRisk: 'High', owner: 'Ahmed K.', status: 'Open', trend: 'stable', description: 'BCP/DR plans not tested or updated regularly' },
  { id: '20', title: 'Vendor lock-in and dependency', category: 'Operational', inherentRisk: 'High', residualRisk: 'High', owner: 'Ahmed K.', status: 'Open', trend: 'up', description: 'Over-reliance on single critical technology vendor' },
  { id: '21', title: 'Key person dependency', category: 'Operational', inherentRisk: 'Medium', residualRisk: 'Medium', owner: 'Ahmed K.', status: 'Open', trend: 'stable', description: 'Critical knowledge concentrated in few individuals' },
  { id: '22', title: 'Supply chain disruption', category: 'Operational', inherentRisk: 'High', residualRisk: 'Medium', owner: 'Ahmed K.', status: 'Mitigating', trend: 'down', description: 'Interruption in critical supplier operations' },

  // Financial Risks
  { id: '23', title: 'Fraud and financial misstatement', category: 'Financial', inherentRisk: 'High', residualRisk: 'Low', owner: 'Mike R.', status: 'Closed', trend: 'down', description: 'Intentional manipulation of financial records' },
  { id: '24', title: 'Budget overruns on critical projects', category: 'Financial', inherentRisk: 'Medium', residualRisk: 'Medium', owner: 'Mike R.', status: 'Open', trend: 'up', description: 'Project costs exceeding approved budgets' },
  { id: '25', title: 'Foreign exchange volatility', category: 'Financial', inherentRisk: 'Medium', residualRisk: 'Low', owner: 'Mike R.', status: 'Mitigating', trend: 'stable', description: 'Currency fluctuations impacting international operations' },

  // Strategic Risks
  { id: '26', title: 'Market disruption by competitors', category: 'Strategic', inherentRisk: 'High', residualRisk: 'High', owner: 'Executive Team', status: 'Open', trend: 'up', description: 'New market entrants with disruptive technology' },
  { id: '27', title: 'Reputational damage from incidents', category: 'Strategic', inherentRisk: 'Critical', residualRisk: 'High', owner: 'Executive Team', status: 'Open', trend: 'stable', description: 'Public incidents damaging brand and customer trust' },
  { id: '28', title: 'Merger and acquisition integration failure', category: 'Strategic', inherentRisk: 'High', residualRisk: 'Medium', owner: 'Executive Team', status: 'Mitigating', trend: 'down', description: 'Failed integration of acquired companies' },

  // Third-Party Risks
  { id: '29', title: 'Third-party security breach', category: 'Third-Party', inherentRisk: 'Critical', residualRisk: 'High', owner: 'John D.', status: 'Mitigating', trend: 'down', description: 'Security incident at vendor affecting our data' },
  { id: '30', title: 'Vendor service level failures', category: 'Third-Party', inherentRisk: 'Medium', residualRisk: 'Low', owner: 'Ahmed K.', status: 'Closed', trend: 'down', description: 'Vendors not meeting contracted SLAs' },
];

const riskColors = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
};

const statusColors = {
  Open: 'bg-blue-100 text-blue-700',
  Mitigating: 'bg-purple-100 text-purple-700',
  Closed: 'bg-gray-100 text-gray-600',
};

type ImportMethod = 'ai' | 'excel' | 'integration' | null;

export default function RisksLibrary() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importMethod, setImportMethod] = useState<ImportMethod>(null);
  const [showAddRisk, setShowAddRisk] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', ...Array.from(new Set(risks.map(r => r.category)))];

  const filteredRisks = risks.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || r.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement actual file parsing
      alert(`Uploading file: ${file.name}\nThis will parse Excel/CSV and import risks.`);
      setShowImportModal(false);
    }
  };

  const handleAIImport = () => {
    // TODO: Implement AI-based risk generation
    alert('AI Risk Generation:\n\n1. Analyze your compliance programs\n2. Review industry benchmarks\n3. Generate contextual risks\n4. Map to frameworks automatically');
    setShowImportModal(false);
  };

  const handleIntegration = (tool: string) => {
    // TODO: Implement integration with risk management tools
    alert(`Integration with ${tool}:\n\nConnect to:\n- Archer\n- ServiceNow GRC\n- LogicGate\n- MetricStream\n- Rsam`);
    setShowImportModal(false);
  };

  return (
    <div className="flex-1">
      <PageHeader
        title="Risk Library"
        description={`Comprehensive risk register with ${risks.length} risks across ${categories.length - 1} categories`}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database size={18} className="text-[var(--foreground-muted)]" />
            <span className="text-sm text-[var(--foreground-muted)]">Total Risks</span>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">{risks.length}</p>
        </div>
        {(['Critical', 'High', 'Medium', 'Low'] as const).map((level) => (
          <div key={level} className={clsx("p-4 rounded-xl border", riskColors[level])}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} />
              <span className="text-sm font-medium">{level}</span>
            </div>
            <p className="text-2xl font-bold">{risks.filter(r => r.inherentRisk === level).length}</p>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <input
              type="text"
              placeholder="Search risks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 text-sm border border-cyan-600 text-cyan-600 rounded-lg hover:bg-cyan-50 flex items-center gap-2 transition-colors"
          >
            <Download size={16} />
            Import Risks
          </button>
          <button
            onClick={() => setShowAddRisk(true)}
            className="px-4 py-2 text-sm bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg flex items-center gap-2 transition-all"
          >
            <Plus size={16} />
            Add Risk
          </button>
        </div>
      </div>

      {/* Risks Table */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid gap-4 px-5 py-3 bg-[var(--background-secondary)] border-b border-[var(--border)] text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider"
          style={{ gridTemplateColumns: '3fr 1.5fr 1fr 1fr 80px 1fr 1fr' }}
        >
          <div>Risk</div>
          <div>Category</div>
          <div>Inherent</div>
          <div>Residual</div>
          <div className="text-center">Trend</div>
          <div>Status</div>
          <div>Owner</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[var(--border)]">
        {filteredRisks.map((risk) => (
          <div
            key={risk.id}
            className="grid gap-4 px-5 py-4 hover:bg-[var(--background-secondary)] transition-colors cursor-pointer"
            style={{ gridTemplateColumns: '3fr 1.5fr 1fr 1fr 80px 1fr 1fr' }}
          >
            <div>
              <div className="text-sm font-medium text-[var(--foreground)]">{risk.title}</div>
              {risk.description && (
                <p className="text-xs text-[var(--foreground-muted)] mt-1 line-clamp-1">{risk.description}</p>
              )}
            </div>
            <div className="text-sm text-[var(--foreground-muted)] flex items-center">{risk.category}</div>
            <div className="flex items-center">
              <span className={clsx("text-xs px-2 py-1 rounded-full font-medium border whitespace-nowrap", riskColors[risk.inherentRisk])}>{risk.inherentRisk}</span>
            </div>
            <div className="flex items-center">
              <span className={clsx("text-xs px-2 py-1 rounded-full font-medium border whitespace-nowrap", riskColors[risk.residualRisk])}>{risk.residualRisk}</span>
            </div>
            <div className="flex items-center justify-center">
              {risk.trend === 'up' && <ArrowUpRight size={18} className="text-red-500" />}
              {risk.trend === 'down' && <ArrowDownRight size={18} className="text-green-500" />}
              {risk.trend === 'stable' && <Minus size={18} className="text-gray-400" />}
            </div>
            <div className="flex items-center">
              <span className={clsx("text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap", statusColors[risk.status])}>{risk.status}</span>
            </div>
            <div className="text-sm text-[var(--foreground-muted)] flex items-center">{risk.owner}</div>
          </div>
        ))}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--background)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-[var(--background)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">Import Risks</h2>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">Choose your import method</p>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportMethod(null);
                }}
                className="p-2 hover:bg-[var(--background-secondary)] rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {!importMethod ? (
                <div className="grid grid-cols-3 gap-4">
                  {/* AI-Powered Import */}
                  <button
                    onClick={() => setImportMethod('ai')}
                    className="group p-6 border-2 border-[var(--border)] rounded-xl hover:border-cyan-500 hover:shadow-lg transition-all text-left"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Sparkles className="text-white" size={24} />
                    </div>
                    <h3 className="font-bold text-[var(--foreground)] mb-2">AI-Powered Generation</h3>
                    <p className="text-sm text-[var(--foreground-muted)] mb-4">
                      Generate contextual risks based on your compliance programs and industry benchmarks
                    </p>
                    <div className="flex items-center gap-2 text-xs text-cyan-600 font-medium">
                      <Zap size={14} />
                      Smart & Fast
                    </div>
                  </button>

                  {/* Excel/CSV Import */}
                  <button
                    onClick={() => setImportMethod('excel')}
                    className="group p-6 border-2 border-[var(--border)] rounded-xl hover:border-cyan-500 hover:shadow-lg transition-all text-left"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FileSpreadsheet className="text-white" size={24} />
                    </div>
                    <h3 className="font-bold text-[var(--foreground)] mb-2">Excel / CSV Upload</h3>
                    <p className="text-sm text-[var(--foreground-muted)] mb-4">
                      Import risks from spreadsheets with automatic field mapping
                    </p>
                    <div className="flex items-center gap-2 text-xs text-cyan-600 font-medium">
                      <Upload size={14} />
                      Bulk Import
                    </div>
                  </button>

                  {/* Integration */}
                  <button
                    onClick={() => setImportMethod('integration')}
                    className="group p-6 border-2 border-[var(--border)] rounded-xl hover:border-cyan-500 hover:shadow-lg transition-all text-left"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Link2 className="text-white" size={24} />
                    </div>
                    <h3 className="font-bold text-[var(--foreground)] mb-2">System Integration</h3>
                    <p className="text-sm text-[var(--foreground-muted)] mb-4">
                      Connect with existing risk management platforms
                    </p>
                    <div className="flex items-center gap-2 text-xs text-cyan-600 font-medium">
                      <CheckCircle2 size={14} />
                      Live Sync
                    </div>
                  </button>
                </div>
              ) : importMethod === 'ai' ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Bot className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">AI Risk Generation</h3>
                        <p className="text-sm text-gray-700 mb-4">
                          Our AI will analyze your compliance programs, requirements, and controls to generate relevant risks.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                            <span>Analyze existing compliance frameworks (SOC 2, ISO 27001, GDPR, etc.)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                            <span>Review industry-specific risk benchmarks and threat intelligence</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                            <span>Map risks to controls and requirements automatically</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                            <span>Generate risk statements with inherent and residual assessments</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Select Frameworks to Analyze
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['SOC 2 Type II', 'ISO 27001', 'GDPR', 'HIPAA', 'PCI DSS', 'NIST CSF'].map(fw => (
                          <label key={fw} className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-cyan-600 rounded" defaultChecked />
                            <span className="text-sm text-[var(--foreground)]">{fw}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Industry Focus
                      </label>
                      <select className="w-full px-4 py-2 border border-[var(--border)] rounded-lg">
                        <option>Financial Services</option>
                        <option>Healthcare</option>
                        <option>Technology</option>
                        <option>Retail</option>
                        <option>Manufacturing</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setImportMethod(null)}
                      className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--background-secondary)] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleAIImport}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={18} />
                      Generate Risks with AI
                    </button>
                  </div>
                </div>
              ) : importMethod === 'excel' ? (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-cyan-500 hover:bg-cyan-50/50 transition-all cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="text-white" size={32} />
                    </div>
                    <h3 className="font-bold text-[var(--foreground)] mb-2">Drop your Excel or CSV file here</h3>
                    <p className="text-sm text-[var(--foreground-muted)] mb-4">or click to browse</p>
                    <p className="text-xs text-[var(--foreground-muted)]">Supported formats: .xlsx, .xls, .csv (Max 10MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Expected File Format</h4>
                        <p className="text-sm text-blue-800 mb-3">Your spreadsheet should include these columns:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} />
                            <span>Risk Title (required)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} />
                            <span>Category</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} />
                            <span>Description</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} />
                            <span>Inherent Risk Level</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} />
                            <span>Residual Risk Level</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} />
                            <span>Risk Owner</span>
                          </div>
                        </div>
                        <button className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                          <Download size={12} />
                          Download Template
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setImportMethod(null)}
                      className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--background-secondary)] transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Available Integrations</h3>
                    <p className="text-sm text-gray-700 mb-6">
                      Connect with your existing risk management platform for seamless data synchronization
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Archer', desc: 'RSA Archer GRC Platform', icon: '🎯' },
                      { name: 'ServiceNow GRC', desc: 'Integrated Risk Management', icon: '⚡' },
                      { name: 'LogicGate', desc: 'Risk Cloud Platform', icon: '🔷' },
                      { name: 'MetricStream', desc: 'GRC & Risk Management', icon: '📊' },
                      { name: 'Rsam', desc: 'Enterprise GRC Solution', icon: '🛡️' },
                      { name: 'OneTrust', desc: 'Risk & Compliance', icon: '🔐' },
                    ].map(tool => (
                      <button
                        key={tool.name}
                        onClick={() => handleIntegration(tool.name)}
                        className="p-4 border-2 border-[var(--border)] rounded-xl hover:border-cyan-500 hover:shadow-lg transition-all text-left group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{tool.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[var(--foreground)] group-hover:text-cyan-600 transition-colors">
                              {tool.name}
                            </h4>
                            <p className="text-xs text-[var(--foreground-muted)]">{tool.desc}</p>
                          </div>
                        </div>
                        <div className="text-xs text-cyan-600 font-medium flex items-center gap-1">
                          <Link2 size={12} />
                          Connect
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setImportMethod(null)}
                      className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--background-secondary)] transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

