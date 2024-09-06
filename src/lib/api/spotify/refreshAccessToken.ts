import z from 'zod';

import getAppAuthorizationToken from '../../oauth/spotify/getAppAuthorizationToken';

const ResponseSchema = z.object({
  access_token: z.string().regex(/^[A-za-z0-9-_]+$/),
  refresh_token: z
    .string()
    .regex(/^[A-za-z0-9-_]+$/)
    .optional(),
  expires_in: z.number(),
});

async function refreshAccessToken(refreshToken: string) {
  try {
    const appId = process.env.SPOTIFY_APP_ID;
    if (!appId) throw new Error('Missing SPOTIFY_APP_ID');

    const appSecret = process.env.SPOTIFY_APP_SECRET;
    if (!appSecret) throw new Error('Missing SPOTIFY_APP_SECRET');

    const authorizationToken = getAppAuthorizationToken();

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authorizationToken}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: appId,
      }),
    });

    if (!res.ok) throw new Error("Response wasn't OK");

    const json = await res.json();
    console.log(json);
    const { access_token, refresh_token, expires_in } =
      ResponseSchema.parse(json);

    return {
      accessToken: access_token,
      refreshToken: refresh_token || refreshToken,
      expiresIn: expires_in,
    };
  } catch (error) {
    console.error(
      `[!] Something went wrong while trying to refresh the access token: ${error}`
    );

    return null;
  }
}

export default refreshAccessToken;
