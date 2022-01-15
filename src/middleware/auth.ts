import { PrismaClient, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import { AuthError } from 'src/utils';

interface Payload extends JwtPayload {
  id?: User['id'];
}

export const verifyTokenJWT = async (
  req: Request,
  _res: Response,
  next: NextFunction,
  prisma: PrismaClient
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization)
      throw new AuthError('JWT token was not found in request headers');

    const token = authorization.replace('Bearer ', '');

    const { SECRET } = process.env;
    const decoded = verify(token, SECRET || 'some-real-secret') as Payload;

    if (!decoded?.id) throw new AuthError('Invalid token');

    const userFound = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!userFound) throw new AuthError("User don't found");

    req.user = userFound;
  } catch (error) {
    req.error = error as AuthError;
  } finally {
    next();
  }
};
