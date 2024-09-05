import type { Request, Response } from 'express';

import z from 'zod';

import prisma from '../../../lib/db/prisma';
import getAccessToken from '../../../lib/api/spotify/getAccessToken';

const QuerySchema = z.object({
  code: z.string().regex(/^[A-za-z0-9-_]+$/),
});

async function handleSpotifyCallback(req: Request, res: Response) {
  try {
    const { code } = QuerySchema.parse(req.query);

    const token = await getAccessToken(code);
    if (!token)
      return res
        .status(500)
        .send('Something went wrong while trying to get the access token');

    const expiresAt = new Date(Date.now() + token.expiresIn * 1000);

    await prisma.spotifyCredential.deleteMany();

    await prisma.spotifyCredential.create({
      data: {
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

export default handleSpotifyCallback;
