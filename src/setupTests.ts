import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import * as client from '../prisma/client';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('uuid-mock-test'),
}));

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn((password) => password),
  compareSync: jest.fn((password, hashed) => password === hashed),
}));

jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  sign: jest.fn().mockReturnValue('jwt-token-mock-test'),
}));

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnValue({
      digest: jest.fn().mockReturnValue('hash-example'),
    }),
  }),
}));

jest.spyOn(client, 'getDBClient').mockReturnValue(mockDeep<PrismaClient>());

const prisma = client.getDBClient();
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
