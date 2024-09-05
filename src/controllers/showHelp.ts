import type { Request, Response } from 'express';

function showHelp(req: Request, res: Response) {
  res.send(`
    Login Twitch: <a href="/auth/portal/twitch">/auth/portal/twitch</a>  
  `);
}

export default showHelp;
