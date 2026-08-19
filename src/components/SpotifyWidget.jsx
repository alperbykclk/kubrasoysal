import React, { useEffect, useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function SpotifyWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: cmsData } = useCMS();
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const response = await fetch('/api/spotify');
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching Spotify data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotify();
    const interval = setInterval(fetchSpotify, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      const section = document.getElementById('spotify-section');
      if (section) {
        const rect = section.getBoundingClientRect();
        // If the section is in the viewport (even partially)
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setIsSectionVisible(true);
        } else {
          setIsSectionVisible(false);
        }
      } else {
        setIsSectionVisible(false);
      }
    };

    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    checkScroll(); // Initial check
    
    // Also check periodically in case the section is rendered later
    const interval = setInterval(checkScroll, 1000);

    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      clearInterval(interval);
    };
  }, []);

  if (loading || !data) return null;

  // The user requested that it ONLY shows when she is currently listening!
  const isLive = data.isPlaying && data.currentTrack;
  
  const showWidget = isLive && !isSectionVisible;

  return (
    <AnimatePresence>
      {showWidget && (
        <motion.button 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.4, type: 'spring' }}
          onClick={() => document.getElementById('spotify-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:bg-black transition-colors duration-300 group shadow-2xl text-left"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="flex flex-col max-w-[150px] sm:max-w-[200px]">
            <p className="text-[10px] font-bold uppercase tracking-widest leading-tight text-green-500">
              NOW PLAYING
            </p>
            <p className="text-sm font-semibold text-white truncate leading-tight group-hover:text-green-400 transition-colors">
              {data.currentTrack.title}
            </p>
            <p className="text-xs text-gray-300 truncate leading-tight">
              {data.currentTrack.artist}
            </p>
          </div>

          {data.currentTrack.albumImageUrl && (
            <img 
              src={data.currentTrack.albumImageUrl} 
              alt={data.currentTrack.album} 
              className="w-10 h-10 rounded-full ml-2 border border-white/20 group-hover:scale-110 transition-transform duration-300"
            />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
