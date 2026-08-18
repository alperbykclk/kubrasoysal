import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fake progress that quickly goes up to 85% then waits
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) {
          clearInterval(interval);
          return prev;
        }
        // Random increment between 5 and 15
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050505] z-[9999] flex flex-col items-center justify-center font-sans">
      <div className="relative flex flex-col items-center">
        {/* Logo or Monogram */}
        <h1 className="text-4xl md:text-6xl font-heading font-black text-white tracking-tighter mb-8">
          KS
        </h1>
        
        {/* Progress Bar Container */}
        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden mb-4">
          <div 
            className="absolute top-0 left-0 h-full bg-white transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Text Details */}
        <div className="flex w-48 justify-between items-center text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
          <span>Loading</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
