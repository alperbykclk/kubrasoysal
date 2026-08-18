import React, { useEffect, useState } from 'react';

export default function SpotifyWidget() {
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
    // Refresh every 5 seconds for near-instant updates
    const interval = setInterval(fetchSpotify, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) return null;

  const isLive = data.isPlaying && data.currentTrack;
  
  // Try to get track from API, then localStorage, then hardcoded fallback
  let offlineTrack = data.recentTracks?.[0];
  if (!offlineTrack && typeof window !== 'undefined') {
     const savedStr = localStorage.getItem('spotify_local_history');
     if (savedStr) {
        const savedHist = JSON.parse(savedStr);
        if (savedHist && savedHist.length > 0) offlineTrack = savedHist[0];
     }
  }

  const fallbackTrack = {
    title: "KÜBRA SOYSAL",
    artist: "Listen on Spotify",
    albumImageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    songUrl: "https://open.spotify.com/search/Kübra%20Soysal"
  };

  const track = isLive ? data.currentTrack : (offlineTrack || fallbackTrack);

  return (
    <button 
      onClick={() => document.getElementById('spotify-section')?.scrollIntoView({ behavior: 'smooth' })}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:bg-black transition-colors duration-300 group shadow-2xl text-left"
    >
      <div className="relative flex items-center justify-center">
        {isLive ? (
          <>
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-3 h-3 bg-green-500 rounded-full"></div>
          </>
        ) : (
          <div className="relative w-3 h-3 bg-gray-500 rounded-full"></div>
        )}
      </div>
      
      <div className="flex flex-col max-w-[150px] sm:max-w-[200px]">
        <p className={`text-[10px] font-bold uppercase tracking-widest leading-tight ${isLive ? 'text-green-500' : 'text-gray-500'}`}>
          {isLive ? 'NOW PLAYING' : 'LAST LISTENED'}
        </p>
        <p className="text-sm font-semibold text-white truncate leading-tight group-hover:text-green-400 transition-colors">
          {track.title}
        </p>
        <p className="text-xs text-gray-300 truncate leading-tight">
          {track.artist}
        </p>
      </div>

      {track.albumImageUrl && (
        <img 
          src={track.albumImageUrl} 
          alt={track.album} 
          className={`w-10 h-10 rounded-full ml-2 border border-white/20 group-hover:scale-110 transition-transform duration-300 ${!isLive && 'grayscale hover:grayscale-0'}`}
        />
      )}
    </button>
  );
}
