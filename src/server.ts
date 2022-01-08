import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import resolvers from 'src/graphql/resolvers';
import typeDefs from 'src/graphql/typeDefs';
import { verifyTokenJWT } from 'src/middleware';
import prisma from '../prisma/client';

const { PORT, NODE_ENV } = process.env;

const app = express();

app.use(express.json());

app.use(cors());

app.use('/ping', (_req, res) => res.json({ msg: 'pong!' }));

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
      name: error.originalError?.name || error.name,
      ...(error.originalError?.errors && {
        errors: error.originalError.errors,
      }),
    }),
  }))
);

app.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`\n🚀 GraphQL server ready at http://localhost:${PORT}/graphql\n`)
);
