import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql } from 'graphql';
import resolvers from 'src/graphql/resolvers';
import typeDefs from 'src/graphql/typeDefs';
import { prismaMock } from 'src/setupTests';
import { usersListMock } from '../__mocks__/user';

const schema = makeExecutableSchema({ resolvers, typeDefs });

describe('User - Users query', () => {
  it('should get the users list', async () => {
    const source = `
      {
        Users(cursor: "uuid-mock-test-1") {
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

    prismaMock.user.findMany.mockResolvedValue(usersListMock);

    const { data } = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: {
        req: { user: usersListMock[1] },
        prisma: prismaMock,
      },
    });

    const usersListMockWithoutPasswd = usersListMock.map((item) => ({
      id: item.id,
      email: item.email,
      firstName: item.firstName,
      lastName: item.lastName,
      isEmailConfirmed: item.isEmailConfirmed,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    expect(data).toEqual({ Users: usersListMockWithoutPasswd });
  });
});

describe('User - User query', () => {
  it('should get the user', async () => {
    const source = `
      {
        User(id: "uuid-mock-test-1") {
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

    const userMock = usersListMock[1];
    prismaMock.user.findUnique.mockResolvedValue(userMock);

    const { data } = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: {
        req: { user: userMock },
        prisma: prismaMock,
      },
    });

    const userMockWithoutPasswd = {
      id: userMock.id,
      email: userMock.email,
      firstName: userMock.firstName,
      lastName: userMock.lastName,
      isEmailConfirmed: userMock.isEmailConfirmed,
      createdAt: userMock.createdAt,
      updatedAt: userMock.updatedAt,
    };

    expect(data).toEqual({ User: userMockWithoutPasswd });
  });
});

describe('User - CurrentUser query', () => {
  it('should get the current user logged in', async () => {
    const source = `
      {
        CurrentUser {
          id
          email
          firstName
          lastName
          createdAt
          updatedAt
        }
      }
    `;

    const userMock = usersListMock[1];
    prismaMock.user.findUnique.mockResolvedValue(userMock);

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
      createdAt: userMock.createdAt,
      updatedAt: userMock.updatedAt,
    });
  });

  it('should get the message error "User email isn\'t confirmed" in response', async () => {
    const source = `
      {
        CurrentUser {
          id
          email
          firstName
          lastName
          createdAt
          updatedAt
        }
      }
    `;

    const userMock = usersListMock[0];
    prismaMock.user.findUnique.mockResolvedValue(userMock);

    const { data, errors } = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: {
        req: { user: userMock },
        prisma: prismaMock,
      },
    });

    expect(data?.CurrentUser).toEqual(null);
    expect(errors && errors[0].message).toEqual("User email isn't confirmed");
  });
});
