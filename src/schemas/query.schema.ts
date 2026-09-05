import { number, z } from 'zod';

export const withSkip = <T extends { page: number; limit: number }>(
  data: T,
) => {
  return {
    ...data,
    skip: (data.page - 1) * data.limit,
  };
};

export const queryBaseSchema = z.object({
  page: z.coerce.number<number>().int().min(1).max(100).optional().default(1),
  limit: z.coerce.number<number>().int().min(1).max(100).optional().default(10),
  search: z.string().optional(),
});

export const querySchema = queryBaseSchema.transform(withSkip);

export type QueryDto = z.infer<typeof querySchema>;
