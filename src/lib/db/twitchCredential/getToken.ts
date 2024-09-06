import prisma from '../prisma';
import refreshAccessToken from '../../api/twitch/refreshAccessToken';

async function getToken() {
  const twitchCredential = await prisma.twitchCredential.findFirst({
    select: {
      id: true,
      accessToken: true,
      refreshToken: true,
      expiresAt: true,
    },
  });
  if (!twitchCredential)
    throw new Error('No Twitch credentials found. Run the auth script first.');

  // The access token is still valid
  if (twitchCredential.expiresAt > new Date())
    return twitchCredential.accessToken;

  console.log('[!] Refreshing the access token of Twitch...');

  const token = await refreshAccessToken(twitchCredential.refreshToken);
  if (!token)
    throw new Error('Something went wrong while refreshing the token');

  const expiresAt = new Date(Date.now() + token.expiresIn * 1000);

  await prisma.twitchCredential.update({
    where: { id: twitchCredential.id },
    data: {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt,
    },
  });

  return token.accessToken;
}

export default getToken;
