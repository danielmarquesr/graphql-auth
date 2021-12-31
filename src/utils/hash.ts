import { createHash } from 'crypto';
import { hashSync, compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export const hashPassowrd = (password: string) =>
  hashSync(password, SALT_ROUNDS);

export const comparePassword = (password: string, hashed: string) =>
  compareSync(password, hashed);

export const signInUser = (payload: Record<string, unknown>) =>
  sign(payload, process.env.SECRET || 'some-real-secret', {
    algorithm: 'HS256',
    expiresIn: '90d',
  });

export const generateHashSHA256 = (data: Record<string, unknown>) =>
  createHash('sha256').update(JSON.stringify(data)).digest('hex');
