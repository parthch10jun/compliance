'use client';

import { useState } from 'react';
import { Search, Loader2, User, MoreVertical } from 'lucide-react';
import clsx from 'clsx';

// Vendor type
interface Vendor {
  id: string;
  name: string;
  status: 'Assessing' | 'Creating' | 'Active' | 'Pending';
  category: 'CLOUD' | 'SAAS' | 'OTHER' | 'SECURITY';
  owner: string | null;
  icon: 'aws' | 'azure' | 'gcp' | 'auth0' | 'cursor' | 'default';
}

// Mock data
const vendors: Vendor[] = [
  { id: '1', name: 'Amazon Web Services, Inc.', status: 'Assessing', category: 'CLOUD', owner: null, icon: 'aws' },
  { id: '2', name: 'Amazon Web Services, Inc.', status: 'Creating', category: 'OTHER', owner: null, icon: 'aws' },
  { id: '3', name: 'Auth0', status: 'Assessing', category: 'SAAS', owner: null, icon: 'auth0' },
  { id: '4', name: 'Auth0', status: 'Creating', category: 'OTHER', owner: null, icon: 'auth0' },
  { id: '5', name: 'Cursor', status: 'Assessing', category: 'SAAS', owner: null, icon: 'cursor' },
  { id: '6', name: 'Cursor', status: 'Creating', category: 'OTHER', owner: null, icon: 'cursor' },
  { id: '7', name: 'Google Cloud', status: 'Assessing', category: 'CLOUD', owner: null, icon: 'gcp' },
  { id: '8', name: 'Google Cloud', status: 'Creating', category: 'OTHER', owner: null, icon: 'gcp' },
  { id: '9', name: 'Microsoft 365', status: 'Assessing', category: 'SAAS', owner: null, icon: 'default' },
  { id: '10', name: 'Microsoft 365', status: 'Creating', category: 'OTHER', owner: null, icon: 'default' },
  { id: '11', name: 'Microsoft Azure', status: 'Assessing', category: 'CLOUD', owner: null, icon: 'azure' },
  { id: '12', name: 'Microsoft Azure', status: 'Creating', category: 'OTHER', owner: null, icon: 'azure' },
];

// Icon component
function VendorIcon({ icon, name }: { icon: string; name: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    aws: <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-bold">A</div>,
    azure: <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-bold">A</div>,
    gcp: <div className="w-5 h-5 rounded bg-red-500 flex items-center justify-center text-white text-xs font-bold">G</div>,
    auth0: <div className="w-5 h-5 rounded bg-black border border-gray-700 flex items-center justify-center text-white text-xs font-bold">A</div>,
    cursor: <div className="w-5 h-5 rounded bg-purple-500 flex items-center justify-center text-white text-xs font-bold">C</div>,
    default: <div className="w-5 h-5 rounded bg-gray-700 flex items-center justify-center text-white text-xs font-bold">{name[0]}</div>,
  };

  return iconMap[icon] || iconMap.default;
}

// Badge component
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide bg-gray-800 text-gray-400 border border-gray-700">
      {children}
    </span>
  );
}

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [isResearching, setIsResearching] = useState(true);

  // Filter vendors
  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Vendors</h1>
        <button className="px-4 py-2 bg-[#FCD34D] text-black rounded-lg font-medium hover:bg-[#FCD34D]/90 transition-colors">
          + Add Vendor
        </button>
      </div>

      {/* Research Banner */}
      {isResearching && (
        <div className="mb-6 p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-[#FCD34D] animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#FCD34D]">Researching and creating vendors</p>
            <p className="text-xs text-gray-500">AI is analyzing your organization...</p>
          </div>
          <button 
            onClick={() => setIsResearching(false)}
            className="ml-auto text-gray-500 hover:text-gray-300"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/20 focus:border-[#FCD34D]/50 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0A0A0A]">
            <tr className="border-b border-[#2A2A2A]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-r border-[#2A2A2A]">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-r border-[#2A2A2A]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-r border-[#2A2A2A]">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-r border-[#2A2A2A]">
                Owner
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor) => (
              <tr
                key={vendor.id}
                onMouseEnter={() => setHoveredRow(vendor.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={clsx(
                  'border-b border-[#2A2A2A] transition-colors cursor-pointer',
                  hoveredRow === vendor.id ? 'bg-[#1A1A1A]/50' : ''
                )}
              >
                {/* Name Column */}
                <td className="px-4 py-3.5 border-r border-[#2A2A2A]">
                  <div className="flex items-center gap-3">
                    <VendorIcon icon={vendor.icon} name={vendor.name} />
                    <span className="text-sm font-medium text-white">{vendor.name}</span>
                  </div>
                </td>

                {/* Status Column */}
                <td className="px-4 py-3.5 border-r border-[#2A2A2A]">
                  <div className="flex items-center gap-2 text-gray-400">
                    {(vendor.status === 'Assessing' || vendor.status === 'Creating') && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    <span className="text-sm">{vendor.status}...</span>
                  </div>
                </td>

                {/* Category Column */}
                <td className="px-4 py-3.5 border-r border-[#2A2A2A]">
                  <Badge>{vendor.category}</Badge>
                </td>

                {/* Owner Column */}
                <td className="px-4 py-3.5 border-r border-[#2A2A2A]">
                  <div className="flex items-center gap-2 text-gray-400">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{vendor.owner || 'None'}</span>
                  </div>
                </td>

                {/* Actions Column */}
                <td className="px-4 py-3.5">
                  <button className="p-1.5 hover:bg-[#2A2A2A] rounded transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[#2A2A2A] flex items-center justify-between text-xs text-gray-500">
          <span>Rows per page: 25</span>
          <div className="flex items-center gap-4">
            <span>1-{filteredVendors.length} of {filteredVendors.length}</span>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-[#2A2A2A] rounded disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                ‹
              </button>
              <button className="p-1 hover:bg-[#2A2A2A] rounded disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
