'use client';

import { CalendarDay, getDayNames } from './calendar-utils';

interface CalendarGridProps {
  days: CalendarDay[];
  onDayClick: (date: Date) => void;
}

export default function CalendarGrid({ days, onDayClick }: CalendarGridProps) {
  const dayNames = getDayNames(true);

  return (
    <div className="p-4 bg-white">
      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((dayName) => (
          <div
            key={dayName}
            className="hand-drawn text-center text-xs font-bold text-black py-2"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isClickable = !day.isDisabled;
          
          return (
            <button
              key={`${day.date.getTime()}-${index}`}
              type="button"
              onClick={() => isClickable && onDayClick(day.date)}
              disabled={day.isDisabled}
              className={`
                hand-drawn relative flex items-center justify-center h-10 w-10
                border-2 border-black font-bold text-sm
                transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400
                ${
                  day.isDisabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                    : day.isSelected
                    ? 'bg-yellow-400 text-black shadow-lg scale-110 border-4'
                    : day.isToday
                    ? 'bg-yellow-100 text-black border-4'
                    : day.isCurrentMonth
                    ? 'bg-white text-black hover:bg-yellow-100 hover:scale-105'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }
              `}
              aria-label={`${day.date.toLocaleDateString()}${day.isSelected ? ' (selected)' : ''}${day.isToday ? ' (today)' : ''}`}
              aria-disabled={day.isDisabled}
            >
              {day.day}
              {day.isSelected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full border-2 border-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

