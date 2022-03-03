import * as yup from 'yup';

export const userSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required()
    .test(
      'ValidationError',
      'email has already been taken',
      async (email, context) => {
        const prisma = context.options.context?.prisma;
        const userAlreadyExist = await prisma.user.findUnique({
          where: { email },
        });
        return !userAlreadyExist;
      }
    ),
  password: yup.string().min(8).max(50).required(),
  firstName: yup.string().min(2).max(60).required(),
  lastName: yup.string().min(2).max(60).required(),
});
