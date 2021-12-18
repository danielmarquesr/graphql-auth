import { PrismaClient } from '@prisma/client';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import resolvers from 'src/graphql/resolvers';
import typeDefs from 'src/graphql/typeDefs';
import { verifyTokenJWT } from 'src/middleware';

const { PORT, NODE_ENV } = process.env;

const app = express();

app.use(express.json());

app.use('/ping', (_req, res) => res.json({ msg: 'pong!' }));

const prisma = new PrismaClient();

// to kill prisma on ts-node-dev reload
process.on('SIGTERM', () => process.exit());

app.use(
  '/graphql',
  (req, res, next) => verifyTokenJWT(req, res, next, prisma),
  graphqlHTTP((req) => ({
    schema: makeExecutableSchema({ resolvers, typeDefs }),
    graphiql: NODE_ENV === 'development',
    pretty: true,
    context: { req, prisma },
    customFormatErrorFn: (error) => ({
      message: error.message,
      name: error.name,
      timestamp: new Date(),
    }),
  }))
);

app.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`\n🚀 GraphQL server ready at http://localhost:${PORT}/graphql\n`)
);
