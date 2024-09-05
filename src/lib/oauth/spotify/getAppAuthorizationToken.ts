function getAppAuthorizationToken() {
  const appId = process.env.SPOTIFY_APP_ID;
  if (!appId) throw new Error('Missing SPOTIFY_APP_ID');

  const appSecret = process.env.SPOTIFY_APP_SECRET;
  if (!appSecret) throw new Error('Missing SPOTIFY_APP_SECRET');

  return Buffer.from(`${appId}:${appSecret}`).toString('base64');
}

export default getAppAuthorizationToken;
