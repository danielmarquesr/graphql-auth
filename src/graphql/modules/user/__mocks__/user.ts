import { User } from '@prisma/client';

export const usersListMock: User[] = [
  {
    id: '6dc7149a-6768-4965-816e-baa1e0a30247',
    email: 'john@email.com',
    password: '$2b$10$SEFMQ.prG.ELKwgOsiAqCu9VfaQiJS9tp3neVjF9P5KoLxsZIaFdG',
    firstName: 'John',
    lastName: 'Anderson',
    isEmailConfirmed: false,
    createdAt: new Date('2021-12-21T15:20:49.751Z'),
    updatedAt: new Date('2021-12-21T15:20:49.751Z'),
  },
  {
    id: '6dc7149a-6768-4965-816e-baa1e0a30246',
    email: 'john2@email.com',
    password: '$2b$10$SEFMQ.prG.ELKwgOsiAqCu9VfaQiJS9tp3neVjF9P5KoLxsZIaFdG',
    firstName: 'John',
    lastName: 'Anderson',
    isEmailConfirmed: false,
    createdAt: new Date('2021-12-20T15:20:49.751Z'),
    updatedAt: new Date('2021-12-20T15:20:49.751Z'),
  },
  {
    id: '6dc7149a-6768-4965-816e-baa1e0a30245',
    email: 'john3@email.com',
    password: '$2b$10$SEFMQ.prG.ELKwgOsiAqCu9VfaQiJS9tp3neVjF9P5KoLxsZIaFdG',
    firstName: 'John',
    lastName: 'Anderson',
    isEmailConfirmed: false,
    createdAt: new Date('2021-12-19T15:20:49.751Z'),
    updatedAt: new Date('2021-12-19T15:20:49.751Z'),
  },
  {
    id: '6dc7149a-6768-4965-816e-baa1e0a30244',
    email: 'john4@email.com',
    password: '$2b$10$SEFMQ.prG.ELKwgOsiAqCu9VfaQiJS9tp3neVjF9P5KoLxsZIaFdG',
    firstName: 'John',
    lastName: 'Anderson',
    isEmailConfirmed: false,
    createdAt: new Date('2021-12-18T15:20:49.751Z'),
    updatedAt: new Date('2021-12-18T15:20:49.751Z'),
  },
];
