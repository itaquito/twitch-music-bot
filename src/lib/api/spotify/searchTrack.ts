import z from 'zod';

import getToken from '../../db/spotifyCredential/getToken';

const ResponseSchema = z.object({
  tracks: z.object({
    items: z.array(
      z.object({
        uri: z.string(),
        name: z.string(),
        artists: z.array(
          z.object({
            name: z.string(),
          })
        ),
      })
    ),
  }),
});

async function searchTrack(searchQuery: string) {
  try {
    const accessToken = await getToken();

    const url = new URL('https://api.spotify.com/v1/search');

    url.searchParams.append('q', searchQuery);
    url.searchParams.append('type', 'track');
    url.searchParams.append('limit', '1');
    url.searchParams.append('market', 'MX');

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok)
      throw new Error(`Response was not ok: ${res.status}: ${res.statusText}`);

    const json = await res.json();
    const data = ResponseSchema.parse(json);

    const track = data.tracks.items[0];
    if (!track) return null;

    const artist = track.artists[0]?.name || 'Sin artista';

    return {
      uri: track.uri,
      name: track.name,
      artist,
    };
  } catch (error) {
    console.error(
      `[!] Something went wrong while trying to search a song: ${error}`
    );
    return null;
  }
}

export default searchTrack;
