import tmi from 'tmi.js';

import prisma from './lib/db/prisma';
import getPassword from './lib/tmi/getPassword';
import handlePlayCommand from './commands/play';

async function main() {
  const commandPrefix = process.env.TWITCH_COMMAND_PREFIX;
  if (!commandPrefix) throw new Error('Missing TWITCH_COMMAND_PREFIX');

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
    if (self || !message.startsWith(commandPrefix)) return;

    const command = message.slice(commandPrefix.length).split(' ')[0].trim();
    const args = message
      .slice(commandPrefix.length + command.length + 1)
      .trim();

    if (command === 'play') handlePlayCommand(client, channel, args);
  });
}

main();
