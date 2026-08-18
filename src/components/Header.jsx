import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '../context/CMSContext';

const defaultNavLinks = [
  { name: 'Home', path: '#home' },
  { name: 'Music', path: '#music' },
  { name: 'Tour', path: '#tour' },
  { name: 'Media', path: '#media' },
  { name: 'About', path: '#about' },
  { name: 'Contact', path: '#contact' },
];

export default function Header() {
  const { data } = useCMS();
  const navLinks = Array.isArray(data?.navigation) && data.navigation.length > 0 
    ? data.navigation 
    : defaultNavLinks;

  const socials = Array.isArray(data?.contact?.socials) ? data.contact.socials : [
    { name: "Instagram", url: "https://instagram.com/kubrasoysal" },
    { name: "SoundCloud", url: "https://soundcloud.com/kubrasoysal" }
  ];

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
      
      const sections = navLinks
        .map(link => (link.path.startsWith('#') ? link.path.substring(1) : null))
        .filter(Boolean);

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
  }, [navLinks]);

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
                    key={link.name + i} 
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
            
            <div className="relative z-10 py-4 md:py-6 flex flex-wrap justify-center gap-6 md:gap-10 border-t border-white/5">
               {socials.map((s, i) => {
                 const nameStr = (s.name || '').toLowerCase();
                 let Icon = null;
                 if (nameStr.includes('instagram')) {
                   Icon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
                 } else if (nameStr.includes('soundcloud')) {
                   Icon = <svg width="24" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 12h-1m3-2v4m3-5v6m3-8v10m3-8v6m3-5v4m3-3v2"></path><path d="M14 15h6a3 3 0 0 0 0-6h-1.5a5 5 0 0 0-8.5 3"></path></svg>;
                 } else if (nameStr.includes('youtube')) {
                   Icon = <svg width="22" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
                 } else if (nameStr.includes('spotify')) {
                   Icon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.69 14.4c-.19.31-.6.41-.9.23-2.47-1.51-5.58-1.85-9.25-1.02-.35.08-.69-.14-.77-.49-.08-.35.14-.69.49-.77 4.02-.9 7.46-.51 10.21 1.17.29.18.39.58.22.88zm1.26-2.82c-.24.38-.73.5-1.11.26-2.84-1.74-7.18-2.25-9.98-1.23-.42.15-.88-.07-1.03-.49-.15-.42.07-.88.49-1.03 3.25-1.19 8.05-.62 11.37 1.41.37.23.49.72.26 1.08zm.13-2.95C14.65 8.6 8.5 8.4 4.96 9.47c-.52.16-1.06-.14-1.22-.65-.16-.52.14-1.06.65-1.22 4.07-1.23 10.86-1.01 14.93 1.41.47.28.62.9.34 1.37-.28.47-.9.62-1.37.34z"/></svg>;
                 } else if (nameStr.includes('facebook')) {
                   Icon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
                 } else if (nameStr.includes('twitter') || nameStr === 'x') {
                   Icon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;
                 } else {
                   // Fallback for custom labels
                   return (
                     <a key={i} href={s.url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors font-heading font-bold uppercase tracking-widest text-[10px] md:text-xs">
                       {s.name}
                     </a>
                   );
                 }

                 return (
                   <a key={i} href={s.url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors" title={s.name}>
                     {Icon}
                   </a>
                 );
               })}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}