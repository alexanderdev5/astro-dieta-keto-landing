import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 23, seconds: 29 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sincronización mediante LocalStorage (comparte estado con TopHeaderTimer)
    const now = new Date().getTime();
    let target = localStorage.getItem('keto_timer_end');
    if (!target || parseInt(target) < now) {
      target = (now + (5 * 3600 + 23 * 60 + 29) * 1000).toString();
      localStorage.setItem('keto_timer_end', target);
    }
    
    const updateTime = () => {
       const diff = Math.max(0, parseInt(target!) - new Date().getTime());
       const hours = Math.floor(diff / (1000 * 60 * 60));
       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
       const seconds = Math.floor((diff % (1000 * 60)) / 1000);
       setTimeLeft({ hours, minutes, seconds });
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null; // Previene hydration mismatch en Astro

  return (
    <div className="backdrop-blur-xl bg-white/5 dark:bg-black/30 border border-orange-500/20 shadow-2xl rounded-2xl p-6 md:p-8 flex items-center justify-between gap-4 w-full max-w-sm mx-auto transition-transform hover:scale-105 duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-orange-500/20 p-3 rounded-full">
          <Clock className="w-6 h-6 text-orange-400" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">Oferta expira en</h3>
          <p className="text-xs text-emerald-400 font-medium">Asegura tu descuento</p>
        </div>
      </div>
      <div className="flex gap-2 text-center items-center">
        <div className="bg-black/40 rounded-lg px-2 py-1.5 w-12 border border-orange-500/30 shadow-inner">
          <span className="block text-xl font-mono font-bold text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">
            {timeLeft.hours.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400">Hr</span>
        </div>
        <span className="text-lg font-bold text-slate-400 pb-4">:</span>
        <div className="bg-black/40 rounded-lg px-2 py-1.5 w-12 border border-orange-500/30 shadow-inner">
          <span className="block text-xl font-mono font-bold text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400">Min</span>
        </div>
        <span className="text-lg font-bold text-slate-400 pb-4">:</span>
        <div className="bg-black/40 rounded-lg px-2 py-1.5 w-12 border border-orange-500/30 shadow-inner">
          <span className="block text-xl font-mono font-bold text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400">Seg</span>
        </div>
      </div>
    </div>
  );
};
