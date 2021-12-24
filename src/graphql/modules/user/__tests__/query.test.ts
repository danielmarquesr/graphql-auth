import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql } from 'graphql';
import resolvers from 'src/graphql/resolvers';
import typeDefs from 'src/graphql/typeDefs';
import { prismaMock } from 'src/setupTests';
import { usersListMock } from '../__mocks__/user';

const schema = makeExecutableSchema({ resolvers, typeDefs });

describe('User - query CurrentUser', () => {
  it('should get the current user logged in', async () => {
    const source = `
      {
        CurrentUser {
          id
          email
          firstName
          lastName
          isEmailConfirmed
          createdAt
          updatedAt
        }
      }
    `;

    const userMock = usersListMock[0];
    prismaMock.user.findUnique.mockResolvedValue(userMock);

    const req = { headers: { authorization: '' } };
    const { data } = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: {
        req: { user: userMock },
        prisma: prismaMock,
      },
    });

    expect(data?.CurrentUser).toEqual({
      id: userMock.id,
      email: userMock.email,
      firstName: userMock.firstName,
      lastName: userMock.lastName,
      isEmailConfirmed: userMock.isEmailConfirmed,
      createdAt: userMock.createdAt,
      updatedAt: userMock.updatedAt,
    });
  });
});
