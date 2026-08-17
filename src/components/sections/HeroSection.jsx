import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const FRAME_COUNT = 202;

export default function HeroSection() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Preload images on mount (only for desktop)
  useEffect(() => {
    if (isMobile) {
      setImagesLoaded(10); // Bypass loading screen for mobile instantly
      return;
    }

    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      // Pad to 4 digits: frame_0001.jpg
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

  // Draw frame on canvas when scroll or images change
  useEffect(() => {
    if (isMobile) return;
    // Start rendering as soon as we have enough frames to show the first frame
    if (images.length === 0 || imagesLoaded < 10) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const renderFrame = (index) => {
      const img = images[index];
      if (!img) return;

      // Draw image covering the whole canvas (object-cover equivalent)
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;  

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height,
         centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    };

    // Draw initial frame
    renderFrame(0);

    // Subscribe to scroll changes
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(latest * FRAME_COUNT)
      );
      requestAnimationFrame(() => renderFrame(frameIndex));
    });

    // Handle window resize
    const handleResize = () => {
      if (isMobile) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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

  // Loading state boolean
  const isLoading = imagesLoaded < 10; // Wait for fewer frames to load instantly
  const loadingPercentage = Math.min(100, Math.round((imagesLoaded / 10) * 100));

  return (
    <section id="home" ref={containerRef} className="relative w-full bg-black h-[100vh] md:h-[100vh]">
      
      {/* LOADING SCREEN */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-6">
              <h1 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tighter mix-blend-difference drop-shadow-2xl">KS</h1>
              <div className="w-48 h-[2px] bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingPercentage}%` }}
                  transition={{ ease: "linear", duration: 0.2 }}
                />
              </div>
              <span className="text-gray-400 font-sans text-xs tracking-[0.3em] uppercase">LOADING {loadingPercentage}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NORMAL VIEWPORT */}
      <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* DESKTOP CANVAS BACKGROUND */}
        {!isMobile && (
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full z-0 filter grayscale contrast-[1.1] hidden md:block"
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
            className="absolute inset-0 w-full h-full object-cover z-0 md:hidden filter grayscale contrast-125 opacity-70"
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
