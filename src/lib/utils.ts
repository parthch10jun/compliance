/**
 * Utility functions for the compliance application
 */

/**
 * Format a date string to a standard format (e.g., "Jan 15, 2025")
 * This is the default date formatter used throughout the app
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format a date string to a short format (e.g., "Jan 15, 2025")
 * Alias for formatDate for backward compatibility
 */
export function formatDateShort(dateString: string): string {
  return formatDate(dateString);
}

/**
 * Format a date string to a long format (e.g., "January 15, 2025")
 */
export function formatDateLong(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Format a date range (e.g., "Jan 15 - Feb 28, 2025")
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const endDay = end.getDate();
  const endYear = end.getFullYear();

  if (start.getFullYear() === end.getFullYear()) {
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${endYear}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
  }

  return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
}

/**
 * Get the number of days between today and a target date
 * Returns negative if the date is in the past
 */
export function getDaysBetween(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if a date is overdue (in the past)
 */
export function isOverdue(dateString: string): boolean {
  return getDaysBetween(dateString) < 0;
}

/**
 * Check if a date is due soon (within the next 7 days)
 */
export function isDueSoon(dateString: string): boolean {
  const days = getDaysBetween(dateString);
  return days >= 0 && days <= 7;
}

/**
 * Format a relative time string (e.g., "2 days ago", "in 5 days")
 */
export function formatRelativeTime(dateString: string): string {
  const days = getDaysBetween(dateString);
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 0) return `in ${days} days`;
  return `${Math.abs(days)} days ago`;
}

/**
 * Truncate a string to a maximum length and add ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Format a number as a percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a large number with commas (e.g., 1000 -> "1,000")
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Get initials from a name (e.g., "John Doe" -> "JD")
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a random color for avatars
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

/**
 * Combine class names conditionally
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

