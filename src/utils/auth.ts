import { Request } from 'express';

export class AuthError extends Error {
  constructor(...params: string[]) {
    super(...params);
    this.name = 'AuthError';
    if (Error.captureStackTrace) Error.captureStackTrace(this, AuthError);
  }
}

export const validateAuth = (req: Request) => {
  const { user, error } = req;

  if (error) throw error;

  if (!user) throw new AuthError("Can't get the user from request");

  if (!user.isEmailConfirmed) throw new AuthError("User email isn't confirmed");

  return user;
};
