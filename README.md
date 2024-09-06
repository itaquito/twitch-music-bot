# twitch-music-bot

## First time setup

1. Create an application on Twitch and Spotify and save the app IDs and secrets into the `.env` file (See `.env.example` for an example on how the file should look like)

2. Install the dependencies

```
npm install
```

3. Create the database file

```
npm run db
```

4. Run the authentication server

```
npm run auth
```

5. Enter to `localhost:3000` and complete both OAuth flows (Twitch and Spotify).

6. Run the application

```
npm run start
```
