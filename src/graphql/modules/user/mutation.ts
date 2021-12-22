import { v4 as uuidv4 } from 'uuid';
import { Resolvers } from 'src/generated/graphql';
import { userSchema } from 'src/validations/schema';
import { comparePassword, hashPassowrd, signInUser } from 'src/utils/hash';

const mutation: Resolvers = {
  Mutation: {
    SignUp: async (_parent, { input }, { prisma }) => {
      userSchema.validateSync(input, { abortEarly: false });

      const hashed = hashPassowrd(input.password);
      const data = { ...input, password: hashed, id: uuidv4() };
      const userCreated = await prisma.user.create({ data });
      return userCreated;
    },
    SignIn: async (_parent, { input: { email, password } }, { prisma }) => {
      const userFound = await prisma.user.findUnique({
        where: { email },
      });

      if (!userFound || !comparePassword(password, userFound.password))
        throw new Error('Incorrect email or password');

      const token = signInUser({ id: userFound.id });

      return { token };
    },
  },
};

export default mutation;
