import { Resolvers } from 'src/generated/graphql';
import { validateAuth } from 'src/utils';

const query: Resolvers = {
  Query: {
    Users: async (_source, _args, { req, prisma }) => {
      validateAuth(req);
      const users = await prisma.user.findMany();
      return users;
    },
    User: async (_source, { id }, { req, prisma }) => {
      validateAuth(req);
      const userFound = await prisma.user.findUnique({ where: { id } });
      if (!userFound) throw new Error('User not found!');
      return userFound;
    },
    CurrentUser: (_source, _args, { req }) => {
      const currentUser = validateAuth(req);
      return currentUser;
    },
  },
};

export default query;
