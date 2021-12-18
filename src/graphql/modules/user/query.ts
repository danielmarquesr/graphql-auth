import { User, PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { validateAuth } from 'src/utils';

export default {
  Query: {
    Users: async (
      _source: any,
      _args: any,
      { req, prisma }: { req: Request; prisma: PrismaClient }
    ) => {
      validateAuth(req);

      const users = await prisma.user.findMany();
      return users;
    },
    User: async (
      _source: any,
      { id }: { id: User['id'] },
      { req, prisma }: { req: Request; prisma: PrismaClient }
    ) => {
      validateAuth(req);

      const userFound = await prisma.user.findUnique({ where: { id } });

      if (!userFound) throw new Error('User not found!');

      return userFound;
    },
    CurrentUser: async (
      _source: any,
      _args: any,
      { req }: { req: Request }
    ) => {
      const currentUser = validateAuth(req);
      return currentUser;
    },
  },
};
