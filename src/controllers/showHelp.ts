import type { Request, Response } from 'express';

function showHelp(req: Request, res: Response) {
  res.send(`
    Login Twitch: <a href="/auth/portal/twitch">/auth/portal/twitch</a>
    <br />
    Login Spotify: <a href="/auth/portal/spotify">/auth/portal/spotify</a>
  `);
}

export default showHelp;
