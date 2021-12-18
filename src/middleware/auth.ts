import { PrismaClient, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';

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
      throw new Error('JWT token was not found in request headers');

    const token = authorization!.replace('Bearer ', '');

    const { SECRET } = process.env;
    const decoded = verify(token, SECRET!) as Payload;

    if (!decoded?.id) throw new Error('Invalid token');

    const userFound = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!userFound) throw new Error("User don't found");

    req.user = userFound;
  } catch (error) {
    req.error = error as Error;
  } finally {
    next();
  }
};
