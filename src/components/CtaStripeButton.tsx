import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShoppingCart } from 'lucide-react';

interface Props {
  className?: string;
  text?: string;
}

export const CtaStripeButton: React.FC<Props> = ({ 
  className = "", 
  text = "¡COMPRAR EBOOK AHORA!" 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Fix para el bfcache (Back-Forward cache): Restaura el botón al usar navegador 'Atrás'
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsLoading(false);
      }
    };
    
    // Fallback de seguridad para navegadores móviles
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setIsLoading(false);
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'default' }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Erroneous response from server');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Hubo un error al procesar el pago. Por favor intenta de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Glow Effect Layer */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-yellow-400 to-green-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-200"
      />

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
        onClick={handleCheckout}
        className="relative w-full px-4 py-4 md:px-8 md:py-5 bg-gradient-to-b from-green-500 to-emerald-700 text-white rounded-xl font-black text-base md:text-xl flex items-center justify-center gap-2 md:gap-3 border-2 border-green-300/50 overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.6)] disabled:opacity-70 disabled:cursor-not-allowed group-hover:shadow-[0_0_60px_rgba(250,204,21,0.6)] transition-shadow duration-300"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>PROCESANDO...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>{text}</span>
          </>
        )}
        
        {/* Shine highlight animation */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear",
            repeatDelay: 1
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
        />
      </motion.button>
    </div>
  );
};
