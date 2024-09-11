import z from 'zod';

import getToken from '../../db/spotifyCredential/getToken';

const ReponseSchema = z.object({
  item: z.object({
    name: z.string(),
    artists: z.array(
      z.object({
        name: z.string(),
      })
    ),
  }),
});

async function getCurrentlyPlaying() {
  try {
    const accessToken = await getToken();

    const url = new URL(
      'https://api.spotify.com/v1/me/player/currently-playing'
    );

    url.searchParams.append('market', 'MX');
    url.searchParams.append('additional_types', 'track');

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok)
      throw new Error(`Response was not ok: ${res.status}: ${res.statusText}`);

    const json = await res.json();
    const data = ReponseSchema.parse(json);

    const artist = data.item.artists[0]?.name || 'Sin artista';

    return {
      name: data.item.name,
      artist,
    };
  } catch (error) {
    console.error(
      `[!] Something went wrong while trying to get the currently playing track: ${error}`
    );
    return null;
  }
}

export default getCurrentlyPlaying;
