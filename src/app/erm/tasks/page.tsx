'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckSquare, Calendar, AlertCircle, User, Filter } from 'lucide-react';
import clsx from 'clsx';
import { mockTasks, getOverdueTasks, type Task } from '@/lib/data/workflow';

export default function TasksPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'my-tasks' | 'overdue'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | Task['status']>('all');

  const filteredTasks = mockTasks.filter(task => {
    if (selectedFilter === 'overdue' && !task.isOverdue) return false;
    if (selectedFilter === 'my-tasks' && task.assignedToValue !== 'Sarah Chen (CISO)') return false;
    if (selectedStatus !== 'all' && task.status !== selectedStatus) return false;
    return true;
  });

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Pending Review': return 'bg-orange-100 text-orange-700';
      case 'Not Started': return 'bg-gray-100 text-gray-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Escalated': return 'bg-purple-100 text-purple-700';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-orange-600 text-white';
      case 'Medium': return 'bg-yellow-600 text-white';
      case 'Low': return 'bg-green-600 text-white';
    }
  };

  const stats = {
    total: mockTasks.length,
    inProgress: mockTasks.filter(t => t.status === 'In Progress').length,
    overdue: getOverdueTasks().length,
    requireSignOff: mockTasks.filter(t => t.requiresSignOff && t.status !== 'Completed').length
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <CheckSquare size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Task Management</h1>
          </div>
          <button 
            onClick={() => router.push('/erm/tasks/new')}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
          >
            <CheckSquare size={18} />
            Create Task
          </button>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          View and manage all assigned tasks and approvals
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[var(--border)] rounded-lg p-4">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Tasks</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 mb-1">In Progress</div>
          <div className="text-2xl font-bold text-blue-700">{stats.inProgress}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700 mb-1">Overdue</div>
          <div className="text-2xl font-bold text-red-700">{stats.overdue}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-700 mb-1">Require Sign-off</div>
          <div className="text-2xl font-bold text-purple-700">{stats.requireSignOff}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[var(--foreground-muted)] flex items-center gap-2">
              <Filter size={16} />
              Filter:
            </span>
            <div className="flex gap-2">
              {['all', 'my-tasks', 'overdue'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter as any)}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedFilter === filter
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-gray-100 text-[var(--foreground-muted)] hover:bg-gray-200'
                  )}
                >
                  {filter === 'all' ? 'All Tasks' : filter === 'my-tasks' ? 'My Tasks' : 'Overdue'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
              <option value="Escalated">Escalated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            onClick={() => router.push(`/erm/tasks/${task.id}`)}
            className={clsx(
              'bg-white border rounded-lg p-6 hover:shadow-md transition-all cursor-pointer',
              task.isOverdue ? 'border-red-300 bg-red-50' : 'border-[var(--border)]'
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-[var(--primary)]">{task.id}</span>
                  <span className={clsx('px-2 py-0.5 text-xs font-medium rounded', getStatusColor(task.status))}>
                    {task.status}
                  </span>
                  <span className={clsx('px-2 py-0.5 text-xs font-bold rounded', getPriorityColor(task.priority))}>
                    {task.priority}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">
                    {task.type}
                  </span>
                  {task.isOverdue && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-600 text-white flex items-center gap-1">
                      <AlertCircle size={12} />
                      OVERDUE
                    </span>
                  )}
                  {task.requiresSignOff && !task.signedOffBy && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-orange-100 text-orange-700">
                      ✍️ Sign-off Required
                    </span>
                  )}
                  {task.signedOffBy && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
                      ✅ Signed Off
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{task.title}</h3>
                <p className="text-sm text-[var(--foreground-muted)] mb-3">{task.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-[var(--foreground-muted)] mb-1 flex items-center gap-1">
                  <User size={12} />
                  Assigned To
                </div>
                <div className="text-sm font-medium">
                  {task.assignedToValue}
                  <div className="text-xs text-[var(--foreground-muted)] mt-1">({task.assignedToType})</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-[var(--foreground-muted)] mb-1 flex items-center gap-1">
                  <Calendar size={12} />
                  Due Date
                </div>
                <div className={clsx('text-sm font-medium', task.isOverdue && 'text-red-600')}>
                  {new Date(task.dueDate).toLocaleDateString()}
                  {task.isOverdue && (
                    <div className="text-xs text-red-600 mt-1">
                      {Math.floor((Date.now() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Related Entity</div>
                <div className="text-sm font-medium">{task.entityType}</div>
                <div className="text-xs text-[var(--foreground-muted)] mt-1">{task.entityId}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Assigned By</div>
                <div className="text-sm font-medium">{task.assignedBy}</div>
                <div className="text-xs text-[var(--foreground-muted)] mt-1">
                  {new Date(task.assignedDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            {task.feedback && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-xs text-blue-700 font-medium mb-1">Feedback:</div>
                <div className="text-sm text-blue-900">{task.feedback}</div>
              </div>
            )}

            {task.workflowId && (
              <div className="text-xs text-[var(--foreground-muted)] mt-3">
                Workflow: {task.workflowId} (Step {task.workflowStepNumber})
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <CheckSquare size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-[var(--foreground-muted)]">No tasks match your filters</p>
        </div>
      )}
    </div>
  );
}
