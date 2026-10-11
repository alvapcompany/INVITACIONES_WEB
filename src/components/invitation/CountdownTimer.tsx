import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { ThemeConfig } from '../../types';

interface CountdownTimerProps {
  targetDate: string;
  themeConfig: ThemeConfig;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, themeConfig }) => {
  const calculateTime = (): TimeRemaining => {
    const diff = new Date(targetDate).getTime() - new Date().getTime();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isPassed: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'DÍAS', value: timeLeft.days },
    { label: 'HORAS', value: timeLeft.hours },
    { label: 'MINUTOS', value: timeLeft.minutes },
    { label: 'SEGUNDOS', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-lg mx-auto py-6 px-4">
      <div className="flex items-center justify-center gap-2 mb-4 text-xs font-semibold tracking-[0.25em] text-amber-200/80 uppercase">
        <Calendar className="w-3.5 h-3.5 text-amber-400" />
        <span>Cuenta Regresiva Para El Gran Día</span>
      </div>

      {timeLeft.isPassed ? (
        <div className="text-center py-4 px-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-serif-luxury text-lg">
          ✨ ¡El día tan esperado ha llegado! ✨
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {units.map((unit, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl backdrop-blur-md border shadow-lg transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                borderColor: themeConfig.goldBorder,
              }}
            >
              <span className="font-heading text-2xl sm:text-3xl font-black text-white tracking-wider">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-amber-300/70 uppercase mt-1 font-semibold">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
