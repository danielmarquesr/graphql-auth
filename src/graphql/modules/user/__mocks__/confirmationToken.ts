import { ConfirmationToken } from '@prisma/client';

export const confirmationTokensMockList: ConfirmationToken[] = [
  {
    id: '6dc7149a-6768-4965-816e-baa1e0a11247',
    token: 'c7976da4cd5c0f4e226326d7995eaa23e389fdd4cb7c32325c85a921c3224964',
    confirmedAt: null,
    expiredAt: new Date('2021-12-21T15:35:49.751Z'),
    userId: '6dc7149a-6768-4965-816e-baa1e0a30247',
    createdAt: new Date('2021-12-21T15:20:49.751Z'),
    updatedAt: new Date('2021-12-21T15:20:49.751Z'),
  },
];
