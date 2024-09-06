import getToken from '../../db/spotifyCredential/getToken';

async function addTrackToPlaybackQueue(trackUri: string) {
  try {
    const accessToken = await getToken();

    const url = new URL('https://api.spotify.com/v1/me/player/queue');

    url.searchParams.append('uri', trackUri);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok)
      throw new Error(`Response was not ok: ${res.status}: ${res.statusText}`);

    return true;
  } catch (error) {
    console.error(
      `[!] Something went wrong while trying to add a song to the playback queue: ${error}`
    );
    return null;
  }
}

export default addTrackToPlaybackQueue;
