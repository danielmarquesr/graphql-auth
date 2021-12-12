import { PrismaClient, User } from '@prisma/client';

const { user } = new PrismaClient();

export default {
  Query: {
    Users: async () => {
      const users = await user.findMany();
      return users;
    },
    User: async (_parent: any, { id }: { id: User['id'] }) => {
      const userFound = await user.findUnique({ where: { id } });

      if (!userFound) throw new Error('User not found!');

      return userFound;
    },
  },
};
