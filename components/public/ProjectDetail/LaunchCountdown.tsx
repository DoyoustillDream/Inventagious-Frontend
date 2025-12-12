'use client';

import { useState, useEffect } from 'react';

interface LaunchCountdownProps {
  launchDate: string;
}

export default function LaunchCountdown({ launchDate }: LaunchCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Handle both ISO format (with timezone) and local format (YYYY-MM-DDTHH:mm)
      let launch: Date;
      if (launchDate.includes('T') && (launchDate.includes('Z') || launchDate.includes('+') || launchDate.includes('-'))) {
        // ISO format with timezone
        launch = new Date(launchDate);
      } else if (launchDate.includes('T')) {
        // Local format (YYYY-MM-DDTHH:mm) - treat as local time
        launch = new Date(launchDate);
      } else {
        // Date only - set to start of day in local timezone
        launch = new Date(launchDate + 'T00:00');
      }
      
      const now = new Date();
      const difference = launch.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [launchDate]);

  if (!timeLeft) {
    return (
      <div className="hand-drawn px-4 py-2 bg-green-400 border-4 border-black rounded-lg">
        <span className="font-bold text-black">Launched!</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-yellow-50 border-4 border-black rounded-lg">
      <p className="hand-drawn text-sm font-bold text-black mb-3">Launching in:</p>
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="hand-drawn text-2xl md:text-3xl font-bold text-black">
            {timeLeft.days}
          </div>
          <div className="text-xs font-semibold text-gray-700">
            {timeLeft.days === 1 ? 'Day' : 'Days'}
          </div>
        </div>
        <div className="text-center">
          <div className="hand-drawn text-2xl md:text-3xl font-bold text-black">
            {timeLeft.hours}
          </div>
          <div className="text-xs font-semibold text-gray-700">
            {timeLeft.hours === 1 ? 'Hour' : 'Hours'}
          </div>
        </div>
        <div className="text-center">
          <div className="hand-drawn text-2xl md:text-3xl font-bold text-black">
            {timeLeft.minutes}
          </div>
          <div className="text-xs font-semibold text-gray-700">
            {timeLeft.minutes === 1 ? 'Min' : 'Mins'}
          </div>
        </div>
        <div className="text-center">
          <div className="hand-drawn text-2xl md:text-3xl font-bold text-black">
            {timeLeft.seconds}
          </div>
          <div className="text-xs font-semibold text-gray-700">
            {timeLeft.seconds === 1 ? 'Sec' : 'Secs'}
          </div>
        </div>
      </div>
      <p className="hand-drawn mt-3 text-xs font-semibold text-gray-600 text-center">
        Launch Date: {new Date(launchDate).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short',
        })}
      </p>
    </div>
  );
}

