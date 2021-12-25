import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql } from 'graphql';
import { prismaMock } from 'src/setupTests';
import resolvers from 'src/graphql/resolvers';
import typeDefs from 'src/graphql/typeDefs';
import { usersListMock } from '../__mocks__/user';

const schema = makeExecutableSchema({ resolvers, typeDefs });

describe('User - mutation SignUp', () => {
  it('should sign up a valid user and return it', async () => {
    const source = `
      mutation {
        SignUp(
          input: { email: "john@email.com", password: "12345678", firstName: "John", lastName: "Anderson" }
        ) {
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
    prismaMock.user.create.mockResolvedValue(userMock);

    const { data } = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: { prisma: prismaMock },
    });

    expect(prismaMock.user.create).toBeCalled();
    expect(data?.SignUp).toEqual({
      id: userMock.id,
      email: userMock.email,
      firstName: userMock.firstName,
      lastName: userMock.lastName,
      createdAt: userMock.createdAt,
      updatedAt: userMock.updatedAt,
    });
  });

  it('should block the user from sign up with a invalid email and password and return a error', async () => {
    const source = `
      mutation {
        SignUp(
          input: { email: "johnemail.com", password: "123456", firstName: "John", lastName: "Anderson" }
        ) {
          id
          email
          firstName
          lastName
          createdAt
          updatedAt
        }
      }    
    `;

    const { data, errors } = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: { prisma: prismaMock },
    });

    expect(prismaMock.user.create).not.toBeCalled();

    expect(errors && errors[0].message).toEqual('2 errors occurred');
    expect(data?.SignUp).toEqual(null);
  });
});

describe('User - mutation SignIn', () => {
  it('should let a already created user sign in and return one jwt token', async () => {
    const source = `
      mutation {
        SignIn(input: { email: "john@email.com", password: "12345678" }) {
          token
        }
      }    
    `;

    const userMock = usersListMock[0];
    prismaMock.user.findUnique.mockResolvedValue(userMock);

    const { data } = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: { prisma: prismaMock },
    });

    expect(prismaMock.user.findUnique).toBeCalled();

    expect(typeof (data?.SignIn as any).token).toEqual('string');
    expect((data?.SignIn as any).token.length > 0).toEqual(true);
  });

  it('should not sign in a dont created user and show a error', async () => {
    const source = `
      mutation {
        SignIn(input: { email: "dont-exist@email.com", password: "88888888" }) {
          token
        }
      }    
    `;

    const userMock = usersListMock[0];
    prismaMock.user.findUnique.mockResolvedValue(userMock);

    const { data, errors } = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: { prisma: prismaMock },
    });

    expect(prismaMock.user.findUnique).toBeCalled();

    expect(errors && errors[0].message).toEqual('Incorrect email or password');
    expect(data?.SignIn).toEqual(null);
  });

  it('should not sign in with a wrong password and show a error', async () => {
    const source = `
      mutation {
        SignIn(input: { email: "john@email.com", password: "88888888" }) {
          token
        }
      }    
    `;

    const userMock = usersListMock[0];
    prismaMock.user.findUnique.mockResolvedValue(userMock);

    const { data, errors } = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: { prisma: prismaMock },
    });

    expect(prismaMock.user.findUnique).toBeCalled();

    expect(errors && errors[0].message).toEqual('Incorrect email or password');
    expect(data?.SignIn).toEqual(null);
  });
});
