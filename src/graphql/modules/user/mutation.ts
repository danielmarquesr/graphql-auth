import { v4 as uuidv4 } from 'uuid';
import { Resolvers } from 'src/generated/graphql';
import { userSchema } from 'src/validations/schema';
import {
  comparePassword,
  generateHashSHA256,
  hashPassowrd,
  signInUser,
} from 'src/utils/hash';
import { ConfirmationToken } from '.prisma/client';
import { addMinutes, isAfter } from 'date-fns';
import { sendConfirmationEmail } from 'src/mail/confirmationEmail';

const mutation: Resolvers = {
  Mutation: {
    SignUp: async (_parent, { input }, { prisma }) => {
      userSchema.validateSync(input, { abortEarly: false });

      const hashed = hashPassowrd(input.password);
      const userCreated = await prisma.user.create({
        data: { ...input, password: hashed, id: uuidv4() },
      });

      if (!userCreated?.id) throw new Error("Wasn't possible to create user");

      const id = uuidv4();
      const data = {
        id,
        token: generateHashSHA256({ id }),
        expiredAt: addMinutes(new Date(), 15),
        userId: userCreated.id,
      };

      const confirmationToken = await prisma.confirmationToken.create({
        data,
      });

      if (!confirmationToken?.id)
        throw new Error("Wasn't possible to create confirmation token");

      sendConfirmationEmail(userCreated.email, confirmationToken.token);

      // await prisma.confirmationToken.delete({
      //   where: { id: confirmationToken.id },
      // });
      // await prisma.user.delete({ where: { id: userCreated.id } });

      return userCreated;
    },
    SignIn: async (_parent, { input: { email, password } }, { prisma }) => {
      const userFound = await prisma.user.findUnique({
        where: { email },
      });

      if (!userFound || !comparePassword(password, userFound.password))
        throw new Error('Incorrect email or password');

      if (!userFound.isEmailConfirmed) throw new Error('Need to confirm email');

      const token = signInUser({ id: userFound.id });

      return { token };
    },
    ConfirmEmail: async (_parent, { input: { token } }, { prisma }) => {
      const now = new Date();
      const confirmationToken = await prisma.confirmationToken.findFirst({
        where: {
          token,
          AND: {
            OR: [{ expiredAt: { gte: now } }, { expiredAt: { equals: null } }],
          },
        },
        rejectOnNotFound: true,
      });

      const newConfirmationToken = await prisma.confirmationToken.update({
        where: { id: confirmationToken.id },
        data: {
          confirmedAt: now,
          user: { update: { isEmailConfirmed: true } },
        },
        include: { user: true },
      });

      return newConfirmationToken.user;
    },
  },
};

export default mutation;
