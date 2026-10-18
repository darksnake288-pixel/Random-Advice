import React, { useState, useEffect } from 'react';
import patterns from './assets/pattern-divider-desktop.svg';
import patterns2 from './assets/pattern-divider-mobile.svg';
import icon from './assets/icon-dice.svg';
import loadingIcon from './assets/grid.svg';

// تعريف الـ Interface الخاص بالبيانات لتجنب استخدام any
interface AdviceResponse {
  slip: {
    id: number;
    advice: string;
  };
}

const App = () => {
  const [data, setData] = useState<AdviceResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function getAdvice() {
    setIsLoading(true);
    setError(null); // تفريغ أي خطأ قديم عند بدء طلب جديد

    try {
      const response = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch advice');
      }

      const result: AdviceResponse = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAdvice();
  }, []);

  return (
    <div className="bg-slate-900 h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-slate-800 text-slate-100 rounded-2xl p-8 w-full max-w-md shadow-2xl relative flex flex-col items-center">
        
        {/* Title Text */}
        <div className="mb-6">
          <h1 className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em]">
            Advice #{data?.slip?.id || '---'}
          </h1>
        </div>

        {/* Advice Text / Loading / Error */}
        <div className="w-full text-center min-h-[120px] flex items-center justify-center mb-6">
          {isLoading ? (
            <div className="flex flex-col gap-2 items-center justify-center">
              <img src={loadingIcon} alt="loading" className="w-8 h-8 animate-spin" />
              <p className="text-slate-400 text-sm">جاري جلب النصيحة...</p>
            </div>
          ) : error ? (
            <p className="text-red-400 text-sm">Error: {error}</p>
          ) : (
            <p className="text-slate-200 text-xl font-semibold tracking-normal leading-relaxed">
              "{data?.slip?.advice || 'Loading advice...'}"
            </p>
          )}
        </div>

        {/* Divider Pattern */}
        <div className="w-full pb-10 flex justify-center">
          <img src={patterns} alt="pattern-desktop" className="hidden md:block w-full" />
          <img src={patterns2} alt="pattern-mobile" className="block md:hidden w-full" />
        </div>

        {/* Dice Button */}
        <button
          onClick={getAdvice}
          disabled={isLoading}
          aria-label="Get new advice"
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-emerald-400 hover:bg-emerald-300 rounded-full p-4 flex justify-center items-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] disabled:opacity-50"
        >
          <img src={icon} alt="icon" className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

      </div>
    </div>
  );
};

export default App;