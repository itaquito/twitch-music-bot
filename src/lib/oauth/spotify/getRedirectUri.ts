function getRedirectUri() {
  const origin = process.env.AUTH_ORIGIN;
  if (!origin) throw new Error('Missing AUTH_ORIGIN');

  return `${origin}/auth/callback/spotify`;
}

export default getRedirectUri;
