'use client';

import { useState, useRef, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import {
  generateCalendarDays,
  formatDateToString,
  parseDateString,
  isPastDate,
} from './calendar-utils';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  placeholder?: string;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  minDate,
  placeholder = 'Select a date',
  className = '',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = parseDateString(value);
  const minDateParsed = minDate ? parseDateString(minDate) : null;
  const minDateObj = minDateParsed || undefined;
  const today = new Date();

  // Initialize calendar to selected date or today
  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate.getMonth());
      setCurrentYear(selectedDate.getFullYear());
    }
  }, [selectedDate]);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const days = generateCalendarDays(
    currentYear,
    currentMonth,
    selectedDate,
    minDateObj
  );

  const handleDayClick = (date: Date) => {
    onChange(formatDateToString(date));
    setIsOpen(false);
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  // Check if we can go to previous month/year (based on minDate)
  const canGoPrevious = minDateObj
    ? new Date(currentYear, currentMonth) > new Date(minDateObj.getFullYear(), minDateObj.getMonth())
    : true;

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input field */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black
          focus:outline-none focus:ring-4 focus:ring-yellow-400
          text-left cursor-pointer
          ${!displayValue ? 'text-gray-500' : ''}
        `}
        aria-label="Select date"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {displayValue || placeholder}
      </button>

      {/* Calendar dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 border-4 border-black bg-white shadow-lg">
          <CalendarHeader
            year={currentYear}
            month={currentMonth}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onPreviousYear={handlePreviousYear}
            onNextYear={handleNextYear}
            canGoPrevious={canGoPrevious}
          />
          <CalendarGrid days={days} onDayClick={handleDayClick} />
          
          {/* Clear button */}
          {selectedDate && (
            <div className="border-t-4 border-black p-3 bg-gray-50">
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="hand-drawn w-full border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              >
                Clear Date
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

