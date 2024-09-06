import getToken from '../db/twitchCredential/getToken';

async function getPassword() {
  const accessToken = await getToken();

  return `oauth:${accessToken}`;
}

export default getPassword;
