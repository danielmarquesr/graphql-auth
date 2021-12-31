import { Request } from 'express';

export const validateAuth = (req: Request) => {
  const { user, error } = req;

  if (error) throw error;

  if (!user) throw new Error("Can't get the user from request");

  if (!user.isEmailConfirmed) throw new Error("User email isn't confirmed");

  return user;
};
