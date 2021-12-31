import { Request, Response } from 'express';
import { usersListMock } from 'src/graphql/modules/user/__mocks__/user';
import { prismaMock } from 'src/setupTests';
import { verifyTokenJWT } from '..';

describe('Middleware - auth', () => {
  it('should get the token and get the user', async () => {
    const req = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkYzcxNDlhLTY3NjgtNDk2NS04MTZlLWJhYTFlMGEzMDI0NyIsImlhdCI6MTUxNjIzOTAyMn0.8vUllqQFqu3duEn4nboLmSXBMmFfAlos-dLTZnQgiV4',
      },
    } as unknown as Request;

    const userMock = usersListMock[0];
    prismaMock.user.findUnique.mockResolvedValue(userMock);

    const res = jest.fn();
    const next = jest.fn();
    await verifyTokenJWT(req, res as unknown as Response, next, prismaMock);

    expect(req.user).toEqual(userMock);
    expect(req.error).toEqual(undefined);
    expect(next).toBeCalled();
  });

  it('should get the token and if don\'t find the payload id, throw a error "Invalid token"', async () => {
    const req = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZha2VAZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.AKnGqt6cKK1B12bLwkC24N2xUlqFiyuID9U0j7jmhJY',
      },
    } as unknown as Request;
    const res = jest.fn();
    const next = jest.fn();
    await verifyTokenJWT(req, res as unknown as Response, next, prismaMock);

    expect(req.user).toEqual(undefined);
    expect(req.error).toEqual(Error('Invalid token'));
    expect(next).toBeCalled();
  });

  it('should get the token and throw a error "User don\'t found"', async () => {
    const req = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkYzcxNDlhLTY3NjgtNDk2NS04MTZlLWJhYTFlMGEzMDI0NyIsImlhdCI6MTUxNjIzOTAyMn0.8vUllqQFqu3duEn4nboLmSXBMmFfAlos-dLTZnQgiV4',
      },
    } as unknown as Request;
    const res = jest.fn();
    const next = jest.fn();
    await verifyTokenJWT(req, res as unknown as Response, next, prismaMock);

    expect(req.user).toEqual(undefined);
    expect(req.error).toEqual(Error("User don't found"));
    expect(next).toBeCalled();
  });

  it('should not get the token and throw a error "JWT token was not found in request headers"', async () => {
    const req = {
      headers: {},
    } as unknown as Request;
    const res = jest.fn();
    const next = jest.fn();
    await verifyTokenJWT(req, res as unknown as Response, next, prismaMock);

    expect(req.user).toEqual(undefined);
    expect(req.error).toEqual(
      Error('JWT token was not found in request headers')
    );
    expect(next).toBeCalled();
  });

  it('should get a invalid token, throw a error "jwt malformed" and not get the user', async () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid token',
      },
    } as unknown as Request;
    const res = jest.fn();
    const next = jest.fn();
    await verifyTokenJWT(req, res as unknown as Response, next, prismaMock);

    expect(req.user).toEqual(undefined);
    expect(req.error).toEqual(Error('jwt malformed'));
    expect(next).toBeCalled();
  });
});
