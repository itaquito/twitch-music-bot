import getRedirectUri from './getRedirectUri';

function getAuthorizationLink() {
  const appId = process.env.SPOTIFY_APP_ID;
  if (!appId) throw new Error('Missing SPOTIFY_APP_ID');

  const redirectUri = getRedirectUri();
  const url = new URL('https://accounts.spotify.com/authorize');

  url.searchParams.append('client_id', appId);
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('show_dialog', 'true');
  url.searchParams.append(
    'scope',
    'user-read-currently-playing user-read-playback-state user-modify-playback-state'
  );

  return url.toString();
}

export default getAuthorizationLink;
