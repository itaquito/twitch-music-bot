import type { ChatUserstate, Client } from 'tmi.js';

import getPlaybackQueue from '../../lib/api/spotify/getPlaybackQueue';

const LIMIT = 5;

async function handleQueueCommand(
  client: Client,
  channel: string,
  tags: ChatUserstate,
  args: string
) {
  const queue = await getPlaybackQueue();

  if (!queue)
    return client.say(
      channel,
      `@${tags.username} No se encontraron canciones en la fila`
    );

  let queueText = `@${tags.username} La fila de reproducción actual es: `;

  for (let i = 0; i < queue.length && i < LIMIT; i++) {
    const queueElement = queue[i];

    queueText += `(${i + 1}) "${queueElement.name}" por ${
      queueElement.artist
    } /// `;
  }

  client.say(channel, queueText);
}

export default handleQueueCommand;
