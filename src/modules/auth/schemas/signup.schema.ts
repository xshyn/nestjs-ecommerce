import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(8, 'Must be at least 8 characters')
      .max(64, 'Must be at most 64 characters')
      .refine((value) => /[a-z]/.test(value), 'Must contain a lowercase letter')
      .refine(
        (value) => /[A-Z]/.test(value),
        'Must contain an uppercase letter',
      )
      .refine((value) => /[0-9]/.test(value), 'Must contain a number')
      .refine(
        (value) => /[^a-zA-Z0-9]/.test(value),
        'Must contain a special character',
      ),
  })
  .required();

export type SignupDto = z.infer<typeof signupSchema>;
