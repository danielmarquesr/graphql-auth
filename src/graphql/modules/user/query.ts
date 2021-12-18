import { Resolvers } from 'src/generated/graphql';
import { validateAuth } from 'src/utils';

const query: Resolvers = {
  Query: {
    Users: async (_parent, _args, { req, prisma }) => {
      validateAuth(req);
      const users = await prisma.user.findMany();
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
