import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '../context/CMSContext';

export default function SpotifySection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: cmsData } = useCMS();

  // Initialize from localStorage safely
  const [localHistory, setLocalHistory] = useState(() => {
    if (typeof window !== 'undefined') {
       const saved = localStorage.getItem('spotify_local_history');
       return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  // Use a ref to access the latest data in the interval callback without triggering re-renders
  const dataRef = useRef(null);

  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const response = await fetch('/api/spotify');
        const json = await response.json();
        
        // Check if track changed to push the old one to history
        const prevData = dataRef.current;
        if (prevData && prevData.isPlaying && prevData.currentTrack) {
           const trackChanged = json.currentTrack 
              ? prevData.currentTrack.songUrl !== json.currentTrack.songUrl
              : true; // It stopped playing
              
           if (trackChanged) {
              setLocalHistory(hist => {
                 const newHist = [prevData.currentTrack, ...hist.filter(t => t.songUrl !== prevData.currentTrack.songUrl)].slice(0, 4);
                 localStorage.setItem('spotify_local_history', JSON.stringify(newHist));
                 return newHist;
              });
           }
        } else if (json.isPlaying && json.currentTrack) {
           // Also save the current track immediately if we don't have history yet
           setLocalHistory(hist => {
              const newHist = [json.currentTrack, ...hist.filter(t => t.songUrl !== json.currentTrack.songUrl)].slice(0, 4);
              localStorage.setItem('spotify_local_history', JSON.stringify(newHist));
              return newHist;
           });
        }
        
        dataRef.current = json;
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

  if (loading || !data) {
    return null;
  }

  // Merge local history with API recent tracks
  let displayRecent = [];
  const combined = [...localHistory, ...data.recentTracks];
  const seen = new Set();
  
  for (const track of combined) {
     if (!seen.has(track.songUrl)) {
        // Exclude the currently playing track from the recent list
        if (!data.isPlaying || !data.currentTrack || data.currentTrack.songUrl !== track.songUrl) {
           seen.add(track.songUrl);
           displayRecent.push(track);
        }
     }
  }

  const isLive = data.isPlaying && data.currentTrack;
  
  // If offline and no recent tracks available, try localStorage, then fallback
  let offlineTrack = displayRecent[0];
  if (!offlineTrack && localHistory.length > 0) {
     offlineTrack = localHistory[0];
  }

  // Create fallbacks from the Music section in CMS
  const musicTracks = (cmsData?.music || []).map(m => ({
     title: m.title,
     artist: m.type || "KÜBRA SOYSAL",
     albumImageUrl: m.image,
     songUrl: m.link
  }));

  const fallbackTrack = musicTracks.length > 0 ? musicTracks[0] : {
     title: "KÜBRA SOYSAL",
     artist: "Spotify Collection",
     albumImageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
     songUrl: "https://open.spotify.com/search/K%C3%BCbra%20Soysal"
  };

  const bigTrack = isLive ? data.currentTrack : (offlineTrack || fallbackTrack);
  
  // If playing live, show first 3. If offline, bigTrack takes displayRecent[0], so show displayRecent[1] to [3]
  let smallTracks = isLive ? displayRecent.slice(0, 3) : displayRecent.slice(1, 4);

  // If we don't have enough small tracks, pad them with fallbacks so the UI doesn't break
  if (smallTracks.length < 3) {
      const needed = 3 - smallTracks.length;
      // Use other tracks from the music catalog to pad
      const paddingTracks = musicTracks.slice(1, 1 + needed);
      
      smallTracks = [...smallTracks, ...paddingTracks];
      
      // If still not 3 (e.g., less than 4 music tracks total), pad with generic
      while (smallTracks.length < 3) {
         smallTracks.push({ 
            ...fallbackTrack, 
            title: `Track ${smallTracks.length + 1}` 
         });
      }
  }

  return (
    <section id="spotify-section" className="w-full bg-[#0a0a0a] py-16 px-4 border-t border-white/5 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-green-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <svg className="w-6 h-6 text-green-500 mb-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zM19.32 9.6c-4.2-2.461-11.28-2.7-15.48-1.5-.6.18-1.2-.181-1.38-.781-.18-.6.18-1.2.78-1.38 4.8-1.321 12.6-.96 17.52 1.92.54.3.72.96.42 1.5-.24.6-.9.78-1.44.48z" />
          </svg>
          <h2 className="text-2xl md:text-4xl font-heading font-black text-white uppercase tracking-widest">
            KÜBRA'S ROTATION
          </h2>
        </div>

        {bigTrack && (
          <div className="mb-10">
            <AnimatePresence mode="wait">
              <motion.a 
                key={bigTrack.songUrl}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                href={bigTrack.songUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col md:flex-row items-center gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-500 group max-w-2xl mx-auto"
              >
                <div className="relative">
                  <img 
                    src={bigTrack.albumImageUrl} 
                    alt={bigTrack.album} 
                    className="w-28 h-28 md:w-36 md:h-36 rounded-xl shadow-2xl transition-transform duration-500 object-cover" 
                  />
                  {isLive ? (
                    <div className="absolute -top-3 -right-3 flex items-center gap-2 bg-green-500 text-black px-2 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider animate-pulse shadow-lg">
                      <div className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></div>
                      LIVE
                    </div>
                  ) : (
                    <div className="absolute -top-3 -right-3 flex items-center gap-2 bg-gray-600 text-white px-2 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-lg">
                      RECENT
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className={`${isLive ? 'text-green-400' : 'text-gray-400'} text-xs font-bold uppercase tracking-widest mb-1`}>
                    {isLive ? 'NOW PLAYING' : 'LAST LISTENED'}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight group-hover:text-green-400 transition-colors">{bigTrack.title}</h3>
                  <p className="text-sm md:text-base text-gray-300 mb-3">{bigTrack.artist}</p>
                  <span className="inline-block border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-white hover:text-black transition-colors duration-300 uppercase tracking-wider">
                    LISTEN ON SPOTIFY
                  </span>
                </div>
              </motion.a>
            </AnimatePresence>
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
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">RECENTLY PLAYED</p>
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
