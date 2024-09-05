import type { Request, Response } from 'express';

import z from 'zod';

import prisma from '../../../lib/db/prisma';
import getAccessToken from '../../../lib/api/twitch/getAccessToken';
import getUser from '../../../lib/api/twitch/getUser';

const QuerySchema = z.object({
  code: z.string().regex(/^[A-za-z0-9]+$/),
});

async function handleTwitchCallback(req: Request, res: Response) {
  try {
    const { code } = QuerySchema.parse(req.query);

    const token = await getAccessToken(code);
    if (!token)
      return res
        .status(500)
        .send('Something went wrong while trying to get the access token');

    const expiresAt = new Date(Date.now() + token.expiresIn * 1000);

    const user = await getUser(token.accessToken);
    if (!user)
      return res
        .status(500)
        .send('Something went wrong while trying to get the Twitch user');

    await prisma.twitchCredential.deleteMany();

    await prisma.twitchCredential.create({
      data: {
        username: user.username,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresAt,
      },
    });

    res.send('Everything went well. You can close now this tab.');
  } catch {
    res.status(400).send('Bad Request');
  }
}

export default handleTwitchCallback;
