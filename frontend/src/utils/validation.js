import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});

export const registerSchema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().email('Invalid email format').nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});
