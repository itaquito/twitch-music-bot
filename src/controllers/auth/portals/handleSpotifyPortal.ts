import type { Request, Response } from 'express';

import getAuthorizationLink from '../../../lib/oauth/spotify/getAuthorizationLink';

async function handleSpotifyPortal(req: Request, res: Response) {
  const link = getAuthorizationLink();

  res.status(302).redirect(link);
}

export default handleSpotifyPortal;
