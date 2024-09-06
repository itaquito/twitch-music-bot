import z from 'zod';

import getRedirectUri from '../../oauth/spotify/getRedirectUri';
import getAppAuthorizationToken from '../../oauth/spotify/getAppAuthorizationToken';

const ResponseSchema = z.object({
  access_token: z.string().regex(/^[A-za-z0-9-_]+$/),
  refresh_token: z.string().regex(/^[A-za-z0-9-_]+$/),
  expires_in: z.number(),
});

async function getAccessToken(code: string) {
  try {
    const redirectUrl = getRedirectUri();
    const authorizationToken = getAppAuthorizationToken();

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authorizationToken}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        redirect_uri: redirectUrl,
        code,
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
      `[!] Something went wrong while trying to get the access token: ${error}`
    );

    return null;
  }
}

export default getAccessToken;
