import { PrismaClient, User } from '@prisma/client';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const { user } = new PrismaClient();

export default {
  Mutation: {
    CreateUser: async (
      _parent: any,
      {
        input,
      }: {
        input: {
          name: User['name'];
          email: User['email'];
          password: User['password'];
        };
      }
    ) => {
      const passwordHashed = await hash(input.password, 10);
      const data = { ...input, password: passwordHashed, id: uuidv4() };
      const userCreated = await user.create({ data });
      return userCreated;
    },
  },
};
