import z from 'zod';

import getToken from '../../db/spotifyCredential/getToken';

const ReponseSchema = z.object({
  queue: z.array(
    z.object({
      name: z.string(),
      artists: z.array(
        z.object({
          name: z.string(),
        })
      ),
    })
  ),
});

async function getPlaybackQueue() {
  try {
    const accessToken = await getToken();

    const res = await fetch('https://api.spotify.com/v1/me/player/queue', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok)
      throw new Error(`Response was not ok: ${res.status}: ${res.statusText}`);

    const json = await res.json();
    const data = ReponseSchema.parse(json);

    const queue = data.queue.map((track) => {
      const artist = track.artists[0]?.name || 'Sin artista';

      return { name: track.name, artist };
    });

    return queue;
  } catch (error) {
    console.error(
      `[!] Something went wrong while trying to get playback queue: ${error}`
    );
    return null;
  }
}

export default getPlaybackQueue;
