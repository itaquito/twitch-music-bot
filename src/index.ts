import tmi from 'tmi.js';

import prisma from './lib/db/prisma';
import getPassword from './lib/tmi/getPassword';

async function main() {
  const twitchCredential = await prisma.twitchCredential.findFirst();
  if (!twitchCredential)
    throw new Error('No Twitch credentials found. Run the auth script first.');

  const client = new tmi.Client({
    options: { debug: true },
    connection: { reconnect: true },
    identity: {
      username: twitchCredential.username,
      password: () =>
        getPassword(
          twitchCredential.username,
          twitchCredential.accessToken,
          twitchCredential.refreshToken,
          twitchCredential.expiresAt
        ),
    },
    channels: [twitchCredential.username],
  });

  client.connect();

  client.on('message', (channel, tags, message, self) => {
    if (self) return;

    console.log(`${tags['display-name']}: ${message}`);
    client.say(channel, `You sent: ${message}`);
  });
}

main();
