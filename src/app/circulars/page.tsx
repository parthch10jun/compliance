'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components';
import { circulars, Circular, ComplianceAction } from '@/lib/data/circulars';
import {
  FileText,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Building2,
  ChevronRight,
  Upload,
  Sparkles,
  Filter,
  Search,
  ExternalLink,
  CalendarPlus,
  ListTodo,
  ArrowRight
} from 'lucide-react';

// Priority badge component
const PriorityBadge = ({ priority }: { priority: ComplianceAction['priority'] }) => {
  const styles = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200'
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${styles[priority]}`}>
      {priority}
    </span>
  );
};

// Issuer badge component
const IssuerBadge = ({ issuer }: { issuer: Circular['issuer'] }) => {
  const styles = {
    MCA: 'bg-blue-600',
    SEBI: 'bg-purple-600',
    RBI: 'bg-teal-600',
    NSE: 'bg-indigo-600',
    BSE: 'bg-pink-600'
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold text-white rounded ${styles[issuer]}`}>
      {issuer}
    </span>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: ComplianceAction['status'] }) => {
  const styles = {
    Pending: 'bg-gray-100 text-gray-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    Overdue: 'bg-red-100 text-red-700'
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[status]}`}>
      {status}
    </span>
  );
};

// Format date helper
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Days until deadline
const getDaysUntil = (dateStr: string) => {
  const now = new Date();
  const deadline = new Date(dateStr);
  const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

export default function CircularsPage() {
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(circulars[0]);
  const [selectedAction, setSelectedAction] = useState<ComplianceAction | null>(null);
  const [filterIssuer, setFilterIssuer] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCirculars = circulars.filter(c => {
    if (filterIssuer !== 'all' && c.issuer !== filterIssuer) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Regulatory Circulars"
        description="AI-powered compliance action extraction from regulatory notifications"
        breadcrumbs={[
          { label: 'Regulatory Intelligence', href: '/regulatory-intelligence' },
          { label: 'Circulars' }
        ]}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{circulars.length}</p>
              <p className="text-xs text-gray-500">Active Circulars</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <ListTodo className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {circulars.reduce((acc, c) => acc + c.extractedActions.filter(a => a.status === 'Pending').length, 0)}
              </p>
              <p className="text-xs text-gray-500">Pending Actions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {circulars.reduce((acc, c) => acc + c.extractedActions.filter(a => a.priority === 'Critical').length, 0)}
              </p>
              <p className="text-xs text-gray-500">Critical Items</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(circulars.reduce((acc, c) => acc + c.aiConfidenceScore, 0) / circulars.length)}%
              </p>
              <p className="text-xs text-gray-500">AI Confidence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-xl border border-indigo-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Upload className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upload New Circular</h3>
              <p className="text-sm text-gray-600">Drop a regulatory circular PDF to automatically extract compliance actions with AI</p>
            </div>
          </div>
          <Link
            href="/circulars/upload"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Upload className="w-4 h-4" />
            Upload Circular
          </Link>
        </div>
      </div>

      {/* Main Content - Three Pane Layout */}
      <div className="flex gap-4 h-[calc(100vh-380px)] min-h-[500px]">
        {/* Left Pane - Circulars List */}
        <div className="w-1/3 bg-white rounded-xl border flex flex-col">
          {/* Search & Filter */}
          <div className="p-3 border-b space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search circulars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-1">
              {['all', 'MCA', 'SEBI', 'RBI'].map((issuer) => (
                <button
                  key={issuer}
                  onClick={() => setFilterIssuer(issuer)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    filterIssuer === issuer
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {issuer === 'all' ? 'All' : issuer}
                </button>
              ))}
            </div>
          </div>

          {/* Circulars List */}
          <div className="flex-1 overflow-y-auto">
            {filteredCirculars.map((circular) => (
              <div
                key={circular.id}
                onClick={() => {
                  setSelectedCircular(circular);
                setSelectedAction(null);
              }}
              className={`p-4 border-b cursor-pointer transition-colors ${
                selectedCircular?.id === circular.id
                  ? 'bg-indigo-50 border-l-4 border-l-indigo-500'
                  : 'hover:bg-gray-50 border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                <IssuerBadge issuer={circular.issuer} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{circular.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{circular.circularNumber}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(circular.issueDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <ListTodo className="w-3 h-3" />
                      {circular.extractedActions.length} actions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Middle Pane - Extracted Actions */}
        <div className="w-1/3 bg-white rounded-xl border flex flex-col">
          {selectedCircular ? (
            <>
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-semibold text-gray-900">AI-Extracted Compliance Actions</h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedCircular.extractedActions.length} actions • {selectedCircular.aiConfidenceScore}% confidence
                </p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {selectedCircular.extractedActions.map((action, index) => {
                  const daysUntil = getDaysUntil(action.deadline);
                  return (
                    <div
                    key={action.id}
                    onClick={() => setSelectedAction(action)}
                    className={`p-3 border-b cursor-pointer transition-colors ${
                      selectedAction?.id === action.id
                        ? 'bg-purple-50 border-l-4 border-l-purple-500'
                        : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{action.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <PriorityBadge priority={action.priority} />
                          <span className={`text-xs flex items-center gap-1 ${
                            daysUntil <= 7 ? 'text-red-600 font-medium' : 'text-gray-500'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {daysUntil > 0 ? `${daysUntil} days` : 'Overdue'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              Select a circular to view actions
            </div>
          )}
        </div>

        {/* Right Pane - Action Details */}
        <div className="w-1/3 bg-white rounded-xl border flex flex-col">
          {selectedAction ? (
            <>
              <div className="p-4 border-b bg-purple-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Action Details</h3>
                  <StatusBadge status={selectedAction.status} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                <h4 className="text-lg font-semibold text-gray-900">{selectedAction.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{selectedAction.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Deadline</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(selectedAction.deadline)}</p>
                  <p className={`text-xs mt-1 ${getDaysUntil(selectedAction.deadline) <= 7 ? 'text-red-600' : 'text-gray-500'}`}>
                    {getDaysUntil(selectedAction.deadline)} days remaining
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Priority</p>
                  <div className="mt-1">
                    <PriorityBadge priority={selectedAction.priority} />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Reference Section</p>
                <p className="text-sm font-medium text-gray-900">{selectedAction.section}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Applicable To</p>
                <div className="flex flex-wrap gap-1">
                  {selectedAction.applicableTo.map((entity) => (
                    <span key={entity} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                      {entity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t space-y-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                  <CalendarPlus className="w-4 h-4" />
                  Add to Compliance Calendar
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  <ListTodo className="w-4 h-4" />
                  Create Task
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  <ExternalLink className="w-4 h-4" />
                  View Related Requirement
                </button>
              </div>
            </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm p-6">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>
              <p>Select an action to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

