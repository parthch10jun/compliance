'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Calendar, Flag, Filter, Plus, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { formatDateShort } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  regulator: string;
  dueDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignee: string;
}

const mockTasks: Task[] = [
  { id: '1', title: 'Review AML Policy for Q4 compliance', regulator: 'CBUAE', dueDate: '2024-12-20', priority: 'critical', status: 'pending', assignee: 'John D.' },
  { id: '2', title: 'Submit annual regulatory report', regulator: 'SCA', dueDate: '2024-12-22', priority: 'high', status: 'in_progress', assignee: 'Sarah M.' },
  { id: '3', title: 'Update data protection controls', regulator: 'DFSA', dueDate: '2024-12-25', priority: 'medium', status: 'pending', assignee: 'Ahmed K.' },
  { id: '4', title: 'Complete risk assessment documentation', regulator: 'ADGM', dueDate: '2024-12-28', priority: 'high', status: 'pending', assignee: 'Lisa P.' },
  { id: '5', title: 'Review customer due diligence process', regulator: 'CBUAE', dueDate: '2024-12-30', priority: 'medium', status: 'completed', assignee: 'John D.' },
  { id: '6', title: 'Update incident response procedures', regulator: 'DEWS', dueDate: '2025-01-05', priority: 'low', status: 'pending', assignee: 'Mike R.' },
];

const priorityColors = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  low: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
};

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status !== 'completed';
    return task.status === 'completed';
  });

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">My Actions</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            {filteredTasks.filter(t => t.status !== 'completed').length} tasks pending
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] flex items-center gap-2">
            <Filter size={16} />
            Filter
          </button>
          <button className="px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] flex items-center gap-2">
            <Plus size={16} />
            Add Task
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-[var(--background-secondary)] rounded-lg w-fit">
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-4 py-2 text-sm rounded-md transition-colors capitalize',
              filter === f 
                ? 'bg-white text-[var(--foreground)] shadow-sm' 
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-[var(--background-secondary)] border-b border-[var(--border)] text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
          <div className="col-span-5">Task</div>
          <div className="col-span-2">Regulator</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-1">Assignee</div>
        </div>

        {/* Tasks */}
        {filteredTasks.map((task) => (
          <div 
            key={task.id}
            className={clsx(
              "grid grid-cols-12 gap-4 px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)] transition-colors",
              task.status === 'completed' && 'opacity-60'
            )}
          >
            <div className="col-span-5 flex items-center gap-3">
              <button onClick={() => toggleTask(task.id)}>
                {task.status === 'completed' ? (
                  <CheckCircle2 size={20} className="text-[var(--primary)]" />
                ) : (
                  <Circle size={20} className="text-gray-300 hover:text-[var(--primary)]" />
                )}
              </button>
              <span className={clsx(
                "text-sm",
                task.status === 'completed' && 'line-through text-[var(--foreground-muted)]'
              )}>
                {task.title}
              </span>
            </div>
            <div className="col-span-2 flex items-center">
              <span className="text-sm px-2 py-0.5 bg-[var(--primary-lightest)] text-[var(--primary)] rounded">
                {task.regulator}
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-1 text-p2 text-[var(--foreground-muted)]">
              <Calendar size={14} />
              {formatDateShort(task.dueDate)}
            </div>
            <div className="col-span-2 flex items-center">
              <span className={clsx(
                "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                priorityColors[task.priority].bg,
                priorityColors[task.priority].text
              )}>
                <span className={clsx("w-1.5 h-1.5 rounded-full", priorityColors[task.priority].dot)} />
                {task.priority}
              </span>
            </div>
            <div className="col-span-1 flex items-center text-sm text-[var(--foreground-muted)]">
              {task.assignee}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

