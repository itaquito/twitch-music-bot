import getRedirectUri from './getRedirectUri';

function getAuthorizationLink() {
  const appId = process.env.TWITCH_APP_ID;
  if (!appId) throw new Error('Missing TWITCH_APP_ID');

  const redirectUri = getRedirectUri();
  const url = new URL('https://id.twitch.tv/oauth2/authorize');

  url.searchParams.append('client_id', appId);
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('force_verify', 'true');
  url.searchParams.append('scope', 'chat:read chat:edit');

  return url.toString();
}

export default getAuthorizationLink;
