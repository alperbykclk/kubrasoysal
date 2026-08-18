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
    // Refresh every 30 seconds
    const interval = setInterval(fetchSpotify, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data || !data.isPlaying) {
    return null; // Don't show anything if not playing or loading
  }

  return (
    <a 
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:bg-black transition-colors duration-300 group shadow-2xl"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        <div className="relative w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
      
      <div className="flex flex-col max-w-[150px] sm:max-w-[200px]">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">
          Şu An Dinliyor
        </p>
        <p className="text-sm font-semibold text-white truncate leading-tight group-hover:text-green-400 transition-colors">
          {data.title}
        </p>
        <p className="text-xs text-gray-300 truncate leading-tight">
          {data.artist}
        </p>
      </div>

      {data.albumImageUrl && (
        <img 
          src={data.albumImageUrl} 
          alt={data.album} 
          className="w-10 h-10 rounded-full ml-2 border border-white/20 group-hover:scale-110 transition-transform duration-300"
        />
      )}
    </a>
  );
}
