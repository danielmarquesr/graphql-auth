import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql } from 'graphql';
import { prismaMock } from 'src/setupTests';
import resolvers from 'src/graphql/resolvers';
import typeDefs from 'src/graphql/typeDefs';
import { usersListMock } from '../__mocks__/user';
import { confirmationTokensMockList } from '../__mocks__/confirmationToken';

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

    const result = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: { prisma: prismaMock },
    });

    expect(prismaMock.user.create).toBeCalledWith({ data: userMock });
    expect(result.data?.SignUp).toEqual({
      id: userMock.id,
      email: userMock.email,
      firstName: userMock.firstName,
      lastName: userMock.lastName,
      isEmailConfirmed: userMock.isEmailConfirmed,
      createdAt: userMock.createdAt,
      updatedAt: userMock.updatedAt,
    });
  });

  it('should create ConfirmationToken after create User', async () => {
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

    const confirmationTokenMock = confirmationTokensMockList[0];
    prismaMock.confirmationToken.create.mockResolvedValue(
      confirmationTokenMock
    );

    await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: { prisma: prismaMock },
    });

    expect(prismaMock.confirmationToken.create).toBeCalled();
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

    const result = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: { prisma: prismaMock },
    });

    expect(prismaMock.user.create).not.toBeCalled();

    expect(result.errors && result.errors[0].message).toEqual(
      '2 errors occurred'
    );
    expect(result.data?.SignUp).toEqual(null);
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

    const userMock = usersListMock[1];
    prismaMock.user.findUnique.mockResolvedValue(userMock);

    const result = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: { prisma: prismaMock },
    });

    expect(prismaMock.user.findUnique).toBeCalled();

    expect(typeof (result.data?.SignIn as any).token).toEqual('string');
    expect((result.data?.SignIn as any).token.length > 0).toEqual(true);
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

    const result = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: { prisma: prismaMock },
    });

    expect(prismaMock.user.findUnique).toBeCalled();

    expect(result.errors && result.errors[0].message).toEqual(
      'Incorrect email or password'
    );
    expect(result.data?.SignIn).toEqual(null);
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

    const result = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: { prisma: prismaMock },
    });

    expect(prismaMock.user.findUnique).toBeCalled();

    expect(result.errors && result.errors[0].message).toEqual(
      'Incorrect email or password'
    );
    expect(result.data?.SignIn).toEqual(null);
  });

  it('should not sign in without the email confirmation and show a error', async () => {
    const source = `
      mutation {
        SignIn(input: { email: "john@email.com", password: "12345678" }) {
          token
        }
      }
    `;

    const userMock = usersListMock[0];
    prismaMock.user.findUnique.mockResolvedValue(userMock);

    const result = await graphql({
      schema,
      source,
      rootValue: null,
      contextValue: { prisma: prismaMock },
    });

    expect(prismaMock.user.findUnique).toBeCalled();

    expect(result.errors && result.errors[0].message).toEqual(
      'Need to confirm email'
    );
    expect(result.data?.SignIn).toEqual(null);
  });
});
