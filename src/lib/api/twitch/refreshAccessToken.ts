import z from 'zod';

import getRedirectUri from '../../oauth/twitch/getRedirectUri';

const ResponseSchema = z.object({
  access_token: z.string().regex(/^[A-za-z0-9]+$/),
  refresh_token: z.string().regex(/^[A-za-z0-9]+$/),
  expires_in: z.number(),
});

async function refreshAccessToken(refreshToken: string) {
  try {
    const appId = process.env.TWITCH_APP_ID;
    if (!appId) throw new Error('Missing TWITCH_APP_ID');

    const appSecret = process.env.TWITCH_APP_SECRET;
    if (!appSecret) throw new Error('Missing TWITCH_APP_SECRET');

    const redirectUrl = getRedirectUri();

    const res = await fetch(`https://id.twitch.tv/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: redirectUrl,
        refresh_token: refreshToken,
      }),
    });

    if (!res.ok) throw new Error("Response wasn't OK");

    const json = await res.json();
    const { access_token, refresh_token, expires_in } =
      ResponseSchema.parse(json);

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
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
