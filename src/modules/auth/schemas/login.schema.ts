import { z } from 'zod';
import { signupSchema } from './signup.schema';

export const loginSchema = signupSchema.extend({});

export type LoginDto = z.infer<typeof loginSchema>;
