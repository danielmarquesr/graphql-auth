import { hashSync, compareSync } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import { Resolvers } from 'src/generated/graphql';
import { userSchema } from 'src/validations/schema';

const SALT_ROUNDS = 10;

const mutation: Resolvers = {
  Mutation: {
    SignUp: async (_parent, { input }, { prisma }) => {
      userSchema.validateSync(input, { abortEarly: false });

      const hashed = hashSync(input.password, SALT_ROUNDS);
      const data = { ...input, password: hashed, id: uuidv4() };
      const userCreated = await prisma.user.create({ data });
      return userCreated;
    },
    SignIn: async (_parent, { input: { email, password } }, { prisma }) => {
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

export default mutation;
