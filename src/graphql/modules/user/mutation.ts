import { PrismaClient, User } from '@prisma/client';
import { hashSync, compareSync } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export default {
  Mutation: {
    SignUp: async (
      _parent: any,
      {
        input,
      }: {
        input: {
          name: User['name'];
          email: User['email'];
          password: User['password'];
        };
      },
      { prisma }: { prisma: PrismaClient }
    ) => {
      const password = hashSync(input.password, SALT_ROUNDS);
      const data = { ...input, password, id: uuidv4() };
      const userCreated = await prisma.user.create({ data });
      return userCreated;
    },
    SignIn: async (
      _parent: any,
      {
        input: { email, password },
      }: {
        input: {
          email: User['email'];
          password: User['password'];
        };
      },
      { prisma }: { prisma: PrismaClient }
    ) => {
      const userFound = await prisma.user.findUnique({
        where: { email },
      });

      if (!userFound || !compareSync(password, userFound.password))
        throw new Error('Incorrect email or password');

      const token = sign({ id: userFound.id }, process.env.SECRET!, {
        algorithm: 'HS256',
        expiresIn: '90d',
      });

      return { token };
    },
  },
};
