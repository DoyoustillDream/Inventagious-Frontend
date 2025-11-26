/**
 * Calendar utility functions for date calculations
 */

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

/**
 * Get the first day of the month
 */
export function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

/**
 * Get the last day of the month
 */
export function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

/**
 * Get the first day of the calendar grid (including previous month's days)
 */
export function getCalendarStartDate(year: number, month: number): Date {
  const firstDay = getFirstDayOfMonth(year, month);
  const dayOfWeek = firstDay.getDay();
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - dayOfWeek);
  return startDate;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the past (before today)
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

/**
 * Format date to YYYY-MM-DD string
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to Date
 */
export function parseDateString(dateString: string): Date | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date;
}

/**
 * Get month name
 */
export function getMonthName(month: number): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month];
}

/**
 * Get short month name
 */
export function getShortMonthName(month: number): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months[month];
}

/**
 * Get day names (Sunday to Saturday)
 */
export function getDayNames(short: boolean = false): string[] {
  if (short) {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
}

/**
 * Generate calendar days for a given month
 */
export function generateCalendarDays(
  year: number,
  month: number,
  selectedDate: Date | null,
  minDate?: Date
): CalendarDay[] {
  const days: CalendarDay[] = [];
  const startDate = getCalendarStartDate(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const isCurrentMonth = date.getMonth() === month;
    const isTodayDate = isToday(date);
    const isSelected =
      selectedDate !== null &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();

    // Disable past dates if minDate is provided
    let isDisabled = false;
    if (minDate) {
      const minDateCopy = new Date(minDate);
      minDateCopy.setHours(0, 0, 0, 0);
      const dateCopy = new Date(date);
      dateCopy.setHours(0, 0, 0, 0);
      isDisabled = dateCopy < minDateCopy;
    }

    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth,
      isToday: isTodayDate,
      isSelected,
      isDisabled,
    });
  }

  return days;
}

