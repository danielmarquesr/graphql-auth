import { Prisma, PrismaClient } from '@prisma/client';

export class DBClient {
  private static instance: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;

  constructor() {
    if (!DBClient.instance) {
      DBClient.instance = new PrismaClient();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getInstance() {
    return DBClient.instance;
  }
}

export const getDBClient = () => new DBClient().getInstance();
