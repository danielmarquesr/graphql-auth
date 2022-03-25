import { Request } from 'express';
import { validateAuth } from '..';

it('should validate auth of a correct request', () => {
  const req = { user: { isEmailConfirmed: true } };
  const result = validateAuth(req as Request);
  expect(result).toEqual(req.user);
});

it('should throw error if request have error in', () => {
  expect(() => {
    const error: Error = { name: 'Error', message: 'error test' };
    const req = { error };
    validateAuth(req as Request);
  }).toThrow('error test');
});

it('should validate auth of request', () => {
  const req = {};
  expect(() => {
    validateAuth(req as Request);
  }).toThrow("Can't get the user from request");
});

it('should throw error if request have error in', () => {
  const req = { user: { isEmailConfirmed: false } };
  expect(() => {
    validateAuth(req as Request);
  }).toThrow("User email isn't confirmed");
});
