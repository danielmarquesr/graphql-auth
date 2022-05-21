import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import express, { json } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLError } from 'graphql';
import resolvers from 'src/graphql/resolvers';
import typeDefs from 'src/graphql/typeDefs';
import { verifyTokenJWT } from 'src/middleware';
import { PORT, NODE_ENV } from 'src/utils';
import { getDBClient } from '../prisma/client';

const app = express();

app.use(json());

app.use(cors());

app.use('/ping', (_req, res) => res.json({ msg: 'pong!' }));

const prisma = getDBClient();

// to kill prisma on ts-node-dev reload
process.on('SIGTERM', () => process.exit());

const customFormatErrorFn = (error: GraphQLError) => ({
  name: error.originalError?.name || error.name,
  message: error.originalError?.message || error.name,
  ...(error.originalError?.errors && {
    errors: error.originalError.errors,
  }),
  ...(error.originalError?.inner && {
    inner: error.originalError.inner,
  }),
});

app.use(
  '/graphql',
  (req, res, next) => verifyTokenJWT(req, res, next, prisma),
  graphqlHTTP((req) => ({
    schema: makeExecutableSchema({ resolvers, typeDefs }),
    graphiql: NODE_ENV === 'development',
    pretty: true,
    context: { req, prisma },
    customFormatErrorFn,
  }))
);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `\n🚀 GraphQL server ready at http://localhost:${PORT}/graphql\n`
  );
});
