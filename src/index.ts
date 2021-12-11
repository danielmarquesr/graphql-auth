import express, { Request, Response } from 'express';

const { PORT } = process.env;

const app = express();

app.use(express.json());

app.use('/ping', (_req: Request, res: Response) =>
  res.status(200).send({ msg: 'pong!', time: new Date() })
);

app.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`express server listen on http://localhost:${PORT}`)
);
