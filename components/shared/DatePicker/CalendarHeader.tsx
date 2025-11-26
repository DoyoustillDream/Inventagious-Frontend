'use client';

import { getMonthName } from './calendar-utils';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onPreviousYear: () => void;
  onNextYear: () => void;
  canGoPrevious: boolean;
}

export default function CalendarHeader({
  year,
  month,
  onPreviousMonth,
  onNextMonth,
  onPreviousYear,
  onNextYear,
  canGoPrevious,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b-4 border-black bg-yellow-400 px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPreviousYear}
          disabled={!canGoPrevious}
          className="hand-drawn flex items-center justify-center w-8 h-8 border-2 border-black bg-white text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
          aria-label="Previous year"
        >
          ««
        </button>
        <button
          type="button"
          onClick={onPreviousMonth}
          disabled={!canGoPrevious}
          className="hand-drawn flex items-center justify-center w-8 h-8 border-2 border-black bg-white text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
          aria-label="Previous month"
        >
          ‹
        </button>
      </div>

      <div className="hand-drawn text-lg font-bold text-black">
        {getMonthName(month)} {year}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onNextMonth}
          className="hand-drawn flex items-center justify-center w-8 h-8 border-2 border-black bg-white text-black font-bold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
          aria-label="Next month"
        >
          ›
        </button>
        <button
          type="button"
          onClick={onNextYear}
          className="hand-drawn flex items-center justify-center w-8 h-8 border-2 border-black bg-white text-black font-bold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
          aria-label="Next year"
        >
          »»
        </button>
      </div>
    </div>
  );
}

