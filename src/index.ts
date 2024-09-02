import 'dotenv/config';

import express from 'express';

const app = express();

app.get('*', (req, res) => {
  res.status(404).send('404 Not found');
});

app.listen(process.env.AUTH_SEVER_PORT, () => {
  console.log(
    `[!] The auth server is running on http://localhost:${process.env.AUTH_SEVER_PORT}`
  );
});
