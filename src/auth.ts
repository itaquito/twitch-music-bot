import 'dotenv/config';

import express from 'express';

import showHelp from './controllers/showHelp';
import handleTwitchPortal from './controllers/auth/portals/handleTwitchPortal';
import handleSpotifyPortal from './controllers/auth/portals/handleSpotifyPortal';
import handleTwitchCallback from './controllers/auth/callbacks/handleTwitchCallback';

const app = express();

app.use(express.json());

app.get('/', showHelp);

app.get('/auth/portal/twitch', handleTwitchPortal);
app.get('/auth/portal/spotify', handleSpotifyPortal);

app.get('/auth/callback/twitch', handleTwitchCallback);

app.get('*', (req, res) => {
  res.status(404).send('404 Not found');
});

app.listen(process.env.AUTH_SEVER_PORT, () => {
  console.log(
    `[!] The auth server is running on http://localhost:${process.env.AUTH_SEVER_PORT}`
  );
});
