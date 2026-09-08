import { z } from 'zod';
import { signupSchema } from './signup.schema';
import { createZodDto } from 'nestjs-zod';

export const loginSchema = signupSchema.extend({});

export class LoginDto extends createZodDto(loginSchema) {}
