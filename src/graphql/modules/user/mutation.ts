import { v4 as uuidv4 } from 'uuid';
import { Resolvers } from 'src/generated/graphql';
import { userSchema } from 'src/validations/userSchema';
import {
  comparePassword,
  generateHashSHA256,
  hashPassowrd,
  signInUser,
} from 'src/utils';
import { addMinutes } from 'date-fns';
import { sendConfirmationEmail } from 'src/mail/confirmationEmail';

const mutation: Resolvers = {
  Mutation: {
    SignUp: async (_parent, { input }, { prisma }) => {
      await userSchema.validate(input, {
        abortEarly: false,
        context: { prisma },
      });

      const hashed = hashPassowrd(input.password);
      const userCreated = await prisma.user.create({
        data: { ...input, password: hashed, id: uuidv4() },
      });

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

      sendConfirmationEmail(userCreated.email, confirmationToken.token);

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
        select: { id: true, confirmedAt: true, user: true },
        where: {
          token,
          AND: {
            OR: [
              { expiredAt: { gte: now } },
              { expiredAt: { equals: null }, NOT: { confirmedAt: null } },
            ],
          },
        },
        rejectOnNotFound: true,
      });

      const { confirmedAt, user, id } = confirmationToken;
      if (confirmedAt && user.isEmailConfirmed) return user;

      const newConfirmationToken = await prisma.confirmationToken.update({
        select: { user: true },
        where: { id },
        data: {
          confirmedAt: now,
          user: { update: { isEmailConfirmed: true } },
        },
      });

      return newConfirmationToken.user;
    },
  },
};

export default mutation;
