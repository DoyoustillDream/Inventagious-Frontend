import { ReactNode } from 'react';

interface BrowserWindowProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export default function BrowserWindow({ 
  children, 
  title, 
  className = '' 
}: BrowserWindowProps) {
  return (
    <div className={`browser-window ${className}`}>
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        {title && (
          <>
            <div className="flex-1" />
            <div className="hand-drawn text-xs font-bold text-black">{title}</div>
          </>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

