'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Plus, Users, Check, X } from 'lucide-react';
import clsx from 'clsx';
import { defaultRoles, type UserRole } from '@/lib/data/workflow';

export default function RolesPage() {
  const router = useRouter();

  const getLevelColor = (level: UserRole['level']) => {
    switch (level) {
      case 'Executive': return 'bg-purple-100 text-purple-700';
      case 'Management': return 'bg-blue-100 text-blue-700';
      case 'Operational': return 'bg-green-100 text-green-700';
      case 'Viewer': return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Roles & Permissions</h1>
          </div>
          <button 
            onClick={() => router.push('/erm/roles/new')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={18} />
            Create Role
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          Manage user roles and configure access privileges
        </p>
      </div>

      {/* Summary */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Roles</div>
            <div className="text-2xl font-bold">{defaultRoles.length}</div>
          </div>
          <div>
            <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Users</div>
            <div className="text-2xl font-bold">{defaultRoles.reduce((sum, r) => sum + r.users.length, 0)}</div>
          </div>
          <div>
            <div className="text-sm text-[var(--foreground-muted)] mb-1">Active Roles</div>
            <div className="text-2xl font-bold">{defaultRoles.length}</div>
          </div>
          <div>
            <div className="text-sm text-[var(--foreground-muted)] mb-1">With Approval Rights</div>
            <div className="text-2xl font-bold">{defaultRoles.filter(r => r.privileges.approve).length}</div>
          </div>
        </div>
      </div>

      {/* Roles Table */}
      <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">System Roles</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Level</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground)]">Users</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--foreground)]">View</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--foreground)]">Create</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--foreground)]">Update</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--foreground)]">Delete</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--foreground)]">Override</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--foreground)]">Approve</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--foreground)]">Assign Tasks</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--foreground)]">Configure WF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {defaultRoles.map(role => (
                <tr 
                  key={role.id}
                  onClick={() => router.push(`/erm/roles/${role.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[var(--foreground)]">{role.name}</div>
                    <div className="text-xs text-[var(--foreground-muted)] mt-1">{role.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx('px-2 py-1 text-xs font-medium rounded', getLevelColor(role.level))}>
                      {role.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Users size={14} className="text-[var(--foreground-muted)]" />
                      {role.users.length}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {role.privileges.view ? (
                      <Check size={18} className="inline text-green-600" />
                    ) : (
                      <X size={18} className="inline text-red-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {role.privileges.create ? (
                      <Check size={18} className="inline text-green-600" />
                    ) : (
                      <X size={18} className="inline text-red-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {role.privileges.update ? (
                      <Check size={18} className="inline text-green-600" />
                    ) : (
                      <X size={18} className="inline text-red-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {role.privileges.delete ? (
                      <Check size={18} className="inline text-green-600" />
                    ) : (
                      <X size={18} className="inline text-red-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {role.privileges.override ? (
                      <Check size={18} className="inline text-green-600" />
                    ) : (
                      <X size={18} className="inline text-red-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {role.privileges.approve ? (
                      <Check size={18} className="inline text-green-600" />
                    ) : (
                      <X size={18} className="inline text-red-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {role.privileges.assignTasks ? (
                      <Check size={18} className="inline text-green-600" />
                    ) : (
                      <X size={18} className="inline text-red-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {role.privileges.configureWorkflows ? (
                      <Check size={18} className="inline text-green-600" />
                    ) : (
                      <X size={18} className="inline text-red-600" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Privilege Legend */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-900 mb-2">Privilege Definitions</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
          <div><strong>View:</strong> Can view risks, controls, and assessments</div>
          <div><strong>Create:</strong> Can create new risks, controls, and assessments</div>
          <div><strong>Update:</strong> Can edit existing items</div>
          <div><strong>Delete:</strong> Can delete items</div>
          <div><strong>Override:</strong> Can override risk ratings and rankings</div>
          <div><strong>Approve:</strong> Can approve assessments and treatment plans</div>
          <div><strong>Assign Tasks:</strong> Can assign tasks to users</div>
          <div><strong>Configure WF:</strong> Can create and modify workflows</div>
        </div>
      </div>
    </div>
  );
}
