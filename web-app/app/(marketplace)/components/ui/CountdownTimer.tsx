'use client';

import { useState, useEffect } from 'react';

export function CountdownTimer() {
  const [time, setTime] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1">
      {[time.hours, time.minutes, time.seconds].map((t, idx) => (
        <div key={idx} className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded min-w-[35px] text-center">
          {t.toString().padStart(2, '0')}
        </div>
      ))}
    </div>
  );
}