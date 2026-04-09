import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';

export const TopHeaderTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 23, seconds: 29 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sincronización mediante LocalStorage
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
    <div className="fixed top-0 left-0 right-0 w-full z-[100] bg-gradient-to-r from-[#0A101E] via-[#0f172a] to-[#0A101E] border-b border-orange-500/30 text-white shadow-[0_5px_30px_rgba(249,115,22,0.15)] backdrop-blur-xl">
       <div className="max-w-[1400px] mx-auto px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm">
         <div className="flex items-center gap-2 font-bold tracking-widest uppercase text-emerald-400 drop-shadow-md">
            <Zap className="w-4 h-4 fill-emerald-400" />
            <span className="hidden sm:inline">¡Últimos 14 cupos con 70% DSCTO!</span>
            <span className="sm:hidden text-[10px]">70% DSCTO - 14 CUPOS</span>
         </div>
         <div className="flex items-center gap-3 bg-black/40 rounded-full pl-3 pr-4 py-1.5 border border-white/10 shadow-inner">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="font-poppins font-bold text-slate-300 uppercase tracking-wider text-[10px] sm:text-xs mr-1 hidden min-[380px]:inline">
              Expira en:
            </span>
            <span className="font-mono font-bold text-orange-400 tracking-wider text-sm sm:text-base drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
               {timeLeft.hours.toString().padStart(2, '0')}:
               {timeLeft.minutes.toString().padStart(2, '0')}:
               {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
         </div>
       </div>
    </div>
  );
};
