import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SpotifySection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const interval = setInterval(fetchSpotify, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data || (!data.isPlaying && data.recentTracks.length === 0)) {
    return null;
  }

  // Determine what to show in the "Big" block
  const isLive = data.isPlaying && data.currentTrack;
  const bigTrack = isLive ? data.currentTrack : data.recentTracks[0];
  
  // Determine what to show in the small blocks below
  // If playing live, show first 3 recent. If not playing live, show recent tracks 1 to 3 (since 0 is in the big block)
  const smallTracks = isLive ? data.recentTracks.slice(0, 3) : data.recentTracks.slice(1, 4);

  return (
    <section className="w-full bg-[#0a0a0a] py-16 px-4 border-t border-white/5 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-green-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <svg className="w-6 h-6 text-green-500 mb-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zM19.32 9.6c-4.2-2.461-11.28-2.7-15.48-1.5-.6.18-1.2-.181-1.38-.781-.18-.6.18-1.2.78-1.38 4.8-1.321 12.6-.96 17.52 1.92.54.3.72.96.42 1.5-.24.6-.9.78-1.44.48z" />
          </svg>
          <h2 className="text-2xl md:text-4xl font-heading font-black text-white uppercase tracking-widest">
            Kübra's Rotation
          </h2>
        </div>

        {bigTrack && (
          <div className="mb-10">
            <a 
              href={bigTrack.songUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col md:flex-row items-center gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-500 group max-w-2xl mx-auto"
            >
              <div className="relative">
                <img 
                  src={bigTrack.albumImageUrl} 
                  alt={bigTrack.album} 
                  className={`w-28 h-28 md:w-36 md:h-36 rounded-xl shadow-2xl transition-transform duration-500 object-cover ${!isLive && 'grayscale group-hover:grayscale-0'}`} 
                />
                {isLive ? (
                  <div className="absolute -top-3 -right-3 flex items-center gap-2 bg-green-500 text-black px-2 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider animate-pulse shadow-lg">
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></div>
                    Canlı
                  </div>
                ) : (
                  <div className="absolute -top-3 -right-3 flex items-center gap-2 bg-gray-600 text-white px-2 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-lg">
                    Geçmiş
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className={`${isLive ? 'text-green-400' : 'text-gray-400'} text-xs font-bold uppercase tracking-widest mb-1`}>
                  {isLive ? 'NOW PLAYING' : 'LAST LISTENED'}
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight group-hover:text-green-400 transition-colors">{bigTrack.title}</h3>
                <p className="text-sm md:text-base text-gray-300 mb-3">{bigTrack.artist}</p>
                <span className="inline-block border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-white hover:text-black transition-colors duration-300">
                  Spotify'da Aç
                </span>
              </div>
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <AnimatePresence mode="popLayout">
            {smallTracks.map((track) => (
              <motion.a 
                layout
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, type: 'spring' }}
                key={track.playedAt || track.songUrl}
                href={track.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row items-center gap-4 p-4 bg-black border border-white/5 rounded-xl hover:border-white/20 hover:bg-white/5 transition-all duration-300 group"
              >
                <img 
                  src={track.albumImageUrl} 
                  alt={track.album} 
                  className="w-16 h-16 rounded-md shadow-lg group-hover:scale-105 transition-all duration-300 object-cover" 
                />
                <div className="flex-1 text-left">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Son Dinlenen</p>
                  <h4 className="text-sm font-bold text-white mb-0.5 line-clamp-1 group-hover:text-green-400 transition-colors">{track.title}</h4>
                  <p className="text-xs text-gray-400 line-clamp-1">{track.artist}</p>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
