'use client';

import { useState, useRef, useEffect, useId } from 'react';
import Link from 'next/link';

interface DropdownItem {
  title: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
  dataElementId?: string;
}

interface HeaderDropdownProps {
  title: string;
  items: DropdownItem[];
  icon?: React.ReactNode;
  description?: string;
  align?: 'left' | 'right';
  className?: string;
}

export default function HeaderDropdown({
  title,
  items,
  icon,
  description,
  align = 'left',
  className = '',
}: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const baseId = useId();
  const dropdownId = `dropdown-${baseId}`;
  const menuId = `menu-${baseId}`;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center gap-1 px-3 py-2 text-base font-bold text-black hand-drawn transition-all duration-300 hover:text-yellow-600 hover:scale-105 active:scale-95"
        aria-controls={dropdownId}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          id={dropdownId}
          className={`absolute top-full mt-2 w-80 rounded-lg border-4 border-black bg-white shadow-2xl z-50 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {(icon || description) && (
            <div className="p-4 border-b-2 border-black">
              {icon && <div className="mb-2 text-black">{icon}</div>}
              {description && (
                <p className="text-sm font-semibold text-black" id={menuId}>
                  {description}
                </p>
              )}
            </div>
          )}
          <ul
            aria-labelledby={menuId}
            className="list-none p-2"
          >
            {items.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="block p-3 rounded-lg transition-all duration-300 hover:bg-yellow-100 hover:scale-[1.02] active:scale-100"
                  data-element-id={item.dataElementId}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-start gap-3">
                    {item.icon && <div className="flex-shrink-0 mt-1 text-gray-700">{item.icon}</div>}
                    <div className="flex-1">
                      <div className="text-base font-bold text-black mb-1">
                        {item.title}
                      </div>
                      {item.description && (
                        <div className="text-sm text-gray-600">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

