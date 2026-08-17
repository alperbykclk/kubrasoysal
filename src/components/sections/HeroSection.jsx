import { useRef, useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';

export default function HeroSection() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure we can start scrubbing once video metadata is known
    const handleLoadedMetadata = () => {
      setIsReady(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    // In case it's already loaded from cache
    if (video.readyState >= 1) handleLoadedMetadata();

    // Bind scroll progress directly to video playback time
    const unsubscribe = scrollYProgress.onChange((latest) => {
      if (video.readyState >= 1 && video.duration) {
        // Use requestAnimationFrame to ensure smooth scrubbing
        requestAnimationFrame(() => {
          video.currentTime = latest * video.duration;
        });
      }
    });

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      unsubscribe();
    };
  }, [scrollYProgress]);

  return (
    <section 
      id="home" 
      ref={containerRef} 
      className="relative w-full bg-black h-[100vh] bg-cover bg-center"
      style={{ backgroundImage: "url('/frames/frame_0001.jpg')" }}
    >
      <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center bg-black/40">
        
        {/* VIDEO BACKGROUND (Scrubbable & High Performance) */}
        <video 
          ref={videoRef}
          src="/videos/desktop_scrub.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0 filter grayscale contrast-[1.1] transition-opacity duration-300"
          style={{ opacity: isReady ? 1 : 0 }}
        />

        {/* SUBTLE VIGNETTE */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.5)_100%)]"></div>

        {/* FOREGROUND CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full h-full pt-40 pointer-events-none">
          <h1 className="text-5xl sm:text-6xl md:text-[7rem] leading-none font-heading font-black tracking-tight text-white mb-4 whitespace-nowrap drop-shadow-xl pointer-events-auto mix-blend-difference">
            KÜBRA SOYSAL
          </h1>
          
          <a 
            href="#music"
            className="inline-block px-8 py-3 bg-white text-black font-heading font-bold text-sm md:text-base uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300 pointer-events-auto mt-2"
          >
            LISTEN NOW
          </a>
        </div>
        
        {/* SCROLL DOWN INDICATOR */}
        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none mix-blend-difference"
        >
          <span className="text-white text-[10px] md:text-xs font-bold tracking-widest uppercase">SCROLL DOWN</span>
          <svg className="w-4 h-4 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>

      </div>
    </section>
  );
}
