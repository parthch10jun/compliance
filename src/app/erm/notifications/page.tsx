'use client';

import { useState } from 'react';
import { Bell, Settings, Mail, Check, X, Clock, AlertTriangle, UserPlus, CheckCircle, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import { mockNotifications, type Notification } from '@/lib/data/notifications';
import NotificationSettings from '@/components/erm/NotificationSettings';
import EmailTemplateEditor from '@/components/erm/EmailTemplateEditor';

type FilterType = 'all' | 'unread' | 'tolerance' | 'assigned' | 'complete' | 'review' | 'status';
type ViewMode = 'list' | 'settings' | 'templates';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    if (filter === 'tolerance') return n.type === 'TOLERANCE_EXCEEDED';
    if (filter === 'assigned') return n.type === 'RISK_ASSIGNED';
    if (filter === 'complete') return n.type === 'TREATMENT_COMPLETE';
    if (filter === 'review') return n.type === 'REVIEW_DUE';
    if (filter === 'status') return n.type === 'STATUS_CHANGED';
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'TOLERANCE_EXCEEDED':
        return <AlertTriangle size={18} className="text-red-600" />;
      case 'RISK_ASSIGNED':
        return <UserPlus size={18} className="text-blue-600" />;
      case 'TREATMENT_COMPLETE':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'REVIEW_DUE':
        return <Clock size={18} className="text-orange-600" />;
      case 'STATUS_CHANGED':
        return <TrendingUp size={18} className="text-purple-600" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'TOLERANCE_EXCEEDED':
        return 'bg-red-50 border-red-200';
      case 'RISK_ASSIGNED':
        return 'bg-blue-50 border-blue-200';
      case 'TREATMENT_COMPLETE':
        return 'bg-green-50 border-green-200';
      case 'REVIEW_DUE':
        return 'bg-orange-50 border-orange-200';
      case 'STATUS_CHANGED':
        return 'bg-purple-50 border-purple-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Bell size={24} className="text-[var(--primary)]" />
            <h1 className="text-h2 font-bold text-[var(--foreground)]">Alerts & Activities</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {viewMode === 'list' && unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-1.5 text-sm font-medium text-[var(--primary)] hover:bg-[var(--background-secondary)] rounded-md transition-colors"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={() => setViewMode(viewMode === 'settings' ? 'list' : 'settings')}
              className={clsx(
                'p-2 rounded-md transition-colors',
                viewMode === 'settings' ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--background-secondary)]'
              )}
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'templates' ? 'list' : 'templates')}
              className={clsx(
                'p-2 rounded-md transition-colors',
                viewMode === 'templates' ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--background-secondary)]'
              )}
            >
              <Mail size={20} />
            </button>
          </div>
        </div>
        <p className="text-p2 text-[var(--foreground-muted)]">
          {viewMode === 'list' && 'Real-time alerts and notifications for risk management activities'}
          {viewMode === 'settings' && 'Configure your notification preferences'}
          {viewMode === 'templates' && 'Customize email notification templates'}
        </p>
      </div>

      {viewMode === 'settings' && <NotificationSettings />}
      {viewMode === 'templates' && <EmailTemplateEditor />}

      {viewMode === 'list' && (
        <>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'tolerance', label: 'Tolerance Alerts', count: notifications.filter(n => n.type === 'TOLERANCE_EXCEEDED').length },
              { key: 'assigned', label: 'Assignments', count: notifications.filter(n => n.type === 'RISK_ASSIGNED').length },
              { key: 'complete', label: 'Completed', count: notifications.filter(n => n.type === 'TREATMENT_COMPLETE').length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as FilterType)}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  filter === key
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:bg-gray-200'
                )}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 bg-[var(--background-secondary)] rounded-lg">
                <Bell size={48} className="mx-auto mb-4 text-[var(--foreground-muted)] opacity-50" />
                <p className="text-p1 text-[var(--foreground-muted)]">No notifications to display</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={clsx(
                    'border rounded-lg p-4 transition-all',
                    getNotificationColor(notification.type),
                    !notification.isRead && 'shadow-sm',
                    notification.isRead && 'opacity-60'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[var(--foreground)]">
                            {notification.riskId}
                          </span>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-[var(--primary)] rounded-full"></span>
                          )}
                        </div>
                        <span className="text-xs text-[var(--foreground-muted)] whitespace-nowrap">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>

                      <h3 className="text-sm font-medium text-[var(--foreground)] mb-1">
                        {notification.riskTitle}
                      </h3>

                      <p className="text-sm text-[var(--foreground-muted)] mb-2">
                        {notification.message}
                      </p>

                      {/* Metadata */}
                      {notification.metadata && (
                        <div className="flex flex-wrap gap-2 mb-3 text-xs">
                          {notification.metadata.threshold && (
                            <span className="px-2 py-0.5 bg-white/50 rounded">
                              Threshold: <strong>{notification.metadata.threshold}</strong>
                            </span>
                          )}
                          {notification.metadata.newValue && notification.type === 'TOLERANCE_EXCEEDED' && (
                            <span className="px-2 py-0.5 bg-white/50 rounded">
                              Current: <strong>{notification.metadata.newValue}</strong>
                            </span>
                          )}
                          {notification.metadata.owner && (
                            <span className="px-2 py-0.5 bg-white/50 rounded">
                              Owner: <strong>{notification.metadata.owner}</strong>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 text-xs font-medium rounded transition-colors">
                          View Risk
                        </button>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 text-xs font-medium rounded transition-colors flex items-center gap-1"
                          >
                            <Check size={14} />
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
