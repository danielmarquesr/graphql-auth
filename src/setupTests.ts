import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import prisma from '../prisma/client';

jest.mock('../prisma/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('uuid-mock-test'),
}));

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn().mockReturnValue('hashed-mock-password'),
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
