import type { Request, Response } from 'express';

import z from 'zod';

const QuerySchema = z.object({
  code: z.string().regex(/^[A-za-z0-9]+$/),
});

async function handleTwitchCallback(req: Request, res: Response) {
  try {
    const {code} = QuerySchema.parse(req.query);
    
  } catch {
    res.status(400).send('Bad Request');
  }
}

export default handleTwitchCallback;
