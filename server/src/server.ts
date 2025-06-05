import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'node:path';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('../client/dist')));
app.use(routes);

app.get('*', (_req, res) => {
  res.sendFile(path.resolve('../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
