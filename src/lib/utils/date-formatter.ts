/**
 * Date Formatting Utilities
 * 
 * Standardized date formatting across the application.
 * All dates should use these utilities for consistency.
 * 
 * Standard Format: MMM DD, YYYY (e.g., "Dec 23, 2024")
 * Short Format: MMM DD (e.g., "Dec 23")
 * Long Format: MMMM DD, YYYY (e.g., "December 23, 2024")
 * ISO Format: YYYY-MM-DD (e.g., "2024-12-23") - for data storage
 */

/**
 * Format a date string to standard format: "MMM DD, YYYY"
 * @param dateString - ISO date string (YYYY-MM-DD) or Date object
 * @returns Formatted date string (e.g., "Dec 23, 2024")
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Format a date string to short format: "MMM DD"
 * @param dateString - ISO date string (YYYY-MM-DD) or Date object
 * @returns Formatted date string (e.g., "Dec 23")
 */
export function formatDateShort(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Format a date string to long format: "MMMM DD, YYYY"
 * @param dateString - ISO date string (YYYY-MM-DD) or Date object
 * @returns Formatted date string (e.g., "December 23, 2024")
 */
export function formatDateLong(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Format a date range
 * @param startDate - Start date (ISO string or Date)
 * @param endDate - End date (ISO string or Date)
 * @returns Formatted date range (e.g., "Dec 23 - Dec 31, 2024" or "Dec 23, 2024 - Jan 15, 2025")
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  // If same year, show year only once
  if (start.getFullYear() === end.getFullYear()) {
    // If same month, show month only once
    if (start.getMonth() === end.getMonth()) {
      return `${formatDateShort(start)} - ${end.getDate()}, ${end.getFullYear()}`;
    }
    return `${formatDateShort(start)} - ${formatDate(end)}`;
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`;
}

/**
 * Calculate days between two dates
 * @param fromDate - Start date (ISO string or Date)
 * @param toDate - End date (ISO string or Date), defaults to today
 * @returns Number of days
 */
export function getDaysBetween(fromDate: string | Date, toDate: string | Date = new Date()): number {
  const from = typeof fromDate === 'string' ? new Date(fromDate) : fromDate;
  const to = typeof toDate === 'string' ? new Date(toDate) : toDate;
  const diff = to.getTime() - from.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is overdue (past today)
 * @param dateString - Date to check (ISO string or Date)
 * @returns True if date is in the past
 */
export function isOverdue(dateString: string | Date): boolean {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 days")
 * @param dateString - Date to format (ISO string or Date)
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

/**
 * Get current date in ISO format (YYYY-MM-DD)
 * @returns ISO date string
 */
export function getCurrentDateISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Parse ISO date string to Date object
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Date object
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString);
}

