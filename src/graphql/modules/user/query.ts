import { Resolvers } from 'src/generated/graphql';
import { validateAuth } from 'src/utils';

const LIMIT_DEFAULT = 3;
const SKIP_DEFAULT = 1;

const query: Resolvers = {
  Query: {
    Users: async (_parent, { cursor, limit }, { req, prisma }) => {
      validateAuth(req);
      const users = await prisma.user.findMany({
        ...(cursor && { cursor: { id: cursor }, skip: SKIP_DEFAULT }),
        take: limit || LIMIT_DEFAULT,
      });
      return users;
    },
    User: async (_parent, { id }, { req, prisma }) => {
      validateAuth(req);
      const userFound = await prisma.user.findUnique({ where: { id } });
      return userFound;
    },
    CurrentUser: (_parent, _args, { req }) => {
      const currentUser = validateAuth(req);
      return currentUser;
    },
  },
};

export default query;
