import { Request } from 'express';
import { PrismaClient } from '@prisma/client';

export interface Context {
  req: Request;
  prisma: PrismaClient;
}
