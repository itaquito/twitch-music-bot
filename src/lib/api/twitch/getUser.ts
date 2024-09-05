import z from 'zod';

const ResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      login: z.string(),
    })
  ),
});

async function getUser(accessToken: string) {
  try {
    const appId = process.env.TWITCH_APP_ID;
    if (!appId) throw new Error('Missing TWITCH_APP_ID');

    const res = await fetch('https://api.twitch.tv/helix/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': appId,
      },
    });

    if (!res.ok)
      throw new Error(`Response was not ok: ${res.status}: ${res.statusText}`);

    const json = await res.json();
    const { data } = ResponseSchema.parse(json);
    const { login } = data[0];

    return { username: login };
  } catch (error) {
    console.error(
      `[!] Something went wrong while trying to get the Twitch user: ${error}`
    );
    return null;
  }
}

export default getUser;
