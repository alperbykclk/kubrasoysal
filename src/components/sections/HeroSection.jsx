import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';

const FRAME_COUNT = 202;
const MIN_FRAMES_TO_START = 20;

export default function HeroSection() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Synchronous initial mobile check to prevent state flip on mount
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Preload images on mount (desktop only)
  useEffect(() => {
    if (isMobile) {
      // Small delay on mobile to allow smooth video buffer & animation without flash
      const timer = setTimeout(() => setIsReady(true), 400);
      return () => clearTimeout(timer);
    }

    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const frameNumber = i.toString().padStart(4, '0');
      img.src = `/frames/frame_${frameNumber}.jpg`;
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, [isMobile]);

  // When minimum frames loaded on desktop, set isReady
  useEffect(() => {
    if (!isMobile && imagesLoaded >= MIN_FRAMES_TO_START) {
      setIsReady(true);
    }
  }, [imagesLoaded, isMobile]);

  // Draw frame on canvas when scroll or images change
  useEffect(() => {
    if (isMobile) return;
    if (images.length === 0 || imagesLoaded < 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();

    const renderFrame = (index) => {
      const img = images[index];
      if (!img || !img.complete) return;

      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;  

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height,
         centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    };

    // Render initial frame
    renderFrame(0);

    // Subscribe to scroll changes
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(latest * FRAME_COUNT)
      );
      requestAnimationFrame(() => renderFrame(frameIndex));
    });

    const handleResize = () => {
      if (isMobile) return;
      updateCanvasSize();
      const currentLatest = scrollYProgress.get();
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(currentLatest * FRAME_COUNT)
      );
      renderFrame(frameIndex);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, [images, imagesLoaded, scrollYProgress, isMobile]);

  const loadingPercentage = isMobile 
    ? 100 
    : Math.min(100, Math.round((imagesLoaded / MIN_FRAMES_TO_START) * 100));

  return (
    <section id="home" ref={containerRef} className="relative w-full bg-black h-[100vh]">
      


      {/* NORMAL VIEWPORT */}
      <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center bg-black">
        
        {/* DESKTOP CANVAS BACKGROUND */}
        {!isMobile && (
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full z-0 filter grayscale contrast-[1.1] hidden md:block bg-black transition-opacity duration-700"
            style={{ opacity: isReady ? 1 : 0 }}
          />
        )}

        {/* MOBILE VIDEO BACKGROUND */}
        {isMobile && (
          <video 
            src="/videos/mobile_bg.mp4"
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover z-0 md:hidden filter grayscale contrast-125 opacity-70 bg-black transition-opacity duration-700"
            style={{ opacity: isReady ? 0.7 : 0 }}
          />
        )}

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
