import type { ChatUserstate, Client } from 'tmi.js';

import getCurrentlyPlaying from '../../lib/api/spotify/getCurrentlyPlaying';

async function handleCurrentCommand(
  client: Client,
  channel: string,
  tags: ChatUserstate,
  args: string
) {
  const track = await getCurrentlyPlaying();

  if (!track)
    return client.say(
      channel,
      `@${tags.username} No se encontró la canción actual.`
    );

  client.say(
    channel,
    `@${tags.username} Estás escuchando "${track.name}" por ${track.artist}`
  );
}

export default handleCurrentCommand;
