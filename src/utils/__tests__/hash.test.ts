import {
  hashPassowrd,
  comparePassword,
  signInUser,
  generateHashSHA256,
} from '..';

it('should return the hashed password', () => {
  const password = '12345678';
  const hashed = hashPassowrd(password);
  expect(hashed).toBe('12345678');
});

it('should compare the correct password and the hashed password', () => {
  const password = '12345678';
  const hashed = hashPassowrd(password);
  const result = comparePassword(password, hashed);
  expect(result).toBeTruthy();
});

it('should compare the incorrect password and the hashed password', () => {
  const password = '12345678';
  const hashed = '123456789';
  const result = comparePassword(password, hashed);
  expect(result).toBeFalsy();
});

it('should return the jwt token', () => {
  const result = signInUser({ id: 'uuid-mock' });
  expect(result).toBe('jwt-token-mock-test');
});

it('should return the hash SHA256 from data', () => {
  const result = generateHashSHA256({ id: 'uuid-mock' });
  expect(result).toBe('hash-example');
});
