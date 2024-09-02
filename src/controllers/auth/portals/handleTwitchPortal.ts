import type { Request, Response } from 'express';

import getAuthorizationLink from '../../../lib/oauth/twitch/getAuthorizationLink';

async function handleTwitchPortal(req: Request, res: Response) {
  const link = getAuthorizationLink();

  res.status(302).redirect(link);
}

export default handleTwitchPortal;
