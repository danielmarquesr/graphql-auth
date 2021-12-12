import { makeExecutableSchema } from '@graphql-tools/schema';
import express, { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import resolvers from 'src/graphql/resolvers';
import typeDefs from 'src/graphql/typeDefs';

// to kill prisma on ts-node-dev reload
process.on('SIGTERM', () => process.exit());

const app = express();

app.use(express.json());

app.use('/ping', (_req: Request, res: Response) =>
  res.status(200).send({ msg: 'pong!', time: new Date() })
);

const schema = makeExecutableSchema({ resolvers, typeDefs });

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
    pretty: true,
  })
);

const { PORT } = process.env;
app.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`\n🚀 GraphQL server ready at http://localhost:${PORT}/graphql\n`)
);
