import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 23, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/20 shadow-2xl rounded-2xl p-6 md:p-8 flex items-center justify-between gap-4 w-full max-w-sm mx-auto transition-transform hover:scale-105 duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-purple-500/20 p-3 rounded-full">
          <Clock className="w-6 h-6 text-purple-700 dark:text-purple-300" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">Oferta expira en</h3>
          <p className="text-xs text-slate-300">Asegura tu descuento</p>
        </div>
      </div>
      <div className="flex gap-2 text-center">
        <div className="bg-white/50 dark:bg-black/40 rounded-lg px-2 py-1 w-12 border border-white/30 shadow-sm">
          <span className="block text-xl font-bold bg-gradient-to-br from-purple-700 to-indigo-700 bg-clip-text text-transparent dark:from-purple-300 dark:to-indigo-300">
            {timeLeft.hours.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400">Hr</span>
        </div>
        <span className="text-lg font-bold text-slate-400 mt-1">:</span>
        <div className="bg-white/50 dark:bg-black/40 rounded-lg px-2 py-1 w-12 border border-white/30 shadow-sm">
          <span className="block text-xl font-bold bg-gradient-to-br from-purple-700 to-indigo-700 bg-clip-text text-transparent dark:from-purple-300 dark:to-indigo-300">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400">Min</span>
        </div>
        <span className="text-lg font-bold text-slate-400 mt-1">:</span>
        <div className="bg-white/50 dark:bg-black/40 rounded-lg px-2 py-1 w-12 border border-white/30 shadow-sm">
          <span className="block text-xl font-bold bg-gradient-to-br from-purple-700 to-indigo-700 bg-clip-text text-transparent dark:from-purple-300 dark:to-indigo-300">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400">Seg</span>
        </div>
      </div>
    </div>
  );
};
