import React, { useState } from 'react';
import { Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';

export const CheckoutForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Comenzando pago...");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100 max-w-md w-full relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="text-center mb-8 relative z-10">
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Comienza tu viaje Keto</h3>
        <p className="text-slate-500 mt-2 text-sm">Reserva tu plan premium ahora</p>
      </div>

      <div className="space-y-5 relative z-10">
        <div className="relative">
          <label htmlFor="name" className="sr-only">Nombre completo</label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            id="name"
            required
            className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
            placeholder="Introduce tu nombre"
          />
        </div>

        <div className="relative">
          <label htmlFor="email" className="sr-only">Correo electrónico</label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="email"
            id="email"
            required
            className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
            placeholder="tu@correo.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full relative flex justify-center items-center py-4 px-8 border border-transparent text-lg font-bold rounded-2xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_25px_rgba(0,0,0,0.2)] disabled:opacity-70 disabled:cursor-not-allowed group/btn"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Únete Ahora <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          )}
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Pago seguro cifrado a nivel bancario</span>
      </div>
    </form>
  );
};
