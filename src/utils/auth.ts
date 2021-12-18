import { Request } from 'express';

export const validateAuth = (req: Request) => {
  const { user, error } = req;

  if (error) throw error;

  if (!user) throw new Error("Wasn't possible to get the current user");

  return user;
};
