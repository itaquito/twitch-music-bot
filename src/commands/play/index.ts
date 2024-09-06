import type { ChatUserstate, Client } from 'tmi.js';

import searchTrack from '../../lib/api/spotify/searchTrack';
import addTrackToPlaybackQueue from '../../lib/api/spotify/addTrackToPlaybackQueue';

async function handlePlayCommand(
  client: Client,
  channel: string,
  tags: ChatUserstate,
  args: string
) {
  if (!args)
    return client.say(
      channel,
      `@${tags.username} Uso: !play <canción> <artista>`
    );

  const track = await searchTrack(args);

  if (!track)
    return client.say(
      channel,
      `@${tags.username} No encontré la canción que buscas.`
    );

  await addTrackToPlaybackQueue(track.uri);

  client.say(
    channel,
    `@${tags.username} Se ha añadido a la cola "${track.name}" por ${track.artist}`
  );
}

export default handlePlayCommand;
