'use client';

import { useState } from 'react';
import { Search, Package, Plus, Server, Database, Cloud, HardDrive, Laptop } from 'lucide-react';
import clsx from 'clsx';

interface Asset {
  id: string;
  name: string;
  type: 'Server' | 'Database' | 'Application' | 'Cloud Service' | 'Endpoint';
  owner: string;
  classification: 'Critical' | 'High' | 'Medium' | 'Low';
  location: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
}

const assets: Asset[] = [
  { id: '1', name: 'Production Database Server', type: 'Server', owner: 'IT Operations', classification: 'Critical', location: 'Data Center A', status: 'Active' },
  { id: '2', name: 'Customer Data Repository', type: 'Database', owner: 'Data Team', classification: 'Critical', location: 'AWS US-East', status: 'Active' },
  { id: '3', name: 'Compliance Management System', type: 'Application', owner: 'Compliance', classification: 'High', location: 'Azure Cloud', status: 'Active' },
  { id: '4', name: 'Email Service (Office 365)', type: 'Cloud Service', owner: 'IT Operations', classification: 'High', location: 'Microsoft Cloud', status: 'Active' },
  { id: '5', name: 'Executive Laptops', type: 'Endpoint', owner: 'IT Security', classification: 'High', location: 'Distributed', status: 'Active' },
  { id: '6', name: 'Backup Storage System', type: 'Server', owner: 'IT Operations', classification: 'Medium', location: 'Data Center B', status: 'Active' },
  { id: '7', name: 'Development Database', type: 'Database', owner: 'Engineering', classification: 'Medium', location: 'AWS US-West', status: 'Active' },
  { id: '8', name: 'Legacy CRM System', type: 'Application', owner: 'Sales', classification: 'Low', location: 'On-Premise', status: 'Maintenance' },
];

const classificationColors = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
};

const statusColors = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-600',
  Maintenance: 'bg-yellow-100 text-yellow-700',
};

const typeIcons = {
  Server: Server,
  Database: Database,
  Application: Package,
  'Cloud Service': Cloud,
  Endpoint: Laptop,
};

export default function AssetsLibrary() {
  const [search, setSearch] = useState('');

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.type.toLowerCase().includes(search.toLowerCase()) ||
    a.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h2 font-bold text-[var(--foreground)] mb-2">Asset Library</h1>
          <p className="text-p2 text-[var(--foreground-muted)]">Manage and track organizational assets</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors">
          <Plus size={18} />
          <span className="text-p2 font-medium">Add Asset</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" size={18} />
          <input
            type="text"
            placeholder="Search assets by name, type, or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[var(--border)] rounded-lg text-p2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-p3 text-[var(--foreground-muted)] mb-1">Total Assets</div>
          <div className="text-h3 font-bold text-[var(--foreground)]">{assets.length}</div>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-p3 text-[var(--foreground-muted)] mb-1">Critical</div>
          <div className="text-h3 font-bold text-red-600">{assets.filter(a => a.classification === 'Critical').length}</div>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-p3 text-[var(--foreground-muted)] mb-1">Active</div>
          <div className="text-h3 font-bold text-green-600">{assets.filter(a => a.status === 'Active').length}</div>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-p3 text-[var(--foreground-muted)] mb-1">In Maintenance</div>
          <div className="text-h3 font-bold text-yellow-600">{assets.filter(a => a.status === 'Maintenance').length}</div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
            <tr>
              <th className="text-left px-4 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Asset</th>
              <th className="text-left px-4 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Owner</th>
              <th className="text-left px-4 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Classification</th>
              <th className="text-left px-4 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Location</th>
              <th className="text-left px-4 py-3 text-p3 font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredAssets.map((asset) => {
              const Icon = typeIcons[asset.type];
              return (
                <tr key={asset.id} className="hover:bg-[var(--background-secondary)] transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[var(--primary-lightest)] rounded-lg flex items-center justify-center">
                        <Icon size={16} className="text-[var(--primary)]" />
                      </div>
                      <span className="text-p2 font-medium text-[var(--foreground)]">{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-p2 text-[var(--foreground-muted)]">{asset.type}</td>
                  <td className="px-4 py-3 text-p2 text-[var(--foreground-muted)]">{asset.owner}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('px-2 py-1 rounded-md text-p3 font-medium border', classificationColors[asset.classification])}>
                      {asset.classification}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-p2 text-[var(--foreground-muted)]">{asset.location}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('px-2 py-1 rounded-md text-p3 font-medium', statusColors[asset.status])}>
                      {asset.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

