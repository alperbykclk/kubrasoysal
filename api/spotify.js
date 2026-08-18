export const config = {
  runtime: 'edge',
};

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = btoa(`${client_id}:${client_secret}`);
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=3`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

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

export default async function handler(req) {
  try {
    const { access_token } = await getAccessToken();

    // Fetch both in parallel
    const [nowPlayingRes, recentlyPlayedRes] = await Promise.all([
      fetch(NOW_PLAYING_ENDPOINT, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
      fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
    ]);

    let isPlaying = false;
    let currentTrack = null;

    if (nowPlayingRes.status === 200) {
      const song = await nowPlayingRes.json();
      if (song.item !== null) {
        isPlaying = song.is_playing;
        currentTrack = {
          title: song.item.name,
          artist: song.item.artists.map((_artist) => _artist.name).join(', '),
          album: song.item.album.name,
          albumImageUrl: song.item.album.images[0].url,
          songUrl: song.item.external_urls.spotify,
        };
      }
    }

    let recentTracks = [];
    if (recentlyPlayedRes.status === 200) {
      const recent = await recentlyPlayedRes.json();
      recentTracks = recent.items.map((track) => ({
        title: track.track.name,
        artist: track.track.artists.map((_artist) => _artist.name).join(', '),
        albumImageUrl: track.track.album.images[0].url,
        songUrl: track.track.external_urls.spotify,
      }));
    }

    return new Response(
      JSON.stringify({
        isPlaying,
        currentTrack,
        recentTracks,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Only cache for 5 seconds so it updates almost instantly on refresh/polling
          'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10',
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
