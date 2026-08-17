import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '#home' },
  { name: 'Music', path: '#music' },
  { name: 'Tour', path: '#tour' },
  { name: 'Media', path: '#media' },
  { name: 'About', path: '#about' },
  { name: 'Contact', path: '#contact' },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState('#home');
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle Scroll Lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = navLinks.map(link => link.path.substring(1));
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header id="main-header" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-28 pointer-events-none mix-blend-difference`}>
        <div className="max-w-[95%] mx-auto px-4 h-full flex items-center justify-between">
          <a href="#home" className="text-2xl md:text-3xl font-heading font-black tracking-tighter text-white hover:opacity-70 transition-opacity pointer-events-auto">
            KS
          </a>
          
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-3 text-white hover:opacity-70 transition-opacity group pointer-events-auto"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span className="w-full h-0.5 bg-white group-hover:w-4 transition-all"></span>
              <span className="w-full h-0.5 bg-white"></span>
            </div>
            <span className="font-heading font-bold tracking-widest uppercase text-sm md:text-lg">MENU</span>
          </button>
        </div>
      </header>

      {/* FULL SCREEN MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Ambient Background Element */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="w-[150vw] h-[150vw] bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,transparent_60%)] filter blur-[150px]"></div>
            </div>

            <div className="relative z-10 h-16 md:h-20 max-w-[95%] mx-auto w-full px-4 flex items-center justify-between border-b border-white/5">
              {/* Logo Matches Home Page Styling */}
              <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-xl md:text-2xl font-heading font-black tracking-tight text-white hover:text-gray-300 transition-colors">
                KS
              </a>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-white hover:text-gray-400 transition-colors group"
              >
                <span className="font-heading font-bold tracking-widest uppercase text-xs group-hover:-translate-x-1 transition-transform">CLOSE</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="group-hover:rotate-90 transition-transform duration-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <nav className="relative z-10 flex-1 flex flex-col items-center justify-center gap-1 md:gap-3 px-4">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.path;
                return (
                  <motion.a 
                    initial={{ opacity: 0, y: 30, rotateX: -20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: 0.1 + (i * 0.1), duration: 0.5, ease: "easeOut" }}
                    key={link.name} 
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="relative group flex items-center justify-center"
                  >
                    <span 
                      className={`text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-heading font-black tracking-tighter uppercase transition-all duration-500 ${
                        isActive 
                          ? 'text-white' 
                          : 'text-transparent group-hover:text-white'
                      }`}
                      style={!isActive ? { WebkitTextStroke: '1px rgba(255,255,255,0.2)' } : {}}
                    >
                      {link.name}
                    </span>
                    
                    {/* Hover indicator line */}
                    <span className="absolute -left-6 md:-left-10 w-0 h-[2px] bg-white top-1/2 -translate-y-1/2 group-hover:w-4 md:group-hover:w-6 transition-all duration-500 opacity-0 group-hover:opacity-100 hidden sm:block"></span>
                  </motion.a>
                );
              })}
            </nav>
            
            <div className="relative z-10 py-4 md:py-6 flex justify-center gap-6 md:gap-10 border-t border-white/5">
               <a href="#" className="text-gray-500 hover:text-white transition-colors font-heading font-bold uppercase tracking-widest text-[10px] md:text-xs">Instagram</a>
               <a href="#" className="text-gray-500 hover:text-white transition-colors font-heading font-bold uppercase tracking-widest text-[10px] md:text-xs">Spotify</a>
               <a href="#" className="text-gray-500 hover:text-white transition-colors font-heading font-bold uppercase tracking-widest text-[10px] md:text-xs">YouTube</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
