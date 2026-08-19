const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=4';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    }),
  });
  return response.json();
};

let globalCachedData = { 
  isPlaying: false, 
  currentTrack: null, 
  recentTracks: [
    {
      title: "Geri Dönme",
      artist: "Kübra Soysal",
      albumImageUrl: "https://i.scdn.co/image/ab67616d0000b273b4ba9e5e7dc55c6543b593eb",
      songUrl: "https://open.spotify.com/track/4WjO0r7lVFTw2c5r5i5XqD",
      playedAt: new Date().toISOString()
    },
    {
      title: "Boşver",
      artist: "Kübra Soysal",
      albumImageUrl: "https://i.scdn.co/image/ab67616d0000b2736e4f3eb7e3d82a392c3a59f5",
      songUrl: "https://open.spotify.com/track/1a2b3c4d5e6f",
      playedAt: new Date().toISOString()
    },
    {
      title: "Gece",
      artist: "Kübra Soysal",
      albumImageUrl: "https://i.scdn.co/image/ab67616d0000b273b4ba9e5e7dc55c6543b593eb",
      songUrl: "https://open.spotify.com/track/1a2b3c4d5e6g",
      playedAt: new Date().toISOString()
    }
  ] 
};

let lastFetchTime = 0;
const CACHE_TTL_MS = 10000;

export default async function handler(req, res) {
  try {
    const now = Date.now();
    if (globalCachedData.recentTracks.length > 0 && (now - lastFetchTime < CACHE_TTL_MS)) {
       res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');
       return res.status(200).json(globalCachedData);
    }

    const { access_token } = await getAccessToken();

    const [nowPlayingRes, recentlyPlayedRes] = await Promise.all([
      fetch(NOW_PLAYING_ENDPOINT, { headers: { Authorization: `Bearer ${access_token}` } }),
      fetch(RECENTLY_PLAYED_ENDPOINT, { headers: { Authorization: `Bearer ${access_token}` } }),
    ]);

    let isPlaying = false;
    let currentTrack = null;

    if (nowPlayingRes.status === 200) {
      const song = await nowPlayingRes.json();
      if (song && song.item !== null) {
        isPlaying = song.is_playing;
        currentTrack = {
          title: song.item.name,
          artist: song.item.artists.map((a) => a.name).join(', '),
          album: song.item.album.name,
          albumImageUrl: song.item.album.images[0].url,
          songUrl: song.item.external_urls.spotify,
        };
      }
    }

    let fetchedRecent = [];
    if (recentlyPlayedRes.status === 200) {
      const recent = await recentlyPlayedRes.json();
      if (recent && recent.items) {
          fetchedRecent = recent.items.map((track) => ({
            title: track.track.name,
            artist: track.track.artists.map((a) => a.name).join(', '),
            albumImageUrl: track.track.album.images[0].url,
            songUrl: track.track.external_urls.spotify,
            playedAt: track.played_at,
          }));
      }
    }
    
    if (fetchedRecent.length > 0) {
      globalCachedData = { isPlaying, currentTrack, recentTracks: fetchedRecent };
      lastFetchTime = now;
    } else {
      globalCachedData.isPlaying = isPlaying;
      globalCachedData.currentTrack = currentTrack;
    }

    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');
    return res.status(200).json(globalCachedData);
  } catch (error) {
    if (globalCachedData && globalCachedData.recentTracks.length > 0) {
        return res.status(200).json(globalCachedData);
    }
    return res.status(500).json({ error: error.message });
  }
}
