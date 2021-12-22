import { createHash } from 'crypto';
import { hashSync, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export const hashPassowrd = (password: string) =>
  hashSync(password, SALT_ROUNDS);

export const comparePassword = (password: string, hashed: string) =>
  compareSync(password, hashed);

export const signInUser = (payload: Object) =>
  sign(payload, process.env.SECRET!, {
    algorithm: 'HS256',
    expiresIn: '90d',
  });

export const generateHashSHA256 = (data: any) =>
  createHash('sha256').update(JSON.stringify(data)).digest('hex');
