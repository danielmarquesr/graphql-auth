import { Request } from 'express';

export const validateAuth = (req: Request) => {
  const { user, error } = req;

  if (error) throw error;

  return user;
};
