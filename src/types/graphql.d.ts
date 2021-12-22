/* eslint-disable no-unused-vars */
import { Request } from 'express';
import { PrismaClient } from '@prisma/client';

declare global {
  interface Error {
    errors?: String[];
  }
}

export interface Context {
  req: Request;
  prisma: PrismaClient;
}
