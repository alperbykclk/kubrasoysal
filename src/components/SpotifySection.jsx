import React, { useEffect, useState } from 'react';

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

  return (
    <section className="w-full bg-[#0a0a0a] py-24 px-4 border-t border-white/5 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-green-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <svg className="w-8 h-8 text-green-500 mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zM19.32 9.6c-4.2-2.461-11.28-2.7-15.48-1.5-.6.18-1.2-.181-1.38-.781-.18-.6.18-1.2.78-1.38 4.8-1.321 12.6-.96 17.52 1.92.54.3.72.96.42 1.5-.24.6-.9.78-1.44.48z" />
          </svg>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-widest">
            Kübra's Rotation
          </h2>
          <p className="text-gray-400 mt-4 max-w-lg uppercase tracking-widest text-sm">
            {data.isPlaying ? "Şu an canlı dinleniyor" : "Son dinlenen parçalar"}
          </p>
        </div>

        {data.isPlaying && data.currentTrack && (
          <div className="mb-16">
            <a 
              href={data.currentTrack.songUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col md:flex-row items-center gap-8 bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors duration-500 group max-w-3xl mx-auto"
            >
              <div className="relative">
                <img 
                  src={data.currentTrack.albumImageUrl} 
                  alt={data.currentTrack.album} 
                  className="w-40 h-40 md:w-48 md:h-48 rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute -top-3 -right-3 flex items-center gap-2 bg-green-500 text-black px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider animate-pulse shadow-lg">
                  <div className="w-2 h-2 bg-black rounded-full animate-ping"></div>
                  Canlı
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-green-400 text-sm font-bold uppercase tracking-widest mb-2">NOW PLAYING</p>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{data.currentTrack.title}</h3>
                <p className="text-xl text-gray-300 mb-4">{data.currentTrack.artist}</p>
                <span className="inline-block border border-white/20 px-6 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors duration-300">
                  Spotify'da Aç
                </span>
              </div>
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.recentTracks.map((track, idx) => (
            <a 
              key={idx}
              href={track.songUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center p-6 bg-black border border-white/5 rounded-2xl hover:border-white/20 hover:bg-white/5 transition-all duration-300 group"
            >
              <img 
                src={track.albumImageUrl} 
                alt={track.album} 
                className="w-32 h-32 rounded-lg shadow-lg mb-4 group-hover:-translate-y-2 group-hover:shadow-green-500/20 transition-all duration-300" 
              />
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Son Dinlenen</p>
              <h4 className="text-lg font-bold text-white mb-1 line-clamp-1">{track.title}</h4>
              <p className="text-sm text-gray-400 line-clamp-1">{track.artist}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
