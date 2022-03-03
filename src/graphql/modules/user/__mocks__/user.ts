import { User } from '@prisma/client';

export const usersListMock: User[] = [
  {
    id: 'uuid-mock-test',
    email: 'john@email.com',
    password: 'hashed-mock-password',
    firstName: 'John',
    lastName: 'Anderson',
    isEmailConfirmed: false,
    createdAt: new Date('2021-12-21T15:20:49.751Z'),
    updatedAt: new Date('2021-12-21T15:20:49.751Z'),
  },
  {
    id: 'uuid-mock-test',
    email: 'john2@email.com',
    password: 'hashed-mock-password',
    firstName: 'John',
    lastName: 'Anderson',
    isEmailConfirmed: true,
    createdAt: new Date('2021-12-20T15:20:49.751Z'),
    updatedAt: new Date('2021-12-20T15:20:49.751Z'),
  },
  {
    id: 'uuid-mock-test',
    email: 'john3@email.com',
    password: 'hashed-mock-password',
    firstName: 'John',
    lastName: 'Anderson',
    isEmailConfirmed: true,
    createdAt: new Date('2021-12-19T15:20:49.751Z'),
    updatedAt: new Date('2021-12-19T15:20:49.751Z'),
  },
  {
    id: 'uuid-mock-test',
    email: 'john4@email.com',
    password: 'hashed-mock-password',
    firstName: 'John',
    lastName: 'Anderson',
    isEmailConfirmed: true,
    createdAt: new Date('2021-12-18T15:20:49.751Z'),
    updatedAt: new Date('2021-12-18T15:20:49.751Z'),
  },
];
