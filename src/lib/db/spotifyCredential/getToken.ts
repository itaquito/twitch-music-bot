import prisma from '../prisma';
import refreshAccessToken from '../../api/spotify/refreshAccessToken';

async function getToken() {
  const spotifyCredential = await prisma.spotifyCredential.findFirst({
    select: {
      id: true,
      accessToken: true,
      refreshToken: true,
      expiresAt: true,
    },
  });
  if (!spotifyCredential)
    throw new Error('No Spotify credentials found. Run the auth script first.');

  // The access token is still valid
  if (spotifyCredential.expiresAt > new Date())
    return spotifyCredential.accessToken;

  console.log('[!] Refreshing the access token of Spotify...');

  const token = await refreshAccessToken(spotifyCredential.refreshToken);
  if (!token)
    throw new Error('Something went wrong while refreshing the token');

  const expiresAt = new Date(Date.now() + token.expiresIn * 1000);

  await prisma.spotifyCredential.update({
    where: { id: spotifyCredential.id },
    data: {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt,
    },
  });

  return token.accessToken;
}

export default getToken;
