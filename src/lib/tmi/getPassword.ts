import refreshAccessToken from '../api/twitch/refreshAccessToken';
import prisma from '../db/prisma';

async function getPassword(
  username: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: Date
) {
  // The access token is still valid
  if (expiresAt > new Date()) return `oauth:${accessToken}`;

  console.log('[!] Refreshing the access token...');

  const token = await refreshAccessToken(refreshToken);
  if (!token)
    throw new Error('Something went wrong while refreshing the token');

  const newExpiresAt = new Date(Date.now() + token.expiresIn * 1000);

  await prisma.twitchCredential.deleteMany();

  await prisma.twitchCredential.create({
    data: {
      username: username,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt: newExpiresAt,
    },
  });

  return `oauth:${token.accessToken}`;
}

export default getPassword;
