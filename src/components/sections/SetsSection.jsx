import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '../../context/CMSContext';

export default function SetsSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data } = useCMS();
  
  // Fallback if data.sets is an object from old localStorage
  const setsList = Array.isArray(data.sets) ? data.sets : [data.sets];
  const sets = setsList[currentIndex] || setsList[0];

  // Scroll lock when video modal open
  useEffect(() => {
    document.body.style.overflow = isVideoOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isVideoOpen]);


  const nextSet = () => {
    setCurrentIndex((prev) => (prev + 1) % setsList.length);
  };

  const prevSet = () => {
    setCurrentIndex((prev) => (prev - 1 + setsList.length) % setsList.length);
  };

  return (
    <section id="sets" className="relative w-full bg-[#050505] flex items-center justify-center py-10 md:py-16 overflow-hidden border-t border-white/5">
      
      {/* Unique Ambient Background */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center overflow-hidden pointer-events-none opacity-5">
        <h1 className="text-[15rem] md:text-[25rem] font-heading font-black whitespace-nowrap text-transparent translate-x-[-10%]" style={{ WebkitTextStroke: '2px white' }}>
          LIVE SETS LIVE SETS
        </h1>
        <h1 className="text-[15rem] md:text-[25rem] font-heading font-black whitespace-nowrap text-transparent translate-x-[-30%] -mt-32" style={{ WebkitTextStroke: '2px white' }}>
          TECH HOUSE TECH
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Info Side (Left) */}
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col items-start text-left z-20"
          >
            <div className="w-12 h-1 bg-white mb-8"></div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black text-white uppercase tracking-tighter leading-[0.9] mb-6 whitespace-pre-wrap">
              {sets.title} <br />
              <span className="text-white">{sets.subtitle}</span>
            </h2>
            <p className="text-white font-sans font-bold text-sm md:text-base tracking-widest uppercase mb-2">
              {sets.description}
            </p>
            <p className="text-white font-sans text-xs md:text-sm tracking-widest">
              {sets.dateInfo}
            </p>
            
            <div className="flex items-center flex-wrap gap-8 mt-10">
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                  <svg className="w-5 h-5 text-white group-hover:text-black ml-1 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <span className="font-heading font-bold uppercase tracking-widest text-sm text-white group-hover:text-gray-300 transition-colors">Play Full Set</span>
              </button>

              {/* Navigation Arrows */}
              {setsList.length > 1 && (
                <div className="flex items-center gap-2 ml-auto lg:ml-8 border-l border-white/20 pl-8">
                  <button onClick={prevSet} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <button onClick={nextSet} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Video Side (Right) */}
          <motion.div 
            key={`thumb-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 relative w-full aspect-[16/9] shadow-2xl group cursor-pointer overflow-hidden border border-white/10"
            onClick={() => setIsVideoOpen(true)}
          >
            {/* Thumbnail */}
            <img 
              src={`https://img.youtube.com/vi/${sets.videoId}/maxresdefault.jpg`} 
              alt={sets.title} 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
            />
            
            {/* Overlaid Play Button (Center) */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/10 transition-all duration-700">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-[3px] border-white/50 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:border-white transition-all duration-500">
                <svg className="w-8 h-8 md:w-12 md:h-12 text-white/80 group-hover:text-white ml-2 transition-colors duration-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Video Modal (Popup) */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
          >
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:text-gray-400 transition-colors z-[110]"
            >
              <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div className="relative w-full max-w-7xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${sets.videoId}?autoplay=1`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
